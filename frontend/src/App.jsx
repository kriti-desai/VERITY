
import { useEffect, useState } from "react";

const API = "https://verity-qaxz.onrender.com";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');

*{box-sizing:border-box}
body{margin:0;background:#080d19;color:#e8edf7;font-family:'DM Sans',sans-serif}
button,input,textarea,select{font:inherit}
button{cursor:pointer}
.app{min-height:100vh;display:flex}
.sidebar{width:245px;background:#0c1424;border-right:1px solid #202c40;padding:27px 17px;display:flex;flex-direction:column;flex-shrink:0}
.brand{display:flex;align-items:center;gap:11px;padding:0 10px 35px}
.logo{width:37px;height:37px;border-radius:11px;background:linear-gradient(135deg,#39a9ff,#6555e9);display:grid;place-items:center;font-family:'Space Grotesk';font-weight:700;font-size:19px;color:white}
.brandname{font:700 21px 'Space Grotesk';letter-spacing:2px}
.brandtag{font-size:9px;color:#8291aa;letter-spacing:1.2px;margin-top:3px}
.navlabel{font-size:10px;color:#687891;letter-spacing:1.5px;padding:0 12px;margin:14px 0 10px}
.nav{width:100%;border:0;background:transparent;color:#93a2b9;padding:12px;border-radius:9px;text-align:left;display:flex;align-items:center;gap:12px;margin:3px 0;font-size:13px}
.nav:hover,.nav.active{background:#182843;color:#65b8ff}
.nav.active{box-shadow:inset 3px 0 #42a5ff}
.sidebottom{margin-top:auto;border-top:1px solid #202c40;padding:18px 10px 0;color:#71829b;font-size:11px;line-height:1.7}
.main{flex:1;min-width:0;padding:30px 4.2%;max-width:1600px;margin:auto}
.topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:34px;gap:15px}
.eyebrow{color:#5baeff;font-size:11px;letter-spacing:1.8px;font-weight:700}
h1{font:600 29px 'Space Grotesk';margin:8px 0}
.sub{color:#91a0b7;font-size:13px}
.user{border:1px solid #27364d;background:#101a2b;border-radius:30px;padding:8px 14px;color:#dce7f8;font-size:12px}
.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:15px;margin-bottom:25px}
.panel,.stat{background:#101a2b;border:1px solid #223149;border-radius:14px}
.stat{padding:19px}
.statlabel{font-size:11px;color:#91a0b7}
.statvalue{font:600 27px 'Space Grotesk';margin:12px 0 5px}
.statfoot{font-size:10px;color:#6d819d}
.panel{padding:22px;margin-bottom:19px}
.panelhead{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:18px}
h2{font:600 17px 'Space Grotesk';margin:0}
h3{font-size:13px;margin:0 0 8px}
.muted{color:#91a0b7;font-size:12px;line-height:1.6}
.btn{border:0;border-radius:8px;padding:11px 16px;background:#328ff0;color:white;font-size:12px;font-weight:700}
.btn:hover{background:#4aa4ff}
.btn.secondary{background:#1b2a40;border:1px solid #30445f;color:#c7d7ed}
.btn.small{padding:7px 10px;font-size:11px}
.btn:disabled{opacity:.5;cursor:not-allowed}
.row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.activity{display:flex;align-items:flex-start;gap:13px;padding:14px 0;border-bottom:1px solid #202c40}
.activity:last-child{border:0}
.dot{width:9px;height:9px;border-radius:50%;background:#4ca9ff;margin-top:5px;flex-shrink:0}
.badge{font-size:10px;border-radius:20px;padding:5px 9px;background:#1c3049;color:#81c3ff;display:inline-block;white-space:nowrap}
.badge.red{background:#3b202b;color:#ff9ca9}
.badge.green{background:#16352e;color:#76dfb5}
.badge.amber{background:#3a3020;color:#f4c878}
.badge.gray{background:#273244;color:#b4c0d0}
.input,.textarea,.select{width:100%;background:#0b1423;border:1px solid #30415a;border-radius:8px;padding:12px;color:#e8edf7;outline:none;margin-top:7px;font-size:13px}
.input:focus,.textarea:focus,.select:focus{border-color:#4ba8ff}
.textarea{min-height:145px;resize:vertical;line-height:1.6}
.field{margin-bottom:15px}
.field label{font-size:11px;color:#aab8cb;font-weight:600}
.two{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.fact{padding:16px;border:1px solid #27374f;border-radius:10px;margin-bottom:10px;background:#0c1626}
.facttitle{font-size:13px;font-weight:700;margin-bottom:6px}
.factmeta{font-size:10px;color:#8496b0;line-height:1.9}
.finding{border:1px solid #2a3b54;border-radius:10px;padding:16px;margin:12px 0;background:#0c1626}
.findingtop{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:10px}
.notice{padding:12px 14px;background:#142b42;border:1px solid #275071;color:#a9d7ff;border-radius:9px;font-size:12px;margin:12px 0}
.error{background:#3b202b;border-color:#743847;color:#ffb3bd}
.empty{text-align:center;padding:35px;color:#8293aa;font-size:12px}
.footer{font-size:10px;color:#667992;text-align:center;padding:20px}
.editbox{padding:16px;border:1px solid #397bb5;background:#101f32;border-radius:10px;margin-top:14px}
.audit-details{font-size:11px;line-height:1.7;color:#b8c7dc;overflow-wrap:anywhere;white-space:pre-wrap}
.authpage{min-height:100vh;background:#080d19;display:grid;place-items:center;padding:20px}
.authcard{width:100%;max-width:440px;background:#101a2b;border:1px solid #263750;border-radius:17px;padding:30px;box-shadow:0 20px 70px #0005}
.authbrand{display:flex;align-items:center;gap:12px;margin-bottom:25px}
.authswitch{color:#65b8ff;background:none;border:0;padding:0;font-size:12px}
.tablewrap{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:12px}
th,td{text-align:left;padding:13px;border-bottom:1px solid #26354b}
th{color:#91a0b7;font-weight:600}
@media(max-width:850px){
.sidebar{width:190px}
.grid{grid-template-columns:repeat(2,1fr)}
.main{padding:22px}
}
@media(max-width:600px){
.app{display:block}
.sidebar{width:100%;padding:12px;display:block}
.brand{padding:4px 8px 12px}
.navlabel,.sidebottom{display:none}
.nav{display:inline-flex;width:auto;padding:9px;font-size:11px}
.main{padding:20px 14px}
.grid{grid-template-columns:1fr 1fr}
.two{grid-template-columns:1fr}
.topbar{align-items:flex-start}
.user{display:none}
}
/* ================================
   VERITY FINAL UI POLISH
================================ */

.progress-track {
    width: 100%;
    height: 9px;
    background: rgba(148, 163, 184, 0.16);
    border-radius: 20px;
    overflow: hidden;
    margin: 12px 0;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #6366f1, #22c55e);
    border-radius: 20px;
    transition: width 0.4s ease;
}

.stat {
    transition: transform 0.2s ease, border-color 0.2s ease;
}

.stat:hover {
    transform: translateY(-3px);
}

button {
    transition: transform 0.2s ease, opacity 0.2s ease;
}

button:hover:not(:disabled) {
    transform: translateY(-2px);
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Responsive layout */
@media (max-width: 768px) {
    .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .two {
        grid-template-columns: 1fr;
    }

    .row {
        flex-wrap: wrap;
    }

    .panel {
        padding: 16px;
    }
}

@media (max-width: 480px) {
    .grid {
        grid-template-columns: 1fr;
    }
}
`;

function getEvidenceStatus(fact, allFacts) {
    if (!fact.is_approved) return "Pending Approval";

    const now = new Date();

    if (fact.effective_date) {
        const effective = new Date(fact.effective_date);

        if (!Number.isNaN(effective.getTime()) && now < effective) {
            return "Not Yet Effective";
        }
    }

    if (fact.expiry_date) {
        const expiry = new Date(fact.expiry_date);

        if (!Number.isNaN(expiry.getTime()) && now > expiry) {
            return "Expired";
        }
    }

    function parseVersion(version) {
        if (!version) return null;

        const parts = String(version).trim().split(".");

        if (!parts.every(part => /^\d+$/.test(part))) {
            return null;
        }

        return parts.map(Number);
    }

    function isHigherVersion(newVersion, oldVersion) {
        const newer = parseVersion(newVersion);
        const older = parseVersion(oldVersion);

        if (!newer || !older) return false;

        const length = Math.max(newer.length, older.length);

        for (let i = 0; i < length; i++) {
            const a = newer[i] || 0;
            const b = older[i] || 0;

            if (a > b) return true;
            if (a < b) return false;
        }

        return false;
    }

    const hasNewerEffectiveVersion = allFacts.some(item => {
        if (item.id === fact.id || !item.is_approved) return false;

        if (
            item.title?.trim().toLowerCase() !== fact.title?.trim().toLowerCase() ||
            item.category?.trim().toLowerCase() !== fact.category?.trim().toLowerCase()
        ) {
            return false;
        }

        if (!isHigherVersion(item.version, fact.version)) return false;

        if (item.effective_date) {
            const effective = new Date(item.effective_date);

            if (!Number.isNaN(effective.getTime()) && now < effective) {
                return false;
            }
        }

        if (item.expiry_date) {
            const expiry = new Date(item.expiry_date);

            if (!Number.isNaN(expiry.getTime()) && now > expiry) {
                return false;
            }
        }

        return true;
    });

    return hasNewerEffectiveVersion ? "Superseded" : "Active";
}

function statusColor(status) {
    if (
        status === "Active" ||
        status === "Verified against approved source"
    ) {
        return "green";
    }

    if (
        ["Expired", "Superseded", "Contradiction", "Prohibited", "DELETED"].includes(status)
    ) {
        return "red";
    }

    if (
        ["Pending Approval", "Not Yet Effective", "METADATA_UPDATED"].includes(status)
    ) {
        return "amber";
    }

    return "gray";
}

function formatDate(value) {
    if (!value) return "Not specified";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function formatAuditDetails(details) {
    if (!details) return "No additional details.";

    try {
        return JSON.stringify(JSON.parse(details), null, 2);
    } catch {
        return details;
    }
}

function App() {
    const [token, setToken] = useState(
        () => sessionStorage.getItem("verity_token") || ""
    );

    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(sessionStorage.getItem("verity_user") || "null");
        } catch {
            return null;
        }
    });

    const [authMode, setAuthMode] = useState("login");

    const [authForm, setAuthForm] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [page, setPage] = useState("Dashboard");
    const [facts, setFacts] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [auditFilter, setAuditFilter] = useState("ALL");

    const [content, setContent] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [editForm, setEditForm] = useState({
        source_name: "",
        source_reference: ""
    });

    const [form, setForm] = useState({
        title: "",
        category: "Warranty",
        approved_content: "",
        source_name: "",
        source_reference: "",
        version: "1.0",
        approved_by: "",
        effective_date: "",
        expiry_date: ""
    });

    const isAdmin = user?.role === "admin";
    const isReviewer = user?.role === "reviewer";
    const canApprove = isAdmin || isReviewer;

    async function apiRequest(path, options = {}) {
        const headers = {
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {})
        };

        return fetch(`${API}${path}`, {
            ...options,
            headers
        });
    }

    async function readResponse(response) {
        return response.json().catch(() => ({}));
    }

    function saveSession(data) {
        sessionStorage.setItem("verity_token", data.access_token);
        sessionStorage.setItem("verity_user", JSON.stringify(data.user));

        setToken(data.access_token);
        setUser(data.user);
        setPage("Dashboard");
        setError("");
        setMessage(`Welcome, ${data.user.username}.`);
    }

    function logout() {
        sessionStorage.removeItem("verity_token");
        sessionStorage.removeItem("verity_user");

        setToken("");
        setUser(null);
        setFacts([]);
        setAuditLogs([]);
        setUsers([]);
        setResults(null);
        setPage("Dashboard");
        setMessage("");
        setError("");
    }

    async function submitAuth(e) {
        e.preventDefault();

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const endpoint = authMode === "login" ? "/login" : "/register";

            const payload = authMode === "login"
                ? {
                    username: authForm.username.trim(),
                    password: authForm.password
                }
                : {
                    username: authForm.username.trim(),
                    email: authForm.email.trim(),
                    password: authForm.password
                };

            const response = await fetch(`${API}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await readResponse(response);

            if (!response.ok) {
                const detail = data.detail;

                throw new Error(
                    typeof detail === "string"
                        ? detail
                        : JSON.stringify(detail || data)
                );
            }

            saveSession(data);

            setAuthForm({
                username: "",
                email: "",
                password: ""
            });
        } catch (err) {
            setError(err.message || "Authentication failed.");
        } finally {
            setLoading(false);
        }
    }

    async function loadFacts() {
        try {
            const response = await apiRequest("/brand-facts");
            const data = await readResponse(response);

            if (!response.ok) {
                throw new Error(data.detail || "Could not load brand facts.");
            }

            setFacts(data);
        } catch (err) {
            setError(String(err.message || "Could not load brand facts."));
        }
    }

    async function loadAuditLogs() {
        if (!isAdmin) return;

        setLoading(true);
        setError("");

        try {
            const response = await apiRequest("/audit-logs");
            const data = await readResponse(response);

            if (!response.ok) {
                throw new Error(data.detail || "Could not load audit history.");
            }

            setAuditLogs(data);
        } catch (err) {
            setError(String(err.message));
        } finally {
            setLoading(false);
        }
    }

    async function loadUsers() {
        if (!isAdmin) return;

        try {
            const response = await apiRequest("/users");
            const data = await readResponse(response);

            if (!response.ok) {
                throw new Error(data.detail || "Could not load users.");
            }

            setUsers(data);
        } catch (err) {
            setError(String(err.message));
        }
    }

    useEffect(() => {
        if (token && user) {
            loadFacts();

            if (user.role === "admin") {
                loadUsers();
            }
        }
    }, [token, user?.role]);

    async function addFact(e) {
        e.preventDefault();

        if (!isAdmin) {
            setError("Only administrators can create brand records.");
            return;
        }

        if (
            form.effective_date &&
            form.expiry_date &&
            new Date(form.expiry_date) <= new Date(form.effective_date)
        ) {
            setError("Expiry date must be later than effective date.");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const payload = {
                ...form,
                approved_by: user.username,
                effective_date: form.effective_date || null,
                expiry_date: form.expiry_date || null
            };

            const response = await apiRequest("/brand-facts", {
                method: "POST",
                body: JSON.stringify(payload)
            });

            const data = await readResponse(response);

            if (!response.ok) {
                throw new Error(data.detail || "Could not create record.");
            }

            setMessage("Brand fact submitted. It is awaiting approval.");

            setForm({
                title: "",
                category: "Warranty",
                approved_content: "",
                source_name: "",
                source_reference: "",
                version: "1.0",
                approved_by: "",
                effective_date: "",
                expiry_date: ""
            });

            await loadFacts();
        } catch (err) {
            setError(String(err.message));
        } finally {
            setLoading(false);
        }
    }

    function startEdit(fact) {
        setEditingId(fact.id);

        setEditForm({
            source_name: fact.source_name || "",
            source_reference: fact.source_reference || ""
        });

        setError("");
        setMessage("");
    }

    function cancelEdit() {
        setEditingId(null);

        setEditForm({
            source_name: "",
            source_reference: ""
        });
    }

    async function saveEdit(id) {
        if (!isAdmin) return;

        if (editForm.source_name.trim().length < 2) {
            setError("Source name must contain at least 2 characters.");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await apiRequest(`/brand-facts/${id}/metadata`, {
                method: "PATCH",
                body: JSON.stringify({
                    source_name: editForm.source_name.trim(),
                    source_reference: editForm.source_reference.trim() || null
                })
            });

            const data = await readResponse(response);

            if (!response.ok) {
                throw new Error(data.detail || "Could not update metadata.");
            }

            setMessage("Evidence source details updated successfully.");
            setEditingId(null);

            await loadFacts();
        } catch (err) {
            setError(String(err.message));
        } finally {
            setLoading(false);
        }
    }

    async function approveFact(id) {
        if (!canApprove) return;

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await apiRequest(`/brand-facts/${id}/approve`, {
                method: "PATCH"
            });

            const data = await readResponse(response);

            if (!response.ok) {
                throw new Error(data.detail || "Approval failed.");
            }

            setMessage("Brand fact approved successfully.");
            await loadFacts();
        } catch (err) {
            setError(String(err.message));
        } finally {
            setLoading(false);
        }
    }

    async function deleteFact(id) {
        if (!isAdmin) return;

        if (!window.confirm("Delete this brand fact?")) return;

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await apiRequest(`/brand-facts/${id}`, {
                method: "DELETE"
            });

            const data = await readResponse(response);

            if (!response.ok) {
                throw new Error(data.detail || "Could not delete this fact.");
            }

            setMessage("Brand fact deleted.");
            await loadFacts();
        } catch (err) {
            setError(String(err.message));
        } finally {
            setLoading(false);
        }
    }

    async function analyze() {
        if (content.trim().length < 5) {
            setError("Please enter at least 5 characters of content.");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");
        setResults(null);

        try {
            const response = await apiRequest("/analyze", {
                method: "POST",
                body: JSON.stringify({ content })
            });

            const data = await readResponse(response);

            if (!response.ok) {
                throw new Error(data.detail || "Analysis failed.");
            }

            setResults(data);
        } catch (err) {
            setError("Analysis failed. " + err.message);
        } finally {
            setLoading(false);
        }
    }
async function downloadReport() {
    if (!content.trim()) {
        setError("Please enter content before downloading a report.");
        return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
        const response = await apiRequest("/analyze/report", {
            method: "POST",
            body: JSON.stringify({ content })
        });

        if (!response.ok) {
            const data = await readResponse(response);
            throw new Error(data.detail || "Could not generate PDF report.");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "VERITY_Evidence_Report.pdf";

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);

        setMessage("PDF report downloaded successfully.");
    } catch (err) {
        setError(err.message || "PDF download failed.");
    } finally {
        setLoading(false);
    }
}
    async function updateRole(id, role) {
        if (!isAdmin) return;

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await apiRequest(`/users/${id}/role`, {
                method: "PATCH",
                body: JSON.stringify({ role })
            });

            const data = await readResponse(response);

            if (!response.ok) {
                throw new Error(data.detail || "Could not update role.");
            }

            setMessage("User role updated successfully.");
            await loadUsers();
        } catch (err) {
            setError(String(err.message));
            await loadUsers();
        } finally {
            setLoading(false);
        }
    }

    const approved = facts.filter(f => f.is_approved).length;
    const pending = facts.length - approved;

    const lifecycleCounts = {
        active: facts.filter(f => getEvidenceStatus(f, facts) === "Active").length,
        expired: facts.filter(f => getEvidenceStatus(f, facts) === "Expired").length,
        future: facts.filter(f => getEvidenceStatus(f, facts) === "Not Yet Effective").length,
        superseded: facts.filter(f => getEvidenceStatus(f, facts) === "Superseded").length
    };

    function Header({ title, subtitle }) {
        return (
            <div className="topbar">
                <div>
                    <div className="eyebrow">BRAND GOVERNANCE PLATFORM</div>
                    <h1>{title}</h1>
                    <div className="sub">{subtitle}</div>
                </div>

                <div className="row">
                    <div className="user">
                        ● {user?.username} · {user?.role?.toUpperCase()}
                    </div>

                    <button className="btn secondary small" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        );
    }


function Dashboard() {
    const approvalRate = facts.length > 0
        ? Math.round((approved / facts.length) * 100)
        : 0;

    const evidenceHealth = facts.length > 0
        ? Math.round((lifecycleCounts.active / facts.length) * 100)
        : 0;

    const stats = [
        {
            label: "Total brand records",
            value: facts.length,
            detail: "Saved in Brand Memory Vault",
            icon: "▤"
        },
        {
            label: "Approved records",
            value: approved,
            detail: `${approvalRate}% approval rate`,
            icon: "✓"
        },
        {
            label: "Active evidence",
            value: lifecycleCounts.active,
            detail: `${evidenceHealth}% of all records`,
            icon: "◈"
        },
        {
            label: "Awaiting approval",
            value: pending,
            detail: "Require reviewer action",
            icon: "◷"
        }
    ];

    return (
        <>
            <Header
                title="Dashboard"
                subtitle="Monitor your brand governance performance and evidence health."
            />

            <div className="grid">
                {stats.map((item, index) => (
                    <div className="stat" key={index}>
                        <div className="statlabel">
                            {item.icon} {item.label}
                        </div>
                        <div className="statvalue">{item.value}</div>
                        <div className="statfoot">{item.detail}</div>
                    </div>
                ))}
            </div>

            <div className="panel">
                <div className="panelhead">
                    <div>
                        <h2>Governance analytics</h2>
                        <div className="muted">
                            Current status of your brand evidence.
                        </div>
                    </div>
                    <span className="badge green">Live overview</span>
                </div>

                <div className="two">
                    <div>
                        <div className="statlabel">Approval progress</div>
                        <h2>{approvalRate}%</h2>
                        <div className="progress-track">
                            <div
                                className="progress-fill"
                                style={{ width: `${approvalRate}%` }}
                            />
                        </div>
                        <div className="muted">
                            {approved} of {facts.length} records approved
                        </div>
                    </div>

                    <div>
                        <div className="statlabel">Active evidence health</div>
                        <h2>{evidenceHealth}%</h2>
                        <div className="progress-track">
                            <div
                                className="progress-fill"
                                style={{ width: `${evidenceHealth}%` }}
                            />
                        </div>
                        <div className="muted">
                            {lifecycleCounts.active} currently active records
                        </div>
                    </div>
                </div>
            </div>

            <div className="panel">
                <div className="panelhead">
                    <h2>Evidence lifecycle</h2>
                    <span className="badge green">Status overview</span>
                </div>

                <div className="grid">
                    {[
                        ["Active", lifecycleCounts.active],
                        ["Expired", lifecycleCounts.expired],
                        ["Future", lifecycleCounts.future],
                        ["Superseded", lifecycleCounts.superseded]
                    ].map(([label, value]) => (
                        <div className="stat" key={label}>
                            <div className="statlabel">{label}</div>
                            <div className="statvalue">{value}</div>
                        </div>
                    ))}
                </div>

                <div className="muted">
                    Evidence validity is based on approval, effective dates,
                    expiry dates and record-version history.
                </div>
            </div>

            <div className="panel">
                <div className="panelhead">
                    <div>
                        <h2>Recent brand records</h2>
                        <div className="muted">
                            Latest records added to the vault.
                        </div>
                    </div>

                    <button
                        className="btn secondary small"
                        onClick={() => setPage("Brand Memory Vault")}
                    >
                        View all →
                    </button>
                </div>

                {facts.slice(-5).reverse().map(f => {
                    const status = getEvidenceStatus(f, facts);

                    return (
                        <div className="activity" key={f.id}>
                            <div className="dot" />

                            <div style={{ flex: 1 }}>
                                <h3>{f.title}</h3>
                                <div className="muted">
                                    {f.category} · {f.source_name}
                                </div>
                            </div>

                            <span className={`badge ${statusColor(status)}`}>
                                {status}
                            </span>
                        </div>
                    );
                })}

                {facts.length === 0 && (
                    <div className="empty">
                        No brand records available yet.
                    </div>
                )}
            </div>

            <div className="panel">
                <div className="panelhead">
                    <div>
                        <h2>Quick actions</h2>
                        <div className="muted">
                            Continue managing your brand governance.
                        </div>
                    </div>
                </div>

                <div className="row">
                    <button
                        className="btn"
                        onClick={() => setPage("ClaimTrace")}
                    >
                        Analyze content →
                    </button>

                    <button
                        className="btn secondary"
                        onClick={() => setPage("Brand Memory Vault")}
                    >
                        Open Brand Vault
                    </button>

                    {isAdmin && (
                        <button
                            className="btn secondary"
                            onClick={() => setPage("Audit History")}
                        >
                            View audit history
                        </button>
                    )}
                </div>

                <div className="notice">
                    Signed in as {user?.username} · Role: {user?.role}.
                    Your available actions depend on your assigned role.
                </div>
            </div>
        </>
    );
}


    function Vault() {
        return (
            <>
                <Header
                    title="Brand Memory Vault"
                    subtitle="Manage approved facts, sources and evidence lifecycle."
                />

                {isAdmin && (
                    <div className="panel">
                        <div className="panelhead">
                            <div>
                                <h2>Add a brand record</h2>
                                <div className="muted">
                                    New records enter the vault as pending approval.
                                </div>
                            </div>

                            <span className="badge">Admin workspace</span>
                        </div>

                        <form onSubmit={addFact}>
                            <div className="two">
                                <div className="field">
                                    <label>Record title</label>

                                    <input
                                        className="input"
                                        required
                                        minLength="2"
                                        placeholder="e.g. Standard Warranty"
                                        value={form.title}
                                        onChange={e =>
                                            setForm({ ...form, title: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="field">
                                    <label>Category</label>

                                    <select
                                        className="select"
                                        value={form.category}
                                        onChange={e =>
                                            setForm({ ...form, category: e.target.value })
                                        }
                                    >
                                        <option>Warranty</option>
                                        <option>Product Fact</option>
                                        <option>Brand Guideline</option>
                                        <option>Terminology</option>
                                        <option>Prohibited Claim</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="field">
                                <label>Approved content / policy statement</label>

                                <textarea
                                    className="textarea"
                                    required
                                    placeholder="Enter the exact fact or approved policy..."
                                    value={form.approved_content}
                                    onChange={e =>
                                        setForm({
                                            ...form,
                                            approved_content: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="two">
                                <div className="field">
                                    <label>Source name</label>

                                    <input
                                        className="input"
                                        required
                                        placeholder="e.g. Product Specification"
                                        value={form.source_name}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                source_name: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="field">
                                    <label>Source reference</label>

                                    <input
                                        className="input"
                                        placeholder="Document ID or reference"
                                        value={form.source_reference}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                source_reference: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="field">
                                    <label>Version</label>

                                    <input
                                        className="input"
                                        value={form.version}
                                        onChange={e =>
                                            setForm({ ...form, version: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="field">
                                    <label>Responsible owner</label>

                                    <input
                                        className="input"
                                        value={user?.username || ""}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="panelhead">
                                <div>
                                    <h2>Evidence validity period</h2>
                                    <div className="muted">
                                        Set when this evidence becomes valid and when
                                        it expires.
                                    </div>
                                </div>

                                <span className="badge">Lifecycle</span>
                            </div>

                            <div className="two">
                                <div className="field">
                                    <label>Effective date</label>

                                    <input
                                        className="input"
                                        type="datetime-local"
                                        value={form.effective_date}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                effective_date: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="field">
                                    <label>Expiry date</label>

                                    <input
                                        className="input"
                                        type="datetime-local"
                                        value={form.expiry_date}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                expiry_date: e.target.value
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="notice">
                                Leave a date empty if no effective date or expiry date
                                has been specified by the source.
                            </div>

                            <button className="btn" disabled={loading}>
                                {loading ? "Saving..." : "Submit brand record"}
                            </button>
                        </form>
                    </div>
                )}

                {!isAdmin && (
                    <div className="notice">
                        {isReviewer
                            ? "Reviewer access: you can view records and approve pending evidence. Record creation, editing and deletion are restricted to Admins."
                            : "Viewer access: you can view brand records and use ClaimTrace. Evidence changes are restricted."}
                    </div>
                )}

                <div className="panel">
                    <div className="panelhead">
                        <h2>Stored brand records ({facts.length})</h2>

                        <button
                            className="btn secondary small"
                            onClick={loadFacts}
                        >
                            ↻ Refresh
                        </button>
                    </div>

                    {facts.map(f => {
                        const status = getEvidenceStatus(f, facts);
                        const isEditing = editingId === f.id;

                        return (
                            <div className="fact" key={f.id}>
                                <div className="panelhead" style={{ marginBottom: 8 }}>
                                    <div className="facttitle">{f.title}</div>

                                    <span className={`badge ${statusColor(status)}`}>
                                        {status}
                                    </span>
                                </div>

                                <div className="muted">{f.approved_content}</div>

                                <div className="factmeta" style={{ marginTop: 9 }}>
                                    Category: {f.category}<br />
                                    Source: {f.source_name || "Not supplied"}<br />
                                    Reference: {f.source_reference || "Not supplied"}<br />
                                    Version: {f.version || "Not supplied"}<br />
                                    Owner: {f.approved_by || "Not supplied"}<br />
                                    Effective: {formatDate(f.effective_date)}<br />
                                    Expires: {formatDate(f.expiry_date)}<br />
                                    Created: {formatDate(f.created_at)}
                                </div>

                                {isEditing && (
                                    <div className="editbox">
                                        <h3>Edit evidence source details</h3>

                                        <div className="field">
                                            <label>Source name</label>

                                            <input
                                                className="input"
                                                value={editForm.source_name}
                                                onChange={e =>
                                                    setEditForm({
                                                        ...editForm,
                                                        source_name: e.target.value
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="field">
                                            <label>Source reference</label>

                                            <input
                                                className="input"
                                                value={editForm.source_reference}
                                                onChange={e =>
                                                    setEditForm({
                                                        ...editForm,
                                                        source_reference: e.target.value
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="row">
                                            <button
                                                className="btn small"
                                                disabled={loading}
                                                onClick={() => saveEdit(f.id)}
                                            >
                                                {loading ? "Saving..." : "Save changes"}
                                            </button>

                                            <button
                                                className="btn secondary small"
                                                disabled={loading}
                                                onClick={cancelEdit}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="row" style={{ marginTop: 12 }}>
                                    {isAdmin && !isEditing && (
                                        <button
                                            className="btn secondary small"
                                            disabled={loading || editingId !== null}
                                            onClick={() => startEdit(f)}
                                        >
                                            Edit source
                                        </button>
                                    )}

                                    {!f.is_approved && canApprove && (
                                        <button
                                            className="btn small"
                                            disabled={loading}
                                            onClick={() => approveFact(f.id)}
                                        >
                                            Approve record
                                        </button>
                                    )}

                                    {isAdmin && (
                                        <button
                                            className="btn secondary small"
                                            disabled={loading || isEditing}
                                            onClick={() => deleteFact(f.id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {facts.length === 0 && (
                        <div className="empty">No records found.</div>
                    )}
                </div>
            </>
        );
    }

    
function ClaimTrace() {
    return (
        <>
            <Header
                title="ClaimTrace Analyzer"
                subtitle="Check marketing claims against approved and currently valid evidence."
            />

            <div className="panel">
                <div className="panelhead">
                    <div>
                        <h2>Submit marketing content</h2>
                        <div className="muted">
                            Paste the copy you want to check before publication.
                        </div>
                    </div>

                    <span className="badge">ClaimTrace 2.0</span>
                </div>

                <div className="field">
                    <label>Marketing content</label>

                    <textarea
                        className="textarea"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="Paste your marketing copy here..."
                    />
                </div>

                <div className="row">
                    <button
                        className="btn"
                        onClick={analyze}
                        disabled={loading}
                    >
                        {loading ? "Analyzing..." : "Analyze content →"}
                    </button>

                    <button
                        className="btn secondary"
                        onClick={() => {
                            setContent(
                                "Our revolutionary product comes with a 5-year warranty and is 100% pollution-free."
                            );
                            setResults(null);
                            setError("");
                            setMessage("");
                        }}
                    >
                        Load demo example
                    </button>

                    <span className="muted">
                        {content.length} characters
                    </span>
                </div>

                <div className="notice">
                    Only approved and currently valid evidence should support
                    verification. Unsupported does not automatically mean false.
                </div>
            </div>

            {results && (
                <div className="panel">
                    <div className="panelhead">
                        <div>
                            <h2>Evidence report</h2>
                            <div className="muted">
                                Analysis completed · {results.total_findings} finding(s)
                            </div>
                        </div>

                        <span className="badge green">Report ready</span>
                    </div>

                    <div className="muted" style={{ marginBottom: 14 }}>
                        Submitted content: “{results.submitted_content}”
                    </div>

                    {results.findings?.map((f, i) => (
                        <div className="finding" key={i}>
                            <div className="findingtop">
                                <strong style={{ fontSize: 13 }}>
                                    {f.claim}
                                </strong>

                                <span className={`badge ${statusColor(f.status)}`}>
                                    {f.status}
                                </span>
                            </div>

                            <div className="muted">{f.reason}</div>

                            {f.approved_fact && (
                                <div style={{ marginTop: 13 }}>
                                    <div className="eyebrow">
                                        APPROVED EVIDENCE
                                    </div>

                                    <div style={{ fontSize: 12, marginTop: 6 }}>
                                        {f.approved_fact}
                                    </div>

                                    <div className="factmeta" style={{ marginTop: 5 }}>
                                        Brand Fact ID: {f.brand_fact_id ?? "Not supplied"}<br />
                                        Source: {f.source || "Not supplied"}<br />
                                        Reference: {f.source_reference || "Not supplied"}<br />
                                        Version: {f.source_version || "Not supplied"}<br />
                                        Effective: {formatDate(f.effective_date)}<br />
                                        Expires: {formatDate(f.expiry_date)}<br />
                                        Evidence status: {f.evidence_status || "Not supplied"}
                                    </div>
                                </div>
                            )}

                            <div style={{ marginTop: 13 }}>
                                <div className="eyebrow">RECOMMENDATION</div>

                                <div style={{ fontSize: 12, marginTop: 6 }}>
                                    {f.recommendation}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="row" style={{ marginTop: 18 }}>
                        <button
                            className="btn"
                            onClick={downloadReport}
                            disabled={loading}
                        >
                            {loading ? "Generating PDF..." : "↓ Download PDF Report"}
                        </button>
                    </div>

                    <div className="notice">
                        This report supports a human decision. Review every finding
                        before publication. ClaimTrace uses evidence and deterministic
                        comparison rules; it is not a complete legal or factual
                        verification system.
                    </div>
                </div>
            )}
        </>
    );
}
   function AuditHistory() {
        const filteredLogs = auditLogs.filter(log =>
            auditFilter === "ALL" || log.action === auditFilter
        );

        return (
            <>
                <Header
                    title="Evidence Audit History"
                    subtitle="Track changes and administrative actions across your brand evidence."
                />

                <div className="panel">
                    <div className="panelhead">
                        <div>
                            <h2>Audit records</h2>
                            <div className="muted">
                                A chronological record of evidence governance activity.
                            </div>
                        </div>

                        <button
                            className="btn secondary small"
                            onClick={loadAuditLogs}
                            disabled={loading}
                        >
                            ↻ Refresh
                        </button>
                    </div>

                    <div className="field">
                        <label>Filter by action</label>

                        <select
                            className="select"
                            value={auditFilter}
                            onChange={e => setAuditFilter(e.target.value)}
                        >
                            <option value="ALL">All actions</option>
                            <option value="CREATED">Created</option>
                            <option value="APPROVED">Approved</option>
                            <option value="METADATA_UPDATED">Metadata Updated</option>
                            <option value="DELETED">Deleted</option>
                            <option value="ANALYSIS_COMPLETED">Analysis Completed</option>
                            <option value="USER_REGISTERED">User Registered</option>
                            <option value="USER_ROLE_UPDATED">User Role Updated</option>
                        </select>
                    </div>

                    <div className="muted">
                        Showing {filteredLogs.length} of {auditLogs.length} audit events.
                    </div>
                </div>

                <div className="panel">
                    {filteredLogs.map(log => (
                        <div className="activity" key={log.id}>
                            <div className="dot" />

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="panelhead">
                                    <h3>{log.record_title}</h3>

                                    <span
                                        className={`badge ${
                                            log.action === "DELETED"
                                                ? "red"
                                                : log.action === "APPROVED"
                                                    ? "green"
                                                    : log.action === "METADATA_UPDATED"
                                                        ? "amber"
                                                        : "gray"
                                        }`}
                                    >
                                        {log.action.replaceAll("_", " ")}
                                    </span>
                                </div>

                                <div className="factmeta">
                                    Audit ID: {log.id}<br />
                                    Brand Fact ID: {log.brand_fact_id ?? "Not available"}<br />
                                    Actor: {log.actor}<br />
                                    Date: {log.created_at
                                        ? new Date(log.created_at).toLocaleString("en-IN")
                                        : "Not available"}
                                </div>

                                {log.details && (
                                    <div className="notice" style={{ marginTop: 10 }}>
                                        <strong>Details</strong>

                                        <div
                                            className="audit-details"
                                            style={{ marginTop: 6 }}
                                        >
                                            {formatAuditDetails(log.details)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {filteredLogs.length === 0 && (
                        <div className="empty">
                            No audit events found for this filter.
                        </div>
                    )}
                </div>
            </>
        );
    }

    function UserManagement() {
        return (
            <>
                <Header
                    title="User Management"
                    subtitle="Manage VERITY workspace accounts and access roles."
                />

                <div className="panel">
                    <div className="panelhead">
                        <div>
                            <h2>Registered users ({users.length})</h2>
                            <div className="muted">
                                Assign Admin, Reviewer or Viewer permissions.
                            </div>
                        </div>

                        <button
                            className="btn secondary small"
                            onClick={loadUsers}
                        >
                            ↻ Refresh
                        </button>
                    </div>

                    <div className="notice">
                        New registrations receive Viewer access by default.
                        Only an Admin can change user roles.
                    </div>

                    <div className="tablewrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map(account => (
                                    <tr key={account.id}>
                                        <td>{account.username}</td>
                                        <td>{account.email}</td>

                                        <td>
                                            <select
                                                className="select"
                                                style={{ minWidth: 115, marginTop: 0 }}
                                                value={account.role}
                                                disabled={
                                                    loading ||
                                                    account.id === user?.id
                                                }
                                                onChange={e =>
                                                    updateRole(
                                                        account.id,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="admin">Admin</option>
                                                <option value="reviewer">Reviewer</option>
                                                <option value="viewer">Viewer</option>
                                            </select>

                                            {account.id === user?.id && (
                                                <div className="muted">
                                                    Current account
                                                </div>
                                            )}
                                        </td>

                                        <td>
                                            <span
                                                className={`badge ${
                                                    account.is_active ? "green" : "red"
                                                }`}
                                            >
                                                {account.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.length === 0 && (
                        <div className="empty">No users found.</div>
                    )}
                </div>
            </>
        );
    }

    if (!token || !user) {
        return (
            <>
                <style>{styles}</style>

                <div className="authpage">
                    <div className="authcard">
                        <div className="authbrand">
                            <div className="logo">V</div>

                            <div>
                                <div className="brandname">VERITY</div>
                                <div className="brandtag">
                                    EVIDENCE-BACKED BRAND GOVERNANCE
                                </div>
                            </div>
                        </div>

                        <div className="eyebrow">SECURE WORKSPACE</div>

                        <h1 style={{ fontSize: 25 }}>
                            {authMode === "login"
                                ? "Welcome back"
                                : "Create an account"}
                        </h1>

                        <p className="muted">
                            {authMode === "login"
                                ? "Sign in to access your brand governance workspace."
                                : "Register for access to the VERITY workspace."}
                        </p>

                        {error && (
                            <div className="notice error">{error}</div>
                        )}

                        {message && (
                            <div className="notice">{message}</div>
                        )}

                        <form onSubmit={submitAuth}>
                            <div className="field">
                                <label>Username</label>

                                <input
                                    className="input"
                                    required
                                    minLength="3"
                                    autoComplete="username"
                                    value={authForm.username}
                                    onChange={e =>
                                        setAuthForm({
                                            ...authForm,
                                            username: e.target.value
                                        })
                                    }
                                    placeholder="Enter username"
                                />
                            </div>

                            {authMode === "register" && (
                                <div className="field">
                                    <label>Email address</label>

                                    <input
                                        className="input"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={authForm.email}
                                        onChange={e =>
                                            setAuthForm({
                                                ...authForm,
                                                email: e.target.value
                                            })
                                        }
                                        placeholder="name@example.com"
                                    />
                                </div>
                            )}

                            <div className="field">
                                <label>Password</label>

                                <input
                                    className="input"
                                    type="password"
                                    required
                                    minLength="8"
                                    autoComplete={
                                        authMode === "login"
                                            ? "current-password"
                                            : "new-password"
                                    }
                                    value={authForm.password}
                                    onChange={e =>
                                        setAuthForm({
                                            ...authForm,
                                            password: e.target.value
                                        })
                                    }
                                    placeholder="Enter password"
                                />
                            </div>

                            <button
                                className="btn"
                                style={{ width: "100%", marginTop: 5 }}
                                disabled={loading}
                            >
                                {loading
                                    ? "Please wait..."
                                    : authMode === "login"
                                        ? "Sign in →"
                                        : "Create account →"}
                            </button>
                        </form>

                        <div
                            className="muted"
                            style={{ textAlign: "center", marginTop: 22 }}
                        >
                            {authMode === "login"
                                ? "Don't have an account? "
                                : "Already registered? "}

                            <button
                                className="authswitch"
                                onClick={() => {
                                    setAuthMode(
                                        authMode === "login"
                                            ? "register"
                                            : "login"
                                    );

                                    setError("");
                                    setMessage("");
                                }}
                            >
                                {authMode === "login" ? "Register" : "Sign in"}
                            </button>
                        </div>

                        <div className="footer">
                            VERITY · Every Message On-Brand. Every Claim Accountable.
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const navItems = [
        ["Dashboard", "▦"],
        ["Brand Memory Vault", "◈"],
        ["ClaimTrace", "⌕"],
        ...(isAdmin
            ? [
                ["Audit History", "◷"],
                ["User Management", "♙"]
            ]
            : [])
    ];

    return (
        <>
            <style>{styles}</style>

            <div className="app">
                <aside className="sidebar">
                    <div className="brand">
                        <div className="logo">V</div>

                        <div>
                            <div className="brandname">VERITY</div>
                            <div className="brandtag">BRAND GOVERNANCE</div>
                        </div>
                    </div>

                    <div className="navlabel">WORKSPACE</div>

                    {navItems.map(([name, icon]) => (
                        <button
                            key={name}
                            className={`nav ${page === name ? "active" : ""}`}
                            onClick={() => {
                                setPage(name);
                                setMessage("");
                                setError("");

                                if (name === "Audit History") {
                                    loadAuditLogs();
                                }

                                if (name === "User Management") {
                                    loadUsers();
                                }
                            }}
                        >
                            <span>{icon}</span>
                            {name}
                        </button>
                    ))}

                    <div className="sidebottom">
                        <strong style={{ color: "#dce7f8" }}>
                            {user.username}
                        </strong>
                        <br />
                        Role: {user.role.toUpperCase()}
                        <br />
                        <br />
                        VERITY · Prototype v3.0
                        <br />
                        Evidence-backed brand governance
                        <br />
                        <br />
                        <span style={{ color: "#4d9fe9" }}>●</span>
                        {" "}Authenticated API workspace
                    </div>
                </aside>

                <main className="main">
                    {message && (
                        <div className="notice">{message}</div>
                    )}

                    {error && (
                        <div className="notice error">{error}</div>
                    )}

                    {page === "Dashboard" && <Dashboard />}
                    {page === "Brand Memory Vault" && <Vault />}
                    {page === "ClaimTrace" && <ClaimTrace />}
                    {page === "Audit History" && isAdmin && <AuditHistory />}
                    {page === "User Management" && isAdmin && <UserManagement />}

                    <div className="footer">
                        VERITY · Every Message On-Brand. Every Claim Accountable.
                    </div>
                </main>
            </div>
        </>
    );
}

export default App;
