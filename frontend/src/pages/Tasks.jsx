import { useEffect, useState } from "react";
import api from "../api/axios";
import { Filter } from "lucide-react";
import "../App.css";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("svi");
  const [priority, setPriority] = useState("svi");
 

const fetchTasks = async () => {
  try {
    const res = await api.get("/tasks");
    let data = res.data.data || res.data || [];

    if (!Array.isArray(data)) data = [data];

    // Filtriranje na frontu
    let filtered = data;

    if (status !== "svi") {
      filtered = filtered.filter(
        (task) => task.status && task.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (priority !== "svi") {
      filtered = filtered.filter(
        (task) =>
          task.priority && task.priority.toLowerCase() === priority.toLowerCase()
      );
    }

    setTasks(filtered);
  } catch (err) {
    console.error("❌ Greška pri učitavanju zadataka:", err);
    setTasks([]);
  }
};

useEffect(() => {
  fetchTasks();
}, [status, priority]);



useEffect(() => {
  fetchTasks();
}, [status, priority]); // svaka promena filtera poziva API


  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <h1>Tasks</h1>
<div className="filters">
  <div className="filter-group">
    <Filter size={16} color="#ff8fa3" />

    <select
      className="filter-select"
      value={status}
      onChange={(e) => setStatus(e.target.value)}
    >
      <option value="svi">Svi statusi</option>
      <option value="započet">Započet</option>
      <option value="u toku">U toku</option>
      <option value="završen">Završen</option>
    </select>

    <select
      className="filter-select"
      value={priority}
      onChange={(e) => setPriority(e.target.value)}
    >
      <option value="svi">Svi prioriteti</option>
      <option value="nizak">Nizak</option>
      <option value="srednji">Srednji</option>
      <option value="visok">Visok</option>
      <option value="hitno">Hitno</option>
    </select>
  </div>
</div>



      </div>

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p>Nema zadataka za prikaz.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="task-item">
              <div className="task-title">{task.title}</div>
              <div className="task-meta">
                <span
                  className={`task-priority ${
                    task.priority === "hitno" ? "high" : ""
                  }`}
                >
                  {task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1)}
                </span>
                <span className="task-status">{task.status}</span>
                <span className="task-deadline">Rok: {task.deadline}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
