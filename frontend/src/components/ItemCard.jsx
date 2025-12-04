export default function ItemCard({ title, subtitle, description, onEdit, onDelete, onClick }) {
  return (
    <div className="item-card" onClick={onClick}>
      <div className="item-header">
        <h3>{title}</h3>
        {/* uslovno renderovanje */}
        {subtitle && <span className="item-subtitle">{subtitle}</span>}
      </div>
      {description && <p className="item-description">{description}</p>}
      <div className="item-actions">
        {/* e.stopPropagation() sprečava da taj klik dođe do roditeljskog div.item-card elementa, čime se obezbeđuje da se samo željena akcija (npr. brisanje) izvrši, */}
        {onEdit && <button className="pink-btn" onClick={(e) => { e.stopPropagation(); onEdit(); }}>Edit</button>}
        {onDelete && <button className="pink-btn" onClick={(e) => { e.stopPropagation(); onDelete(); }}>Delete</button>}
      </div>
    </div>
  );
}