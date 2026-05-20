import React from "react";

export const StatusBadge = ({ status }) => {
  const map = {
    verified: ["badge-green", "✓ Verified"],
    pending: ["badge-yellow", "⏳ Pending"],
    rejected: ["badge-red", "✕ Rejected"],
    approved: ["badge-green", "✓ Approved"],
    unread: ["badge-blue", "● Unread"],
    read: ["badge-gray", "Read"],
    resolved: ["badge-green", "✓ Resolved"],
  };

  const [cls, label] = map[status] || ["badge-gray", status];

  return <span className={`badge ${cls}`}>{label}</span>;
};

export const ToastContainer = ({ toasts }) => (
  <div className="toast-wrap">
    {toasts.map((t) => (
      <div key={t.id} className={`toast ${t.type}`}>
        {t.icon} {t.msg}
      </div>
    ))}
  </div>
);

export const Modal = ({ title, onClose, footer, children }) => (
  <div
    className="overlay"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className="modal">
      <div className="modal-header">
        <span className="modal-title">{title}</span>

        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="modal-body">{children}</div>

      {footer && <div className="modal-footer">{footer}</div>}
    </div>
  </div>
);

export const DetailRow = ({ label, value }) => (
  <div className="detail-row">
    <span className="detail-label">{label}</span>
    <span className="detail-value">{value}</span>
  </div>
);