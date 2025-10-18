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

  const [tasksInProgress, setTasksInProgress] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const navigate = useNavigate();

  const fetchTasks = (page = 1) => {
    api.get(`/tasks-in-progress?page=${page}`)
      .then((res) => {
        setTasksInProgress(res.data.data);
        setCurrentPage(res.data.current_page);
        setLastPage(res.data.last_page);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    api.get('/dashboard-stats')
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));

    fetchTasks(); // ✅ učitaj prvu stranicu
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

      {/* Stat kartice */}
      <div className="stats-grid">
        <StatCard title="Total Tasks" value={stats.totalTasks} icon={<ClipboardList size={18} />} textColor="#ff8fa3" />
        <StatCard title="Total Lists" value={stats.totalLists} icon={<List size={18} />} textColor="#ff8fa3" />
        <StatCard title="Completed Tasks" value={stats.completed} icon={<CheckCircle size={18} />} textColor="#ff8fa3" />
        <StatCard title="Emergency Tasks" value={stats.emergency} icon={<AlertTriangle size={18} />} textColor="#ff1744" />
      </div>

      {/* Sekcija za zadatke u toku */}
      <div className="tasks-section">
        <div className="tasks-section-header">
          <h2>Tasks In Progress</h2>
          <p>Overview of tasks currently being worked on</p>
        </div>

        <div className="tasks-list">
          {tasksInProgress.length === 0 ? (
            <p>No tasks in progress.</p>
          ) : (
            tasksInProgress.map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-title">{task.title}</div>
                <div className="task-meta">
                  <span className={`task-priority ${task.priority === 'hitno' ? 'high' : ''}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                  <span className="task-deadline">Rok: {task.deadline}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ✅ Paginacija */}
        <div className="pagination">
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => fetchTasks(currentPage - 1)}
          >
            ←
          </button>

          {[...Array(lastPage)].map((_, i) => (
            <button
              key={i}
              className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => fetchTasks(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="page-btn"
            disabled={currentPage === lastPage}
            onClick={() => fetchTasks(currentPage + 1)}
          >
            →
          </button>
        </div>
      </div>    </div>
  );
}
