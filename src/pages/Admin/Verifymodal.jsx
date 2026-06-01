import "./Modal.css";

const VerifyModal = ({ daycare, action, onClose, onConfirm }) => {
  if (!daycare || !action) return null;

  const isAccept = action === "accept";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--sm" onClick={(e) => e.stopPropagation()}>
        <div className={`modal__verify-icon ${isAccept ? "modal__verify-icon--green" : "modal__verify-icon--red"}`}>
          {isAccept ? "✅" : "🚫"}
        </div>
        <div className="modal__verify-head">
          {isAccept ? `Accept "${daycare.name}"?` : `Reject "${daycare.name}"?`}
        </div>
        <div className="modal__verify-sub">
          {isAccept
            ? "This daycare will be marked as verified and visible to parents on the platform."
            : "This daycare will be rejected. They will be notified to resubmit their documents."}
        </div>
        <div className="modal__verify-btns">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button
            className={`btn ${isAccept ? "btn--primary" : "btn--danger"}`}
            onClick={() => { onConfirm(); onClose(); }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyModal;