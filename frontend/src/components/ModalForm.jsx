import { useState, useEffect } from "react";

export default function ModalForm({
  title,
  //Definicija svih polja forme (tip, ime, labela, opcije...).
  fields,
  //Početni podaci za popunjavanje forme. Koristi se za operaciju "Edit"
  initialData = {},
  onSubmit,
  onClose,
}) {
  const [formData, setFormData] = useState(initialData);

  // Ova kuka omogućava komponenti da se transformiše iz "Create" u "Edit" mod kada se promene initialData.
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  //Kada se bilo koje polje (input ili select) promeni, ova funkcija uzima name i value tog polja i ažurira samo to jedno polje unutar formData objekta (...formData, [name]: value).
  const handleChange = (e) => {
    const { name, value } = e.target;
    //ove ... su spread operator koji proširuje objekat i stvara kopiju postojećeg formData objekta.
    //i onda se menja samo prosledjeno polje tj overwrituje
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
                <select
                  name={f.name}
                  //Prioritet Vrednosti (?? Operatori) 
                  //pokušava da koristi formData (trenutno stanje). Ako nije definisano, pada na initialValue definisan u fields nizu. Ako ni to ne postoji, koristi prazan string.
                  value={ formData[f.name] ?? f.initialValue ?? ""}
                  onChange={handleChange}
                >
                  {/* Uvek se renderuje prva, prazna opcija. */}
                <option value="">-- chose --</option>
                  {f.options.map((opt, index) => {
                    if (typeof opt === "object" && opt !== null) {
                      return (
                        <option key={opt.value || index} value={opt.value}>
                          {opt.label}
                        </option>
                      );
                    }
                    //Taj return u map() je moment kada za svaki element iz niza pravimo JSX <option> i ubacujemo ga u <select> listu.
                    return (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    );
                  })}
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
            <button type="submit" className="pink-btn">
              Save
            </button>
            <button type="button" className="pink-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
