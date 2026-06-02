import { useEffect, useState } from "react";
import { fetchDaycareDocument } from "./api";
import "./Modal.css";

// DocModal fetches the proof_document for the given daycare from the backend
// (GET /api/admin/daycares/:id/document) and renders it as a PDF/image viewer.
// If no document exists it shows a friendly empty state.
const DocModal = ({ daycare, onClose }) => {
  const [url, setUrl]         = useState(null);
  const [isPdf, setIsPdf]     = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!daycare) return;
    let objectUrl;
    setLoading(true);
    setError("");

    fetchDaycareDocument(daycare.id)
      .then(({ blobUrl, type }) => {
        objectUrl = blobUrl;
        setUrl(blobUrl);
        setIsPdf(type === "application/pdf");
      })
      .catch((err) => setError(err.message || "Could not load document"))
      .finally(() => setLoading(false));

    // Revoke object URL on unmount to avoid memory leaks
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [daycare]);

  if (!daycare) return null;

  // isPdf is now determined from the actual blob content-type (set in useEffect above)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal modal--doc"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 780, width: "92vw" }}
      >
        <div className="modal__head">
          <span className="modal__title">📄 Document — {daycare.name}</span>
          <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal__doc-body">
          {loading && (
            <div className="modal__doc-placeholder">Loading document…</div>
          )}

          {!loading && error && (
            <div className="modal__doc-placeholder modal__doc-placeholder--error">
              <span style={{ fontSize: "2rem" }}>📭</span>
              <p>{error}</p>
              <p style={{ fontSize: ".78rem", color: "#9ca3af" }}>
                The daycare may not have uploaded a proof document yet.
              </p>
            </div>
          )}

          {!loading && !error && url && (
            isPdf ? (
              <iframe
                src={url}
                title="Proof document"
                style={{ width: "100%", height: "60vh", border: "none", borderRadius: 6 }}
              />
            ) : (
              <img
                src={url}
                alt="Proof document"
                style={{ maxWidth: "100%", borderRadius: 6, display: "block", margin: "0 auto" }}
              />
            )
          )}
        </div>

        {!loading && !error && url && (
          <div className="modal__foot">
            <a
              href={url}
              download={`document-${daycare.id}`}
              className="btn btn--primary"
              style={{ textDecoration: "none" }}
            >
              ⬇ Download
            </a>
            <button className="btn btn--secondary" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocModal;