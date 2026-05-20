import { useState } from "react";
import { fmtDate, avatarColor, initials } from "./sharedData";

import {
  StatusBadge,
  Modal,
  DetailRow,
} from "./sharedComponents";
import "./Daycarepages.css";

/* ─── PAGE 1: DAYCARES + PARENTS ─────────────────────────────────────────── */
 export default function DaycaresPage({
  data = { daycares: [], parents: [] },
  setData = () => {},
  toast = () => {}
}){
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modal, setModal]   = useState(null); // { type: 'verify'|'detail'|'deleteParent', item }
  const [tab, setTab]       = useState("daycares");
const mockData = {
  daycares: [
    {
      id: 1,
      name: "Little Stars",
      owner: "Sarah Ahmed",
      city: "Oran",
      capacity: 45,
      status: "pending",
      created_at: new Date(),
      email: "little@stars.com",
      phone: "0555555555",
    },
  ],
  parents: [
    {
      id: 1,
      first_name: "Ali",
      last_name: "Ben",
      email: "ali@example.com",
      phone: "0666666666",
      city: "Oran",
      children_count: 2,
      created_at: new Date(),
    },
  ],
};
  const daycares = (data?.daycares || mockData.daycares).filter (d =>
    (filter === "all" || d.status === filter) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) ||
     d.city.toLowerCase().includes(search.toLowerCase()))
  );

  const parents = (data?.parents || mockData.parents).filter(p =>
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const verify = (id, action) => {
    setData(prev => ({
      ...prev,
      daycares: prev.daycares.map(d =>
        d.id === id ? { ...d, status: action === "accept" ? "verified" : "rejected" } : d
      ),
    }));
    toast(
      action === "accept" ? "Daycare verified ✓" : "Daycare rejected",
      action === "accept" ? "success" : "danger"
    );
    setModal(null);
  };

  const deleteParent = (id) => {
    setData(prev => ({ ...prev, parents: prev.parents.filter(p => p.id !== id) }));
    toast("Parent account deleted", "danger");
    setModal(null);
  };

  const pending  = data.daycares.filter(d => d.status === "pending").length;
  const verified = data.daycares.filter(d => d.status === "verified").length;

  return (
    <div className="page daycares-page">
      <div className="page-header">
        <div className="page-title">Users &amp; Daycares</div>
        <div className="page-sub">Manage daycares and parent accounts on Hadanti</div>
      </div>

      {/* ── Stats ── */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total Daycares</div>
          <div className="stat-value">{data.daycares.length}</div>
          <div className="stat-sub"><span className="stat-dot" style={{background:"var(--accent)"}}></span>All registered</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Approval</div>
          <div className="stat-value" style={{color:"var(--warn)"}}>{pending}</div>
          <div className="stat-sub"><span className="stat-dot" style={{background:"var(--warn)"}}></span>Awaiting review</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Verified</div>
          <div className="stat-value" style={{color:"var(--success)"}}>{verified}</div>
          <div className="stat-sub"><span className="stat-dot" style={{background:"var(--success)"}}></span>Active on platform</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Parents</div>
          <div className="stat-value">{data.parents.length}</div>
          <div className="stat-sub"><span className="stat-dot" style={{background:"#818cf8"}}></span>Registered families</div>
        </div>
      </div>

      {/* ── Toolbar: Tabs + Search ── */}
      <div className="daycares-toolbar">
        <div className="tabs">
          <button className={`tab ${tab === "daycares" ? "active" : ""}`} onClick={() => setTab("daycares")}>🏫 Daycares</button>
          <button className={`tab ${tab === "parents"  ? "active" : ""}`} onClick={() => setTab("parents")}>👨‍👩‍👧 Parents</button>
        </div>
        <input
          className="daycares-search"
          placeholder={`Search ${tab}…`}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Daycares Tab ── */}
      {tab === "daycares" && (
        <>
          <div className="filter-bar" style={{marginBottom:16}}>
            {["all", "pending", "verified", "rejected"].map(f => (
              <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}{f === "pending" && pending > 0 ? ` (${pending})` : ""}
              </button>
            ))}
          </div>

          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Daycare</th><th>Owner</th><th>City</th><th>Capacity</th>
                    <th>Status</th><th>Registered</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {daycares.length === 0 ? (
                    <tr><td colSpan={7}>
                      <div className="empty-state"><div className="empty-icon">🏫</div><div className="empty-text">No daycares found</div></div>
                    </td></tr>
                  ) : daycares.map(d => (
                    <tr key={d.id} className={d.status === "pending" ? "row-pending" : ""}>
                      <td>
                        <div className="person-cell">
                          <div className={`avatar ${avatarColor(d.name)}`}>{initials(d.name)}</div>
                          <div>
                            <div className="person-name">{d.name}</div>
                            <div className="person-email">{d.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{d.owner}</td>
                      <td className="td-muted">{d.city}</td>
                      <td><span className="capacity-pill">👶 {d.capacity}</span></td>
                      <td><StatusBadge status={d.status}/></td>
                      <td className="td-muted">{fmtDate(d.created_at)}</td>
                      <td>
                        <div className="action-group">
                          <button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "detail", item: d })}>View</button>
                          {d.status === "pending" && (
                            <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: "verify", item: d })}>Review</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Parents Tab ── */}
      {tab === "parents" && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Parent</th><th>Phone</th><th>City</th><th>Children</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {parents.length === 0 ? (
                  <tr><td colSpan={6}>
                    <div className="empty-state"><div className="empty-icon">👨‍👩‍👧</div><div className="empty-text">No parents found</div></div>
                  </td></tr>
                ) : parents.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="person-cell">
                        <div className={`avatar ${avatarColor(p.first_name)}`}>{initials(`${p.first_name} ${p.last_name}`)}</div>
                        <div>
                          <div className="person-name">{p.first_name} {p.last_name}</div>
                          <div className="person-email">{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="td-muted">{p.phone}</td>
                    <td className="td-muted">{p.city}</td>
                    <td className="td-muted">{p.children_count}</td>
                    <td className="td-muted">{fmtDate(p.created_at)}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => setModal({ type: "deleteParent", item: p })}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {modal?.type === "detail" && (
        <Modal title="Daycare Details" onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Close</button>
              {modal.item.status === "pending" && (
                <button className="btn btn-primary" onClick={() => setModal({ type: "verify", item: modal.item })}>Review</button>
              )}
            </>
          }>
          <DetailRow label="Name"       value={modal.item.name}/>
          <DetailRow label="Owner"      value={modal.item.owner}/>
          <DetailRow label="Email"      value={modal.item.email}/>
          <DetailRow label="Phone"      value={modal.item.phone}/>
          <DetailRow label="City"       value={modal.item.city}/>
          <DetailRow label="Capacity"   value={`${modal.item.capacity} children`}/>
          <DetailRow label="Status"     value={<StatusBadge status={modal.item.status}/>}/>
          <DetailRow label="Registered" value={fmtDate(modal.item.created_at)}/>
        </Modal>
      )}

      {modal?.type === "verify" && (
        <Modal title="Review Daycare" onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-ghost"   onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-danger"  onClick={() => verify(modal.item.id, "reject")}>✕ Reject</button>
              <button className="btn btn-success" onClick={() => verify(modal.item.id, "accept")}>✓ Verify</button>
            </>
          }>
          <p style={{fontSize:14, color:"var(--muted)", marginBottom:20, lineHeight:1.7}}>
            Review <strong style={{color:"var(--text)"}}>{modal.item.name}</strong> by{" "}
            <strong style={{color:"var(--text)"}}>{modal.item.owner}</strong> and decide whether
            to verify or reject this daycare's registration.
          </p>
          <DetailRow label="City"     value={modal.item.city}/>
          <DetailRow label="Capacity" value={`${modal.item.capacity} children`}/>
          <DetailRow label="Email"    value={modal.item.email}/>
          <div className="verify-warning">⚠️ Once verified, this daycare will appear in search results for parents.</div>
        </Modal>
      )}

      {modal?.type === "deleteParent" && (
        <Modal title="Delete Parent Account" onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-ghost"  onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => deleteParent(modal.item.id)}>Delete Account</button>
            </>
          }>
          <p className="delete-note" style={{fontSize:14, color:"var(--muted)", lineHeight:1.7}}>
            Are you sure you want to permanently delete the account of{" "}
            <strong style={{color:"var(--text)"}}>{modal.item.first_name} {modal.item.last_name}</strong>{" "}
            ({modal.item.email})?<br/><br/>
            This action <strong className="danger-word">cannot be undone</strong>.
          </p>
        </Modal>
      )}
    </div>
  );
}