import { useState, useEffect } from "react";
import "./Modal.css";

const EditModal = ({ daycare, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "", owner: "", city: "", phone: "", cap: "", email: "", address: "",
  });

  useEffect(() => {
    if (daycare) {
      setForm({
        name:    daycare.name,
        owner:   daycare.owner,
        city:    daycare.city,
        phone:   daycare.phone,
        cap:     daycare.cap,
        email:   daycare.email,
        address: daycare.address,
      });
    }
  }, [daycare]);

  if (!daycare) return null;

  const handle = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = () => {
    onSave({ ...daycare, ...form, cap: parseInt(form.cap) || daycare.cap });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <span className="modal__title">Update — {daycare.name}</span>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__input-row">
          <div>
            <label className="modal__label">Daycare Name</label>
            <input className="modal__input" value={form.name} onChange={handle("name")} />
          </div>
          <div>
            <label className="modal__label">Owner / Manager</label>
            <input className="modal__input" value={form.owner} onChange={handle("owner")} />
          </div>
        </div>

        <div className="modal__input-row">
          <div>
            <label className="modal__label">City</label>
            <input className="modal__input" value={form.city} onChange={handle("city")} />
          </div>
          <div>
            <label className="modal__label">Phone</label>
            <input className="modal__input" value={form.phone} onChange={handle("phone")} />
          </div>
        </div>

        <div className="modal__input-row">
          <div>
            <label className="modal__label">Capacity</label>
            <input className="modal__input" type="number" value={form.cap} onChange={handle("cap")} />
          </div>
          <div>
            <label className="modal__label">Email</label>
            <input className="modal__input" value={form.email} onChange={handle("email")} />
          </div>
        </div>

        <label className="modal__label">Address</label>
        <input className="modal__input modal__input--full" value={form.address} onChange={handle("address")} />

        <div className="modal__foot">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;