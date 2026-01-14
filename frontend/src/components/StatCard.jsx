export default function StatCard({ title, value, icon, color, textColor }) {
  return (
   <div
      className="stat-card"
      style={{
        border: `1px solid ${textColor}`,
        color: textColor,           
        backgroundColor: "transparent", 
      }}
    >
      <div className="stat-icon" style={{ color: textColor }}>
        {icon}
      </div>
      <div className="stat-info">
        <h3 style={{ color: textColor }}>{title}</h3>
        <p style={{ color: textColor }}>{value}</p>
      </div>
    </div>
  );
}
