import { useState, useRef, useCallback, useEffect } from "react";
import Navbar      from "./Navbar";
import Sidebar     from "./Sidebar";
import DocModal    from "./Docmodalt";
import VerifyModal from "./Verifymodal";
import { THUMB_COLORS } from "./daycareData";
import { apiFetch, apiPut } from "./api";
import "./DaycaresPage.css";

const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const StatusBadge = ({ status }) => (
  <span className={`dc-badge dc-badge--${status}`}>
    {status ? status.charAt(0).toUpperCase() + status.slice(1) : "—"}
  </span>
);

const Spinner = () => (
  <div style={{ padding: "2rem", textAlign: "center", color: "#9ca3af" }}>Loading…</div>
);

const ErrorMsg = ({ msg }) => (
  <div style={{ padding: "1rem", color: "#dc2626", fontSize: ".85rem" }}>⚠ {msg}</div>
);

const DaycaresPage = () => {
  const [rows,         setRows]         = useState([]);
  const [dcLoading,    setDcLoading]    = useState(true);
  const [dcError,      setDcError]      = useState("");
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter,   setCityFilter]   = useState("");

  const [parents,    setParents]    = useState([]);
  const [parLoading, setParLoading] = useState(true);
  const [parError,   setParError]   = useState("");

  const [requests,   setRequests]   = useState([]);
  const [reqLoading, setReqLoading] = useState(true);
  const [reqError,   setReqError]   = useState("");

  const [messages,   setMessages]   = useState([]);
  const [msgLoading, setMsgLoading] = useState(true);
  const [msgError,   setMsgError]   = useState("");

  const [activeSection, setActiveSection] = useState("daycares");
  const [docTarget,     setDocTarget]     = useState(null);
  const [verifyTarget,  setVerifyTarget]  = useState(null);
  const [verifyAction,  setVerifyAction]  = useState(null);
  const [toast,         setToast]         = useState({ show: false, msg: "" });
  const toastTimer = useRef(null);

  useEffect(() => {
    apiFetch("/daycares")
      .then((data) => setRows(data))
      .catch((e)  => setDcError(e.message))
      .finally(()  => setDcLoading(false));

    apiFetch("/parents")
      .then((data) => setParents(data))
      .catch((e)  => setParError(e.message))
      .finally(()  => setParLoading(false));

    apiFetch("/requests")
      .then((data) => setRequests(data))
      .catch((e)  => setReqError(e.message))
      .finally(()  => setReqLoading(false));

    apiFetch("/messages")
      .then((data) => setMessages(data))
      .catch((e)  => setMsgError(e.message))
      .finally(()  => setMsgLoading(false));
  }, []);

  /* ── derived status: backend uses is_verified=email verified, is_active=admin approved ── */
  const dcStatus = (d) => {
    if (d.is_active === 1)                          return "verified";  // admin approved
    if (d.is_verified === 1 && d.is_active === 0)  return "rejected";  // email verified but admin rejected
    return "pending";                                                    // email verified, awaiting admin
  };

  const filtered = rows.filter((d) => {
    const q    = search.toLowerCase();
    const addr = (d.address || "").toLowerCase();
    const st   = dcStatus(d);
    return (
      (!q || d.name?.toLowerCase().includes(q) || addr.includes(q) || d.email?.toLowerCase().includes(q)) &&
      (!statusFilter || st === statusFilter) &&
      (!cityFilter || addr.includes(cityFilter.toLowerCase()))
    );
  });

  const showToast = useCallback((msg) => {
    clearTimeout(toastTimer.current);
    setToast({ show: true, msg });
    toastTimer.current = setTimeout(() => setToast({ show: false, msg: "" }), 2800);
  }, []);

  const handleNav = useCallback((key) => {
    setActiveSection(key);
    const el = document.getElementById(`section-${key}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.classList.remove("dc-card--highlight");
    void el.offsetWidth;
    el.classList.add("dc-card--highlight");
    setTimeout(() => el.classList.remove("dc-card--highlight"), 1300);
  }, []);

  /* ── verify: backend expects is_active (not is_verified) ── */
  const handleVerifyConfirm = useCallback(async () => {
    if (!verifyTarget) return;
    const isAccept = verifyAction === "accept";
    try {
      await apiPut(`/daycares/${verifyTarget.id}/verify`, {
        is_active: isAccept,
        rejection_reason: isAccept ? null : "Rejected by admin",
      });
      setRows((prev) =>
        prev.map((r) =>
          r.id === verifyTarget.id
            ? { ...r, is_active: isAccept ? 1 : 0 }
            : r
        )
      );
      showToast(isAccept ? `${verifyTarget.name} approved ✓` : `${verifyTarget.name} rejected`);
    } catch (e) {
      showToast("Error: " + e.message);
    }
  }, [verifyTarget, verifyAction, showToast]);

  const handleDeleteParent = useCallback(async (parent) => {
    if (!window.confirm(`Delete parent ${parent.first_name} ${parent.last_name}?`)) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/admin/parents/${parent.id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "true" } }
      );
      if (!res.ok) throw new Error("Delete failed");
      setParents((prev) => prev.filter((p) => p.id !== parent.id));
      showToast("Parent deleted ✓");
    } catch (e) {
      showToast("Error: " + e.message);
    }
  }, [showToast]);

  const handleRequestUpdate = useCallback(async (req, status) => {
    try {
      await apiPut(`/requests/${req.id}`, { status });
      setRequests((prev) => prev.map((r) => (r.id === req.id ? { ...r, status } : r)));
      showToast(`Request ${status} ✓`);
    } catch (e) {
      showToast("Error: " + e.message);
    }
  }, [showToast]);

  const handleMessageUpdate = useCallback(async (msg, status) => {
    try {
      await apiPut(`/messages/${msg.id}`, { status });
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, status } : m)));
      showToast(`Message marked as ${status} ✓`);
    } catch (e) {
      showToast("Error: " + e.message);
    }
  }, [showToast]);

  return (
    <div className="dc-page">
      <Navbar activeSection={activeSection} onNavClick={handleNav} />

      <div className="dc-page__header">
        <div className="dc-page__title">Admin Dashboard</div>
        <div className="dc-page__sub">Manage daycares, parents, requests and messages</div>
      </div>

      <div className="dc-layout">
        <Sidebar activeSection={activeSection} onNavClick={handleNav} />

        <div className="dc-content">

          {/* Stats */}
          <div className="dc-stats-row">
            {[
              { label: "Total Daycares", value: rows.length,                                                           sub: "Registered",            color: "" },
              { label: "Approved",       value: rows.filter(r => r.is_active === 1).length,                           sub: "Active & approved",     color: "#16a34a", dot: "green" },
              { label: "Pending",        value: rows.filter(r => r.is_verified === 1 && r.is_active === 0).length,    sub: "Awaiting approval",     color: "#d97706", dot: "amber" },
              { label: "Parents",        value: parents.length,                                                        sub: "Registered parents",    color: "#2563eb" },
            ].map((s) => (
              <div className="dc-stat-card" key={s.label}>
                <div className="dc-stat-card__label">{s.label}</div>
                <div className="dc-stat-card__value" style={s.color ? { color: s.color } : {}}>{s.value}</div>
                <div className="dc-stat-card__sub">
                  {s.dot && <span className={`dc-dot dc-dot--${s.dot}`} />}
                  {s.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="dc-filters">
            <div className="dc-search-box">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input className="dc-search-input" placeholder="Search by name, email, address…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="dc-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="verified">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select className="dc-select" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
              <option value="">All cities</option>
              <option value="algiers">Algiers</option>
              <option value="oran">Oran</option>
              <option value="constantine">Constantine</option>
              <option value="annaba">Annaba</option>
            </select>
          </div>

          {/* DAYCARES */}
          <div className="dc-card" id="section-daycares">
            <div className="dc-card__header">
              <div className="dc-card__title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                Daycares
              </div>
              <span className="dc-row-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            </div>
            {dcLoading && <Spinner />}
            {dcError   && <ErrorMsg msg={dcError} />}
            {!dcLoading && !dcError && (
              <table className="dc-table">
                <colgroup>
                  <col style={{ width: "42px" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                  <col />
                </colgroup>
                <thead>
                  <tr><th></th><th>Daycare</th><th>Address</th><th>Capacity</th><th>Price</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map((d, i) => {
                    const col    = THUMB_COLORS[i % THUMB_COLORS.length];
                    const status = dcStatus(d);
                    return (
                      <tr key={d.id}>
                        <td><div className="dc-thumb" style={{ background: col.bg, color: col.tc }}>{initials(d.name)}</div></td>
                        <td><div className="dc-name">{d.name}</div><div className="dc-sub">{d.email}</div></td>
                        <td style={{ fontSize: ".78rem", color: "#6b7280" }}>{d.address}</td>
                        <td>{d.capacity} kids</td>
                        <td>{d.price ? `${d.price} DA` : "—"}</td>
                        <td><StatusBadge status={status} /></td>
                        <td>
                          <div className="dc-actions">
                            <button className="dc-btn dc-btn--doc" onClick={() => setDocTarget(d)}>📄 Doc</button>
                            {status === "pending" && (
                              <>
                                <button className="dc-btn dc-btn--accept" onClick={() => { setVerifyTarget(d); setVerifyAction("accept"); }}>Accept</button>
                                <button className="dc-btn dc-btn--reject" onClick={() => { setVerifyTarget(d); setVerifyAction("reject"); }}>Reject</button>
                              </>
                            )}
                            {status === "verified" && (
                              <button className="dc-btn dc-btn--reject" onClick={() => { setVerifyTarget(d); setVerifyAction("reject"); }}>Revoke</button>
                            )}
                            {status === "rejected" && (
                              <button className="dc-btn dc-btn--accept" onClick={() => { setVerifyTarget(d); setVerifyAction("accept"); }}>Re-verify</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan="7" style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>No daycares found</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* PARENTS */}
          <div className="dc-card" id="section-parents">
            <div className="dc-card__header">
              <div className="dc-card__title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                Parents
              </div>
              <span className="dc-row-count">{parents.length} total</span>
            </div>
            {parLoading && <Spinner />}
            {parError   && <ErrorMsg msg={parError} />}
            {!parLoading && !parError && (
              <table className="dc-table">
                <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Verified</th><th>Actions</th></tr></thead>
                <tbody>
                  {parents.map((p) => (
                    <tr key={p.id}>
                      <td><div className="dc-name">{p.first_name} {p.last_name}</div></td>
                      <td><div className="dc-sub">{p.email}</div></td>
                      <td>{p.phone}</td>
                      <td><span className={`dc-badge dc-badge--${p.is_verified ? "verified" : "pending"}`}>{p.is_verified ? "Yes" : "No"}</span></td>
                      <td><button className="dc-btn dc-btn--reject" onClick={() => handleDeleteParent(p)}>🗑 Delete</button></td>
                    </tr>
                  ))}
                  {parents.length === 0 && <tr><td colSpan="5" style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>No parents found</td></tr>}
                </tbody>
              </table>
            )}
          </div>

          {/* REQUESTS */}
          <div className="dc-card" id="section-requests">
            <div className="dc-card__header">
              <div className="dc-card__title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                Requests
              </div>
              <span className="dc-row-count">{requests.length} total</span>
            </div>
            {reqLoading && <Spinner />}
            {reqError   && <ErrorMsg msg={reqError} />}
            {!reqLoading && !reqError && (
              <table className="dc-table">
                <thead><tr><th>Child</th><th>Parent</th><th>Daycare</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r.id}>
                      <td><div className="dc-name">{r.child_name}</div><div className="dc-sub">Age {r.child_age}</div></td>
                      <td>{r.first_name} {r.last_name}</td>
                      <td>{r.daycare_name}</td>
                      <td style={{ fontSize: ".78rem", color: "#6b7280" }}>{new Date(r.request_date).toLocaleDateString()}</td>
                      <td><StatusBadge status={r.status} /></td>
                      <td>
                        <div className="dc-actions">
                          {r.status !== "approved" && <button className="dc-btn dc-btn--accept" onClick={() => handleRequestUpdate(r, "approved")}>Approve</button>}
                          {r.status !== "rejected" && <button className="dc-btn dc-btn--reject" onClick={() => handleRequestUpdate(r, "rejected")}>Reject</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && <tr><td colSpan="6" style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>No requests found</td></tr>}
                </tbody>
              </table>
            )}
          </div>

          {/* REVIEWS */}
          <div className="dc-card" id="section-reviews">
            <div className="dc-card__header">
              <div className="dc-card__title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Reviews
              </div>
            </div>
            <p style={{ padding: "1.5rem", color: "#9ca3af", fontSize: ".85rem" }}>
              Reviews are deleted on demand via <code>DELETE /admin/reviews/:id</code>.
            </p>
          </div>

          {/* MESSAGES */}
          <div className="dc-card" id="section-messages">
            <div className="dc-card__header">
              <div className="dc-card__title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Messages
              </div>
              <span className="dc-row-count">{messages.length} total</span>
            </div>
            {msgLoading && <Spinner />}
            {msgError   && <ErrorMsg msg={msgError} />}
            {!msgLoading && !msgError && (
              <table className="dc-table">
                <thead><tr><th>From</th><th>Subject</th><th>Message</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {messages.map((m) => (
                    <tr key={m.id}>
                      <td><div className="dc-name">{m.first_name} {m.last_name}</div><div className="dc-sub">{m.email}</div></td>
                      <td><div className="dc-name">{m.subject}</div></td>
                      <td style={{ fontSize: ".78rem", color: "#6b7280", maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.message}</td>
                      <td style={{ fontSize: ".78rem", color: "#6b7280" }}>{new Date(m.create_at).toLocaleDateString()}</td>
                      <td><StatusBadge status={m.status} /></td>
                      <td>
                        <div className="dc-actions">
                          {m.status === "unread" && <button className="dc-btn dc-btn--doc" onClick={() => handleMessageUpdate(m, "read")}>Mark Read</button>}
                          {m.status !== "resolved" && <button className="dc-btn dc-btn--accept" onClick={() => handleMessageUpdate(m, "resolved")}>Resolve</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {messages.length === 0 && <tr><td colSpan="6" style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>No messages found</td></tr>}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>

      {docTarget    && <DocModal    daycare={docTarget}    onClose={() => setDocTarget(null)} />}
      {verifyTarget && <VerifyModal daycare={verifyTarget} action={verifyAction} onClose={() => setVerifyTarget(null)} onConfirm={handleVerifyConfirm} />}

      <div className={`dc-toast${toast.show ? " dc-toast--show" : ""}`}>{toast.msg}</div>
    </div>
  );
};

export default DaycaresPage;