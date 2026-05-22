import "./Modal.css";

const DocModal = ({ daycare, onClose }) => {
  if (!daycare) return null;

  const filename = `${daycare.name.replace(/\s+/g, "_").toLowerCase()}_license.pdf`;

  const fields = [
    { label: "Daycare",   value: daycare.name },
    { label: "Owner",     value: daycare.owner },
    { label: "City",      value: daycare.city },
    { label: "Submitted", value: daycare.date },
    { label: "Capacity",  value: `${daycare.cap} children` },
    { label: "Status",    value: daycare.status.charAt(0).toUpperCase() + daycare.status.slice(1) },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <span className="modal__title">Document — {daycare.name}</span>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__doc-grid">
          {fields.map((f) => (
            <div key={f.label}>
              <div className="modal__doc-field-label">{f.label}</div>
              <div className="modal__doc-field-value">{f.value}</div>
            </div>
          ))}
        </div>

        <hr className="modal__divider" />

        <div className="modal__doc-preview">
          <div className="modal__doc-icon">📄</div>
          <div className="modal__doc-fname">{filename}</div>
          <div className="modal__doc-fsize">2.4 MB · PDF Document</div>
        </div>

        <div className="modal__foot">
          <button className="btn btn--secondary" onClick={onClose}>Close</button>
          <button className="btn btn--primary">⬇ Download</button>
        </div>
      </div>
    </div>
  );
};

export default DocModal;