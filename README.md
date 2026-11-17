# VERITY – Evidence-Backed Brand Governance Platform

### Verify Marketing Claims. Protect Brand Integrity.

VERITY is an evidence-backed brand governance platform designed to verify marketing claims against administrator-approved brand information.

It helps organizations prevent unsupported, expired, contradictory and prohibited marketing claims through centralized evidence management and claim verification.

## 🎯 Problem Statement

Organizations often struggle to maintain accurate and consistent marketing information. Unsupported or outdated claims can damage brand credibility and create compliance risks.

VERITY addresses this problem by connecting marketing claims with approved brand evidence.

## ✨ Key Features

- **Brand Memory Vault:** Centralized storage of approved brand information and evidence.
- **ClaimTrace:** Analyzes marketing claims against approved brand facts.
- **Evidence Verification:** Identifies supported, unsupported and prohibited claims.
- **User Authentication:** Secure login and role-based access.
- **Approval Workflow:** Review and approve brand information before use.
- **Audit History:** Maintains records of important activities.
- **PDF Reports:** Generates downloadable claim analysis reports.
- **Evidence Lifecycle Management:** Tracks effective dates, expiry dates and superseded information.

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, JavaScript |
| Backend | Python, FastAPI |
| Database | SQLite |
| ORM | SQLAlchemy |
| Authentication | JWT |
| API Documentation | Swagger UI |
| PDF Generation | ReportLab |

## 🏗️ Project Structure

```text
VERITY/
│
├── backend/
│   └── app/
│       ├── main.py
│       ├── models.py
│       ├── schemas.py
│       ├── database.py
│       ├── claimtrace.py
│       └── report_generator.py
│
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       └── main.jsx
│
├── main.py
└── README.md
```

## 🚀 Running the Project Locally

### Backend

From the project root:

```bash
python -m uvicorn backend.app.main:app --reload
```

Backend API:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

### Frontend

Navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

## 💡 Future Improvements

- Advanced analytics dashboard.
- More comprehensive evidence verification.
- Enhanced reporting and compliance insights.
- Integration with additional business systems.

## 👩‍💻 Developer

**Kriti Desai**

Information Science Engineering Student  
BNMIT, Bengaluru

GitHub: https://github.com/kriti-desai

---

⭐ If you find this project interesting, consider giving the repository a star!

---

## 📸 Application Screenshots

### ClaimTrace – Marketing Claim Analysis

![ClaimTrace Results](claimtrace-results.png)

### VERITY Dashboard

![Dashboard](dashboard.png)### Brand Memory Vault

![Brand Memory Vault](brand-memory-vault.png)

