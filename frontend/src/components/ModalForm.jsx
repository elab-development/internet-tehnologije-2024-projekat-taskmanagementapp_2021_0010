import { useState, useEffect } from "react";

export default function ModalForm({ 
  title, 
  fields, 
  initialData = {}, 
  onSubmit, 
  onClose 
}) {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => setFormData(initialData), [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
          {fields.map((f) => (
            <div key={f.name} className="form-group">
              <label>{f.label}</label>
              {f.type === "select" ? (
                <select name={f.name} value={formData[f.name] || ""} onChange={handleChange}>
                  <option value="">-- select --</option>
                  {f.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type}
                  name={f.name}
                  value={formData[f.name] || ""}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                />
              )}
            </div>
          ))}
          <div className="modal-actions">
            <button type="submit" className="pink-btn">Save</button>
            <button type="button" className="pink-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
