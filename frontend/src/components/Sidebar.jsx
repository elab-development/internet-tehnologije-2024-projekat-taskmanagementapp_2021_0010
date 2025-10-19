import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="menu-toggle" onClick={() => setOpen(!open)}>
        {open ? <X size={22} color="#ff8fa3" /> : <Menu size={22} color="#ff8fa3" />}
      </button>

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <h2 className="sidebar-title">Task Manager</h2>
        <nav className="sidebar-links">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/lists">Lists</NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
          <NavLink to="/logout">Logout</NavLink>

        </nav>
      </aside>
    </>
  );
}
