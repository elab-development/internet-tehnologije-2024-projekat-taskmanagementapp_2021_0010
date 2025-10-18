import { useEffect, useState } from "react";
import api from "../api/axios";
import ItemCard from "../components/ItemCard";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchTasks = (page = 1) => {
    api.get(`/tasks?page=${page}`)
      .then((res) => {
        setTasks(res.data.data);
        setCurrentPage(res.data.meta.current_page);
        setLastPage(res.data.meta.last_page);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1 className="font-bold text-white mb-6" style={{ fontSize: '2rem' }}>All Tasks</h1>
        <button className="pink-btn">+ Add Task</button>
      </div>

      <div className="item-list">
        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          tasks.map((task) => (
            <ItemCard
              key={task.id}
              title={task.title}
              subtitle={`Priority: ${task.priority} | Status: ${task.status}`}
              description={`Deadline: ${task.deadline || "No deadline"}`}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => fetchTasks(currentPage - 1)}>←</button>
        {[...Array(lastPage)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => fetchTasks(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button disabled={currentPage === lastPage} onClick={() => fetchTasks(currentPage + 1)}>→</button>
      </div>
    </div>
  );
}
