import { useState, useRef, useCallback } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import DocModal    from "./Docmodalt";    
// import EditModal   from "./Editmodal";    
import VerifyModal from "./Verifymodal";  
import { DAYCARE_ROWS, THUMB_COLORS } from "./daycareData";
import "./DaycaresPage.css";

/* ── helpers ──────────────────────────────────────────────────────────────── */
const initials = (name) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const StatusBadge = ({ status }) => (
  <span className={`dc-badge dc-badge--${status}`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

/* ── placeholder card ─────────────────────────────────────────────────────── */
const PlaceholderCard = ({ id, icon, title, endpoint }) => (
  <div className="dc-card" id={id}>
    <div className="dc-card__header">
      <div className="dc-card__title">
        {icon}
        {title}
      </div>
    </div>
    <p className="dc-placeholder">
      {title} list will appear here — connect to <code>{endpoint}</code>.
    </p>
  </div>
);

/* ── main component ───────────────────────────────────────────────────────── */
const DaycaresPage = () => {
  const [rows, setRows]               = useState(DAYCARE_ROWS);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter]   = useState("");
  const [activeSection, setActiveSection] = useState("daycares");

  const [docTarget,    setDocTarget]    = useState(null);
//   const [editTarget,   setEditTarget]   = useState(null);
  const [verifyTarget, setVerifyTarget] = useState(null);
  const [verifyAction, setVerifyAction] = useState(null);

  const [toast, setToast] = useState({ show: false, msg: "" });
  const toastTimer = useRef(null);

  /* filtered rows */
  const filtered = rows.filter((d) => {
    const q = search.toLowerCase();
    return (
      (!q || d.name.toLowerCase().includes(q) || d.city.toLowerCase().includes(q) || d.owner.toLowerCase().includes(q)) &&
      (!statusFilter || d.status === statusFilter) &&
      (!cityFilter   || d.city   === cityFilter)
    );
  });

  /* toast helper */
  const showToast = useCallback((msg) => {
    clearTimeout(toastTimer.current);
    setToast({ show: true, msg });
    toastTimer.current = setTimeout(() => setToast({ show: false, msg: "" }), 2800);
  }, []);

  /* nav scroll + highlight */
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

  /* edit save */
//   const handleSave = useCallback((updated) => {
//     setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
//     showToast("Daycare updated ✓");
//   }, [showToast]);

  /* verify confirm */
  const handleVerifyConfirm = useCallback(() => {
    if (!verifyTarget) return;
    const newStatus = verifyAction === "accept" ? "verified" : "rejected";
    setRows((prev) =>
      prev.map((r) => (r.id === verifyTarget.id ? { ...r, status: newStatus } : r))
    );
    showToast(
      verifyAction === "accept"
        ? `${verifyTarget.name} verified ✓`
        : `${verifyTarget.name} rejected`
    );
  }, [verifyTarget, verifyAction, showToast]);

  return (
    <div className="dc-page">
      <Navbar activeSection={activeSection} onNavClick={handleNav} />

      <div className="dc-page__header">
        <div className="dc-page__title">Daycares</div>
        <div className="dc-page__sub">Manage, verify and update registered daycare centers</div>
      </div>

      <div className="dc-layout">
        <Sidebar activeSection={activeSection} onNavClick={handleNav} />

        <div className="dc-content">

          {/* Stats */}
          <div className="dc-stats-row">
            {[
              { label: "Total Daycares", value: rows.length,                         sub: "Registered on platform",  color: "" },
              { label: "Verified",       value: rows.filter(r=>r.status==="verified").length, sub: "Active & approved",       color: "#16a34a", dot: "green" },
              { label: "Pending Review", value: rows.filter(r=>r.status==="pending").length,  sub: "Awaiting verification",   color: "#d97706", dot: "amber" },
              { label: "Rejected",       value: rows.filter(r=>r.status==="rejected").length, sub: "Needs re-submission",     color: "#dc2626", dot: "red" },
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
              <input
                className="dc-search-input"
                placeholder="Search by name, city, owner…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select className="dc-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
            <select className="dc-select" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
              <option value="">All cities</option>
              <option value="Algiers">Algiers</option>
              <option value="Oran">Oran</option>
              <option value="Constantine">Constantine</option>
              <option value="Annaba">Annaba</option>
            </select>
          </div>

          {/* Daycares table card */}
          <div className="dc-card" id="section-daycares">
            <div className="dc-card__header">
              <div className="dc-card__title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
                Daycares
              </div>
              <span className="dc-row-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            <table className="dc-table">
              <colgroup>
                <col style={{ width: "42px" }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "10%" }} />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th></th>
                  <th>Daycare</th>
                  <th>City</th>
                  <th>Owner</th>
                  <th>Capacity</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => {
                  const col = THUMB_COLORS[i % THUMB_COLORS.length];
                  return (
                    <tr key={d.id}>
                      <td>
                        <div className="dc-thumb" style={{ background: col.bg, color: col.tc }}>
                          {initials(d.name)}
                        </div>
                      </td>
                      <td>
                        <div className="dc-name">{d.name}</div>
                        <div className="dc-sub">{d.email}</div>
                      </td>
                      <td>{d.city}</td>
                      <td>{d.owner}</td>
                      <td>{d.cap} kids</td>
                      <td>{d.date}</td>
                      <td><StatusBadge status={d.status} /></td>
                      <td>
                        <div className="dc-actions">
                          <button className="dc-btn dc-btn--doc"  onClick={() => setDocTarget(d)}>📄 Doc</button>
                          {/* <button className="dc-btn dc-btn--edit" onClick={() => setEditTarget(d)}>✏️ Edit</button> */}
                          {d.status === "pending" && (
                            <>
                              <button className="dc-btn dc-btn--accept" onClick={() => { setVerifyTarget(d); setVerifyAction("accept"); }}>Accept</button>
                              <button className="dc-btn dc-btn--reject" onClick={() => { setVerifyTarget(d); setVerifyAction("reject"); }}>Reject</button>
                            </>
                          )}
                          {d.status === "rejected" && (
                            <button className="dc-btn dc-btn--accept" onClick={() => { setVerifyTarget(d); setVerifyAction("accept"); }}>Re-verify</button>
                          )}
                          {d.status === "verified" && (
                            <button className="dc-btn dc-btn--reject" onClick={() => { setVerifyTarget(d); setVerifyAction("reject"); }}>Revoke</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Placeholder cards for other sections */}
          <PlaceholderCard id="section-parents"   title="Parents"  endpoint="GET /parents"   icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>} />
          <PlaceholderCard id="section-requests"  title="Requests" endpoint="GET /requests"  icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>} />
          <PlaceholderCard id="section-reviews"   title="Reviews"  endpoint="DELETE /reviews/:id" icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>} />
          <PlaceholderCard id="section-messages"  title="Messages" endpoint="GET /messages"  icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} />

        </div>
      </div>

      {/* Modals */}
      {docTarget    && <DocModal    daycare={docTarget}    onClose={() => setDocTarget(null)} />}
      {/* {editTarget   && <EditModal   daycare={editTarget}   onClose={() => setEditTarget(null)}   onSave={handleSave} />} */}
      {verifyTarget && <VerifyModal daycare={verifyTarget} action={verifyAction} onClose={() => setVerifyTarget(null)} onConfirm={handleVerifyConfirm} />}

      {/* Toast */}
      <div className={`dc-toast${toast.show ? " dc-toast--show" : ""}`}>{toast.msg}</div>
    </div>
  );
};

export default DaycaresPage;