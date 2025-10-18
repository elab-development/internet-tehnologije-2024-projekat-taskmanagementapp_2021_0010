import { useEffect, useState } from "react";
import api from "../api/axios";
import ItemCard from "../components/ItemCard";
import ModalForm from "../components/ModalForm";
import { useSearchParams } from "react-router-dom";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchParams] = useSearchParams();

  const listId = searchParams.get("list_id");

  const fetchTasks = (page = 1) => {
    const url = listId ? `/task-lists/${listId}` : `/tasks?page=${page}`;
    api
      .get(url)
      .then((res) => {
        const data = listId ? res.data.data.tasks : res.data.data;
        setTasks(data);
        if (!listId) {
          setCurrentPage(res.data.meta.current_page);
          setLastPage(res.data.meta.last_page);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchTasks();
  }, [listId]);

  const handleCreateOrUpdate = (data) => {
    const req = editTask
      ? api.put(`/tasks/${editTask.id}`, data)
      : api.post(`/tasks`, { ...data, task_list_id: listId || 1 }); // ako nema list_id, koristi 1 testno

    req
      .then(() => {
        fetchTasks();
        setShowModal(false);
        setEditTask(null);
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    api
      .delete(`/tasks/${id}`)
      .then(() => fetchTasks())
      .catch((err) => console.error(err));
  };

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1 className="font-bold text-white mb-6" style={{ fontSize: "2rem" }}>
          {listId ? "Tasks in List" : "All Tasks"}
        </h1>
        <button className="pink-btn" onClick={() => setShowModal(true)}>
          + Add Task
        </button>
      </div>

      <div className="item-list">
        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          tasks.map((task) => (
            <ItemCard
              key={task.id}
              title={task.title}
              subtitle={
                <>
                  Priority:{" "}
                  <span
                    className={`task-priority ${
                      task.priority === "visok" ? "high" : ""
                    }`}
                  >
                    {task.priority
                      ? task.priority.charAt(0).toUpperCase() +
                        task.priority.slice(1)
                      : "N/A"}
                  </span>{" "}
                  | Status: {task.status || "N/A"}
                </>
              }
              description={`Deadline: ${task.deadline || "No deadline"}`}
              onEdit={() => {
                setEditTask(task);
                setShowModal(true);
              }}
              onDelete={() => handleDelete(task.id)}
            />
          ))
        )}
      </div>

      {!listId && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => fetchTasks(currentPage - 1)}
          >
            ←
          </button>
          {[...Array(lastPage)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => fetchTasks(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === lastPage}
            onClick={() => fetchTasks(currentPage + 1)}
          >
            →
          </button>
        </div>
      )}

      {showModal && (
        <ModalForm
          title={editTask ? "Edit Task" : "New Task"}
          fields={[
            { name: "title", label: "Title", type: "text", placeholder: "Task title" },
            { name: "description", label: "Description", type: "text", placeholder: "Task description" },
            { name: "priority", label: "Priority", type: "select", options: ["nizak", "srednji", "visok"] },
            { name: "status", label: "Status", type: "select", options: ["započet", "u toku", "završen"] },
            { name: "deadline", label: "Deadline", type: "date" },
            { name: "estimated_hours", label: "Estimated Hours", type: "number", placeholder: "e.g. 5" },
          ]}
          initialData={editTask || {}}
          onSubmit={handleCreateOrUpdate}
          onClose={() => {
            setShowModal(false);
            setEditTask(null);
          }}
        />
      )}
    </div>
  );
}

