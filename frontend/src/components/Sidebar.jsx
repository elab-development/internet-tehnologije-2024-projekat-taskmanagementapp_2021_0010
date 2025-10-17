import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Task Manager</h2>
      <nav>
        <ul>
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">Dashboard</Link>
          </li>
          <li className={location.pathname === '/lists' ? 'active' : ''}>
            <Link to="/lists">Lists</Link>
          </li>
          <li className={location.pathname === '/tasks' ? 'active' : ''}>
            <Link to="/tasks">Tasks</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
