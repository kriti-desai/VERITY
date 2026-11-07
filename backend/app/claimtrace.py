
import re
from datetime import datetime, date, time


# -----------------------------------------
# TEXT PROCESSING
# -----------------------------------------

def normalize_text(text):
    text = (text or "").lower()
    text = re.sub(r"[^a-z0-9\s%]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_warranty_years(text):
    text = (text or "").lower()

    patterns = [
        r"\b(\d+)\s*[- ]?years?\s+warranty\b",
        r"\bwarranty\s+(?:is|of)\s+(\d+)\s*years?\b",
        r"\b(\d+)\s+years?\s+(?:of\s+)?warranty\b"
    ]

    matches = []

    for pattern in patterns:
        matches.extend(re.findall(pattern, text))

    return list(dict.fromkeys(int(value) for value in matches))


# -----------------------------------------
# EVIDENCE LIFECYCLE MANAGEMENT
# -----------------------------------------

def get_comparable_datetime(value, expiry=False):
    if value is None:
        return None

    if isinstance(value, str):
        try:
            value = datetime.fromisoformat(value)
        except ValueError:
            try:
                value = date.fromisoformat(value)
            except ValueError:
                return None

    if isinstance(value, datetime):
        if value.tzinfo is not None:
            value = value.astimezone().replace(tzinfo=None)

        return value

    if isinstance(value, date):
        if expiry:
            return datetime.combine(value, time.max)

        return datetime.combine(value, time.min)

    return None


def get_current_datetime():
    return datetime.now().astimezone().replace(tzinfo=None)


def parse_version(version):
    if not version:
        return None

    version = str(version).strip()

    if not re.fullmatch(r"\d+(?:\.\d+)*", version):
        return None

    try:
        return tuple(int(part) for part in version.split("."))
    except ValueError:
        return None


def is_higher_version(current, other):
    current_version = parse_version(current.version)
    other_version = parse_version(other.version)

    if current_version is None or other_version is None:
        return False

    return other_version > current_version


def is_effective_now(fact, now=None):
    if now is None:
        now = get_current_datetime()

    effective_date = get_comparable_datetime(fact.effective_date)
    expiry_date = get_comparable_datetime(
        fact.expiry_date,
        expiry=True
    )

    if effective_date and now < effective_date:
        return False

    if expiry_date and now > expiry_date:
        return False

    return True


def get_evidence_status(fact, all_facts):
    if not fact.is_approved:
        return "Pending Approval"

    now = get_current_datetime()

    effective_date = get_comparable_datetime(fact.effective_date)

    if effective_date and now < effective_date:
        return "Not Yet Effective"

    expiry_date = get_comparable_datetime(
        fact.expiry_date,
        expiry=True
    )

    if expiry_date and now > expiry_date:
        return "Expired"

    current_title = (fact.title or "").strip().lower()
    current_category = (fact.category or "").strip().lower()

    for other in all_facts:

        if other.id == fact.id:
            continue

        if not other.is_approved:
            continue

        other_title = (other.title or "").strip().lower()
        other_category = (other.category or "").strip().lower()

        if current_title != other_title:
            continue

        if current_category != other_category:
            continue

        if not is_higher_version(fact, other):
            continue

        if not is_effective_now(other, now):
            continue

        return "Superseded"

    return "Active"


def get_evidence_metadata(fact, all_facts):
    effective_date = fact.effective_date
    expiry_date = fact.expiry_date

    return {
        # Exact database evidence record
        "brand_fact_id": fact.id,

        # Evidence source information
        "source_reference": fact.source_reference,
        "source_version": fact.version,
        "source_name": fact.source_name,

        # Evidence validity information
        "effective_date": (
            effective_date.isoformat()
            if effective_date else None
        ),

        "expiry_date": (
            expiry_date.isoformat()
            if expiry_date else None
        ),

        "evidence_status": get_evidence_status(
            fact,
            all_facts
        )
    }


def get_active_evidence(all_facts):
    return [
        fact
        for fact in all_facts
        if get_evidence_status(fact, all_facts) == "Active"
    ]


# -----------------------------------------
# CLAIM EXTRACTION
# -----------------------------------------

def extract_claims(text):

    claims = []

    sentences = re.split(r"[.!?\n]+", text or "")

    claim_patterns = [
        r"\b\d+(?:\.\d+)?\s*%",
        r"\b\d+\s*[- ]?years?\b",
        r"\b(?:certified|guaranteed|approved|tested|proven)\b",
        r"\b(?:number one|no\.?\s*1|best|leading|fastest)\b",
        r"\b(?:free|zero|100%)\b",
        r"\b(?:reduces?|increases?|saves?|improves?|delivers?)\b"
    ]

    for sentence in sentences:

        sentence = sentence.strip()

        if not sentence:
            continue

        if any(
            re.search(pattern, sentence, re.IGNORECASE)
            for pattern in claim_patterns
        ):

            if sentence not in claims:
                claims.append(sentence)

    return claims


# -----------------------------------------
# EVIDENCE MATCHING
# -----------------------------------------

def get_tokens(text):

    ignored_words = {
        "the", "and", "for", "with", "from", "this",
        "that", "our", "your", "are", "is", "was",
        "were", "has", "have", "had", "will", "can",
        "a", "an", "of", "to", "in", "on", "by"
    }

    words = normalize_text(text).split()

    return {
        word for word in words
        if word not in ignored_words and len(word) > 2
    }


def find_relevant_evidence(claim, approved_facts):

    claim_tokens = get_tokens(claim)

    best_fact = None
    best_score = 0

    for fact in approved_facts:

        fact_tokens = get_tokens(
            fact.approved_content or ""
        )

        if not fact_tokens:
            continue

        common_words = claim_tokens.intersection(fact_tokens)

        score = len(common_words) / max(len(claim_tokens), 1)

        if score > best_score:
            best_score = score
            best_fact = fact

    if best_score >= 0.40:
        return best_fact, round(best_score * 100, 2)

    return None, round(best_score * 100, 2)


# -----------------------------------------
# WARRANTY ANALYSIS
# -----------------------------------------

def analyze_warranty(
    submitted_text,
    approved_facts,
    all_facts
):

    findings = []

    submitted_years = extract_warranty_years(submitted_text)

    if not submitted_years:
        return findings

    approved_years = []

    for fact in approved_facts:

        if (fact.category or "").strip().lower() == "warranty":

            years = extract_warranty_years(
                fact.approved_content or ""
            )

            for year in years:
                approved_years.append((year, fact))

    if not approved_years:

        findings.append({
            "claim": "Warranty claim",
            "status": "Unsupported",
            "brand_fact_id": None,
            "approved_fact": None,
            "source": None,
            "source_name": None,
            "source_reference": None,
            "source_version": None,
            "evidence_status": None,
            "reason": (
                "No currently active approved warranty "
                "evidence was found. Expired, superseded, "
                "or not-yet-effective evidence cannot "
                "verify this claim."
            ),
            "recommendation": (
                "Provide a currently active approved "
                "warranty source before publishing."
            )
        })

        return findings

    approved_years.sort(
        key=lambda item: (
            get_comparable_datetime(
                item[1].created_at
            ) or datetime.min,
            item[1].id or 0
        ),
        reverse=True
    )

    for submitted_year in submitted_years:

        matching = [
            (year, fact)
            for year, fact in approved_years
            if year == submitted_year
        ]

        if matching:

            approved_year, fact = matching[0]

            metadata = get_evidence_metadata(
                fact,
                all_facts
            )

            findings.append({
                "claim": f"{submitted_year}-year warranty",
                "status": "Verified against approved source",
                "approved_fact": fact.approved_content,
                "source": fact.source_name,
                **metadata,
                "reason": (
                    "The submitted warranty duration matches "
                    "the currently active approved brand record."
                ),
                "recommendation": (
                    "No warranty duration mismatch detected. "
                    "Human review is still required."
                )
            })

        else:

            approved_year, fact = approved_years[0]

            metadata = get_evidence_metadata(
                fact,
                all_facts
            )

            findings.append({
                "claim": f"{submitted_year}-year warranty",
                "status": "Contradiction",
                "approved_fact": fact.approved_content,
                "source": fact.source_name,
                **metadata,
                "reason": (
                    f"The submitted claim says {submitted_year} "
                    f"years, but the currently active approved "
                    f"record states {approved_year} years."
                ),
                "recommendation": (
                    f"Review and consider changing the claim to "
                    f"{approved_year}-year warranty."
                )
            })

    return findings


# -----------------------------------------
# MAIN CLAIMTRACE ANALYSIS
# -----------------------------------------

def analyze_content(submitted_text, approved_facts):

    findings = []

    # This list must contain all brand records,
    # including pending, expired and superseded records.
    all_facts = list(approved_facts)

    # Only active evidence can verify claims.
    active_facts = get_active_evidence(all_facts)

    # 1. Warranty analysis
    warranty_findings = analyze_warranty(
        submitted_text,
        active_facts,
        all_facts
    )

    findings.extend(warranty_findings)

    # 2. Prohibited phrase detection
    prohibited_phrases = [
        "100% pollution-free"
    ]

    for phrase in prohibited_phrases:

        if phrase.lower() in submitted_text.lower():

            findings.append({
                "claim": phrase,
                "status": "Prohibited",
                "brand_fact_id": None,
                "approved_fact": None,
                "source": "VERITY prohibited-claims policy",
                "source_name": "VERITY prohibited-claims policy",
                "source_reference": None,
                "source_version": "1.0",
                "evidence_status": "Policy rule",
                "reason": (
                    "This phrase is prohibited by the "
                    "current demo brand policy."
                ),
                "recommendation": (
                    "Remove this phrase before publication."
                )
            })

    # 3. Extract additional marketing claims
    extracted_claims = extract_claims(submitted_text)

    for claim in extracted_claims:

        if extract_warranty_years(claim):
            continue

        if any(
            phrase.lower() in claim.lower()
            for phrase in prohibited_phrases
        ):
            continue

        # 4. Find relevant active evidence
        evidence, score = find_relevant_evidence(
            claim,
            active_facts
        )

        if evidence:

            metadata = get_evidence_metadata(
                evidence,
                all_facts
            )

            findings.append({
                "claim": claim,
                "status": "Potentially supported - human review",
                "approved_fact": evidence.approved_content,
                "source": evidence.source_name,
                "evidence_match_score": score,
                **metadata,
                "reason": (
                    "A potentially relevant active approved "
                    "brand record was found using keyword "
                    "overlap. This does not prove the claim "
                    "is factually correct."
                ),
                "recommendation": (
                    "Compare the full claim with the approved "
                    "source before publication."
                )
            })

        else:

            findings.append({
                "claim": claim,
                "status": "Unsupported",
                "brand_fact_id": None,
                "approved_fact": None,
                "source": None,
                "source_name": None,
                "source_reference": None,
                "source_version": None,
                "evidence_status": None,
                "evidence_match_score": score,
                "reason": (
                    "No sufficiently relevant currently active "
                    "approved brand evidence was identified."
                ),
                "recommendation": (
                    "Provide an active approved source or "
                    "revise the claim before publication."
                )
            })

    # 5. Fallback when no rules are identified
    if not findings:

        findings.append({
            "claim": "No matching rule detected",
            "status": "Requires human review",
            "brand_fact_id": None,
            "approved_fact": None,
            "source": None,
            "source_name": None,
            "source_reference": None,
            "source_version": None,
            "evidence_status": None,
            "reason": (
                "The current ClaimTrace rules did not identify "
                "a matching claim or prohibited phrase."
            ),
            "recommendation": (
                "Review all marketing content before publication."
            )
        })

    return findings
