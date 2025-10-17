import { useEffect, useState } from 'react';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import { List, CheckCircle, AlertTriangle, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalLists: 0,
    completed: 0,
    emergency: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your overview.</p>
        </div>

        <div className="dashboard-buttons">
          <button className="pink-btn" onClick={() => navigate('/lists')}>
            <List size={16} /> View Lists
          </button>
          <button className="pink-btn" onClick={() => navigate('/tasks')}>
            <ClipboardList size={16} /> View Tasks
          </button>
        </div>
      </div>

      <div className="stats-grid">
       
     <StatCard
  title="Total Tasks"
  value={stats.totalTasks}   
  icon={<ClipboardList size={18} />}
  textColor="#ff8fa3"
/>

<StatCard
  title="Total Lists"
  value={stats.totalLists}   
  icon={<List size={18} />}
  textColor="#ff8fa3"
/>
<StatCard
  title="Completed Tasks"
  value={stats.completed}
  icon={<CheckCircle size={18} />}
  textColor="#ff8fa3"
/>

<StatCard
  title="Emergency Tasks"
  value={stats.emergency}
  icon={<AlertTriangle size={18} />}
  textColor="#ff1744"  
/>

      </div>

      <div className="tasks-section">
  <div className="tasks-section-header">
    <h2>Tasks In Progress</h2>
    <p>Overview of tasks currently being worked on</p>
  </div>

  <div className="tasks-list">
    <div className="task-item">
      <div className="task-title">Izrada frontend forme</div>
      <div className="task-meta">
        <span className="task-priority">Srednji prioritet</span>
        <span className="task-deadline">Rok: 22.10.2025.</span>
      </div>
    </div>

    <div className="task-item">
      <div className="task-title">API povezivanje</div>
      <div className="task-meta">
        <span className="task-priority high">Visok prioritet</span>
        <span className="task-deadline">Rok: 24.10.2025.</span>
      </div>
    </div>
  </div>
</div>
<div className="pagination">
  <button className="page-btn active">1</button>
  <button className="page-btn">2</button>
  <button className="page-btn">3</button>
  <button className="page-btn">→</button>
</div>

    </div>
  );
}
