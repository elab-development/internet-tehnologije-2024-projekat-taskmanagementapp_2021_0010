import { Link, useLocation } from "react-router-dom";
import "../App.css";

//Breadcrumbs ,  automatski generiše navigacionu stazu na osnovu trenutnog URL-a aplikacije
export default function Breadcrumbs() {
  //vraca trenutnu lokaciju tj putanju
  const location = useLocation();
  //Trenutna URL putanja (npr. /tasks/list) se deli na segmente na mestu gde se nalazi kosa crta (/). Rezultat je niz: ["", "tasks", "list"].
                                             //izbacuje prazne stringove
  const paths = location.pathname.split("/").filter(Boolean);

  // Ako je home stranica, ne prikazuj breadcrumbs
  if (paths.length === 0) return null;

  return (
    <nav className="breadcrumbs">
      {/* Prvi link u navigaciji je uvek fiksni link "Home" */}
      <Link to="/" className="breadcrumb-link">Home</Link>
      {paths.map((segment, index) => {
        //route → akumulativni URL do tog segmenta.
        const route = "/" + paths.slice(0, index + 1).join("/");
                                                           //Uzima podstring počevši od indeksa 1 pa sve do kraja.
        const formatted = segment.charAt(0).toUpperCase() + segment.slice(1);
        //renderovanje trenutnog segmenta
        return (
          <span key={index}>
            {" / "}
            {/* Proverava da li je ovo poslednji segm */}
            {index === paths.length - 1 ? (
              //Ako je poslednji: Renderuje se kao običan tekst (span)
              <span className="breadcrumb-current">{formatted}</span>
            ) : (
              //ko nije poslednji: Renderuje se kao klikabilni Link koji vodi na akumulativnu putanju (route
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
