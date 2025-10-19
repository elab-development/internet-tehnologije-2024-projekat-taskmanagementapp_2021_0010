import { useEffect, useState } from "react";
import api from "../api/axios";               // 🔓 javni GET (prikaz)
import apiProtected from "../api/axiosProtected"; // 🔒 zaštićene POST/PUT/DELETE
import { Filter } from "lucide-react";
import ItemCard from "../components/ItemCard";
import ModalForm from "../components/ModalForm";
import { useSearchParams } from "react-router-dom";
import "../App.css";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("svi");
  const [priority, setPriority] = useState("svi");
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchParams] = useSearchParams();

  const listId = searchParams.get("list_id");

  // 🔓 Javni GET (prikaz zadataka)
  const fetchTasks = (page = 1) => {
    const url = listId ? `/task-lists/${listId}` : `/tasks?page=${page}`;
    api
      .get(url)
      .then((res) => {
        let data = listId ? res.data.data.tasks : res.data.data;
        if (!Array.isArray(data)) data = [data];

        // Filtriranje po statusu i prioritetu
        let filtered = data;
        if (status !== "svi") {
          filtered = filtered.filter(
            (task) =>
              task.status &&
              task.status.toLowerCase() === status.toLowerCase()
          );
        }
        if (priority !== "svi") {
          filtered = filtered.filter(
            (task) =>
              task.priority &&
              task.priority.toLowerCase() === priority.toLowerCase()
          );
        }

        setTasks(filtered);
        if (!listId && res.data.meta) {
          setCurrentPage(res.data.meta.current_page);
          setLastPage(res.data.meta.last_page);
        }
      })
      .catch((err) => console.error("❌ Greška pri učitavanju:", err));
  };

  useEffect(() => {
    fetchTasks();
  }, [listId, status, priority]);

  // 🔒 Kreiranje ili ažuriranje zadatka
  const handleCreateOrUpdate = (data) => {
    const req = editTask
      ? apiProtected.put(`/tasks/${editTask.id}`, data)
      : apiProtected.post(`/tasks`, { ...data, task_list_id: listId || 1 });

    req
      .then(() => {
        fetchTasks();
        setShowModal(false);
        setEditTask(null);
      })
      .catch((err) => console.error("❌ Greška pri čuvanju:", err));
  };

  // 🔒 Brisanje zadatka
  const handleDelete = (id) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete zadatak?"))
      return;

    apiProtected
      .delete(`/tasks/${id}`)
      .then(() => fetchTasks())
      .catch((err) => console.error("❌ Greška pri brisanju:", err));
  };

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1 className="font-bold text-white mb-6" style={{ fontSize: "2rem" }}>
          {listId ? "Zadaci u listi" : "Svi zadaci"}
        </h1>

        {/* 🔍 Filteri */}
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

        <button className="pink-btn" onClick={() => setShowModal(true)}>
          + Dodaj zadatak
        </button>
      </div>

      {/* 🧾 Lista zadataka */}
      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p>Nema zadataka za prikaz.</p>
        ) : (
          tasks.map((task) => (
            <ItemCard
              key={task.id}
              title={task.title}
              subtitle={
                <>
                  Prioritet:{" "}
                  <span
                    className={`task-priority ${
                      task.priority === "visok" || task.priority === "hitno"
                        ? "high"
                        : ""
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
              description={`Rok: ${task.deadline || "Nema roka"}`}
              onEdit={() => {
                setEditTask(task);
                setShowModal(true);
              }}
              onDelete={() => handleDelete(task.id)}
            />
          ))
        )}
      </div>

      {/* 🪟 Modal za novi/izmenu zadatka */}
      {showModal && (
        <ModalForm
          title={editTask ? "Izmena zadatka" : "Novi zadatak"}
          fields={[
            {
              name: "title",
              label: "Naslov",
              type: "text",
              placeholder: "Naslov zadatka",
            },
            {
              name: "description",
              label: "Opis",
              type: "text",
              placeholder: "Opis zadatka",
            },
            {
              name: "priority",
              label: "Prioritet",
              type: "select",
              options: ["nizak", "srednji", "visok", "hitno"],
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["započet", "u toku", "završen"],
            },
            { name: "deadline", label: "Rok", type: "date" },
            {
              name: "estimated_hours",
              label: "Procena sati",
              type: "number",
              placeholder: "npr. 5",
            },
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
