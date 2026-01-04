import { useEffect, useState } from 'react';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import { List, CheckCircle, AlertTriangle, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Chart } from "react-google-charts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalLists: 0,
    completed: 0,
    emergency: 0,
    tasksByStatus: [], // NOVO
    tasksByCategory: [], // NOVO
    tasksByPriority: [], // NOVO
  });
  const [motivation, setMotivation] = useState({ quote: '', author: '' }); // NOVO STANJE
  const [holidaysData, setHolidaysData] = useState(null);
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
      .then((res) => {
      setStats(res.data);
      setMotivation(res.data.motivation); // IZVLAČENJE CITATA
    })
      .catch((err) => console.error(err));

    fetchTasks(); // učitaj prvu stranicu
    api.get('/holidays-tasks')
    .then((res) => setHolidaysData(res.data))
    .catch((err) => console.error(err));
  }, []);

//API vraća podatke kao niz objekata. Za Google Charts potreban je niz nizova (Array of Arrays).
  function formatChartData(data, key, label) {
  if (!data || data.length === 0) return [[label, "Total"], ["No data", 0]];

  return [
    [label, "Total"],
    ...data.map(item => [
      item[key] ?? "Unknown",  // Fallback ako je null
      Number(item.total) || 0
    ])
  ];
}


  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your overview.</p>
          {/* NOVO: Motivacija */}
    {motivation.quote && (
      <blockquote style={{ 
        fontStyle: 'italic', 
        fontSize: '1rem', 
        borderLeft: '4px solid #ff8fa3', 
        paddingLeft: '15px', 
        margin: '15px 0', 
        color: '#ccc' 
      }}>
        "{motivation.quote}" 
        <footer style={{ 
          fontSize: '0.9rem', 
          color: '#999', 
          marginTop: '5px' 
        }}>— {motivation.author}</footer>
      </blockquote>
    )}
    {/* KRAJ NOVE SEKCIJE */}
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

{/* Sekcija za praznike i zadatke s rokom na praznik */}
{holidaysData && (
    <div className="holidays-section">
        <h2>Holidays & Task Deadlines (2026)</h2>
        
        {/* Prikaz zadataka s rokom na praznik */}
        {holidaysData.tasks_due_on_holidays && holidaysData.tasks_due_on_holidays.length > 0 ? (
            <div className="holidays-tasks-list">
                <p style={{ color: '#ff8fa3', fontWeight: 'bold' }}>
                     {holidaysData.tasks_due_on_holidays.length} tasks have deadlines on a holiday!
                </p>
                <ul>
                    {holidaysData.tasks_due_on_holidays.map((task, index) => (
                        <li key={index} className="holiday-task-item">
                            **{task.title}** (Deadline: {task.deadline}) - Priority: {task.priority.toUpperCase()}
                        </li>
                    ))}
                </ul>
            </div>
        ) : (
            <p style={{ color: '#ccc' }}>
                 Good news! No tasks are currently due on a public holiday in 2026.
            </p>
        )}

        {/* Dugme za prikaz svih praznika */}
        <details style={{ marginTop: '15px' }}>
            <summary style={{ color: '#ffb3d9', cursor: 'pointer' }}>
                View Full List of 2025 Holidays ({holidaysData.holidays.length})
            </summary>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px' }}>
                {holidaysData.holidays.map((holiday, index) => (
                    <li key={index} style={{ color: '#999' }}>
                        **{holiday.name}** on {holiday.date}
                    </li>
                ))}
            </ul>
        </details>
    </div>
)}
{/* KRAJ Sekcije za praznike */}

      {/* CHARTOVI */}
<div className="charts-section">

  {/* Tasks by Status - PieChart */}
  <div className="chart-box">
    <h3>Tasks by Status</h3>
    <Chart
      chartType="PieChart"
      data={formatChartData(stats.tasksByStatus, "status", "Status")}
      width={"100%"}
      height={"100%"}
      options={{
        pieHole: 0.4,
        backgroundColor: "transparent",
        legendTextStyle: { color: "#fff" },
        titleTextStyle: { color: "#fff" },
        colors: ['#ff8fa3', '#ffb3d9', '#ff4da6'],
      }}
    />
  </div>

  {/* Tasks by Priority - ColumnChart */}
  <div className="chart-box">
    <h3>Tasks by Priority</h3>
    <Chart
      chartType="ColumnChart"
      data={formatChartData(stats.tasksByPriority, "priority", "Priority")}
      width={"100%"}
      height={"100%"}
      options={{
        backgroundColor: "transparent",
        legendTextStyle: { color: "#fff" },
        titleTextStyle: { color: "#fff" },
        hAxis: { textStyle: { color: "#ff8fa3" } },
        vAxis: { textStyle: { color: "#ff8fa3" } },
        colors: ['#ff8fa3', '#ffb3d9', '#ff4da6'],
      }}
    />
  </div>
{/* Tasks by Category - PieChart */}
 <div className="chart-box">
    <h3>Tasks by Category</h3>
    <Chart
      chartType="PieChart"
      data={formatChartData(stats.tasksByCategory, "category", "Category")}
      width={"100%"}
      height={"100%"}
      options={{
        pieHole: 0,
        backgroundColor: "transparent",
        legendTextStyle: { color: "#fff" },
        titleTextStyle: { color: "#fff" },
        colors: ['#ff8fa3', '#ffb3d9', '#ff4da6'],
      }}
    />
  </div>


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
                  <span className="task-deadline">Deadline: {task.deadline}</span>
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
