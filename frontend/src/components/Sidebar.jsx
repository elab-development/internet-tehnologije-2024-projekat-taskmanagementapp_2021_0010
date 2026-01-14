import { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";//Uvozi dve ikone iz popularne biblioteke ikona Lucide:
//Menu: Ikona za hamburger meni (prikazuje se kada je bočna traka zatvorena).
//X: Ikona za zatvaranje (prikazuje se kada je bočna traka otvorena).
import { NavLink } from "react-router-dom"; 

export default function Sidebar({ onMyAccountClick }) {
  
  const [open, setOpen] = useState(false);

  return (
    <> 
      <button className="menu-toggle" onClick={() => setOpen(!open)}>
        {open ? <X size={22} color="#ff8fa3" /> : <Menu size={22} color="#ff8fa3" />}
      </button>

      {/* Bočna Traka */}
      <aside className={`sidebar${open ? "open" : ""}`}>
        <h2 className="sidebar-title">Task Manager</h2>
        <nav className="sidebar-links">
          {/* end je neophodan da bi se osiguralo da se ovaj link aktivira samo kada je ruta tačno /, */}
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/lists">Lists</NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
          </nav>

      <div className="sidebar-footer">
       
    <a      href="#" 
            className="sidebar-link-btn" 
            onClick={(e) => {
              e.preventDefault(); // Sprečava osvežavanje stranice
              setOpen(false);     // Zatvori sidebar na mobilnom
              onMyAccountClick(); // Otvori modal iz App.jsx
            }}
          >
            {/* ikonica */}
            <User size={18} /> My Account
          </a>
    <NavLink to="/logout" onClick={() => setOpen(false)}>
      <LogOut size={18} /> Logout
    </NavLink>
  </div>
      </aside>
    </>
  );
}
