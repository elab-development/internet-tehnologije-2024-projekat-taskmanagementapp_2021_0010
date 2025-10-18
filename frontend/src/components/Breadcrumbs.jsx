import { Link, useLocation } from "react-router-dom";
import "../App.css";

export default function Breadcrumbs() {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);

  // Ako je home stranica, ne prikazuj breadcrumbs
  if (paths.length === 0) return null;

  return (
    <nav className="breadcrumbs">
      <Link to="/" className="breadcrumb-link">Home</Link>
      {paths.map((segment, index) => {
        const route = "/" + paths.slice(0, index + 1).join("/");
        const formatted = segment.charAt(0).toUpperCase() + segment.slice(1);
        return (
          <span key={index}>
            {" / "}
            {index === paths.length - 1 ? (
              <span className="breadcrumb-current">{formatted}</span>
            ) : (
              <Link to={route} className="breadcrumb-link">
                {formatted}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
