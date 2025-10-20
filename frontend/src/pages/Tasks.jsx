import { useEffect, useState } from "react";
import api from "../api/axios";
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
const [lists, setLists] = useState([]);
  const listId = searchParams.get("list_id");
const [categories, setCategories] = useState([]);

  // --- Učitavanje zadataka sa filtriranjem i paginacijom ---
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
      .catch((err) => console.error("❌ Greška pri učitavanju zadataka:", err));
  };

  useEffect(() => {
    fetchTasks();
  }, [listId, status, priority]);


  useEffect(() => {
  api
    .get("/task-lists")
    .then((res) => {
      setLists(res.data.data); // ako je tvoja API struktura drugačija, prilagodi
    })
    .catch((err) => console.error("❌ Greška pri učitavanju lista:", err));
}, []);


// --- Učitavanje kategorija iz baze ---
useEffect(() => {
  api.get("/task-categories")
    .then((res) => {
      setCategories(res.data.data); // Laravel Resource vraća data array
    })
    .catch((err) => console.error("❌ Greška pri učitavanju kategorija:", err));
}, []);

  // --- Kreiranje ili ažuriranje zadatka ---
 const handleCreateOrUpdate = (data) => {
  // 🔐 Provera da li je korisnik prijavljen
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Morate biti prijavljeni da biste dodavali ili menjali zadatke!");
    return;
  }

// Formatiraj podatke pre slanja
const formattedData = {
  ...data,
  title: data.title?.trim() || "",
  description: data.description?.trim() || "",
  priority: data.priority || null,
  status: data.status || null,
  deadline: data.deadline ? new Date(data.deadline).toISOString().split("T")[0] : null,
  estimated_hours: data.estimated_hours ? Number(data.estimated_hours) : null,
  category_id: data.category_id ? Number(data.category_id) : null,
  task_list_id: data.task_list_id ? Number(data.task_list_id) : (listId ? Number(listId) : null),
};

console.log("📦 Šaljem na backend:", formattedData);

const req = editTask
  ? api.put(`/tasks/${editTask.id}`, formattedData)
  : api.post("/tasks", formattedData);


  req
    .then(() => {
      fetchTasks();
      setShowModal(false);
      setEditTask(null);
    })
    .catch((err) => {
      // ⚠️ Ako je token nevažeći ili istekla sesija
      if (err.response?.status === 401) {
        alert("Vaša sesija je istekla. Prijavite se ponovo!");
        localStorage.removeItem("token");
        window.location.href = "/login"; // preusmeri korisnika
      } else {
        console.error("❌ Greška pri čuvanju zadatka:", err);
      }
    });
};


  // --- Brisanje zadatka ---
  const handleDelete = async (id) => {
  if (!window.confirm("Da li ste sigurni da želite da obrišete zadatak?")) return;

  try {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  } catch (err) {
    if (err.response?.status === 401) {
      alert("Morate biti prijavljeni da biste obrisali zadatak!");
    } else {
      console.error("Greška pri brisanju:", err);
    }
  }
};


const handleExport = async () => {
  try {
    const response = await api.get("/tasks/export", {
      responseType: "blob", // 📦 važno! da bi preuzeo fajl kao binarni sadržaj
    });

    // Kreiraj URL za fajl u memoriji
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Kreiraj <a> element i simuliraj klik za preuzimanje
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tasks_export.csv");
    document.body.appendChild(link);
    link.click();

    // Očisti
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("❌ Greška pri izvozu:", error);
    alert("Došlo je do greške pri izvozu zadataka!");
  }
};


  // --- Render ---
  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1 className="font-bold text-white mb-6" style={{ fontSize: "2rem" }}>
          {listId ? "Zadaci u listi" : "Svi zadaci"}
        </h1>

        {/* Filteri */}
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

        {/* Dugme za dodavanje zadatka */}
        <button className="pink-btn" onClick={() => setShowModal(true)}>
          + Dodaj zadatak
        </button>
      </div>

      {/* Lista zadataka */}
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
                      task.priority === "hitno" ? "high" : ""
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
  const taskData = {
    ...task,
    // ako backend šalje ugnježdene objekte:
    category_id: task.category_id || task.category?.id || "",
    task_list_id: task.task_list_id || task.taskList?.id || "",
    // formatiraj datum (da ne bude null ili full ISO string)
    deadline: task.deadline ? task.deadline.split("T")[0] : "",
  };

  console.log("📋 Edit modal data:", taskData); // vidi u konzoli da li ima category_id i task_list_id
  setEditTask(taskData);
  setShowModal(true);
}}

              onDelete={() => handleDelete(task.id)}
            />
          ))
        )}
      </div>
{/* 📤 Dugme za izvoz CSV-a */}
<div className="export-btn-container">
  <button className="pink-btn" onClick={handleExport}>
    📤 Izvezi CSV
  </button>
</div>



      {/* Paginacija */}
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

      {/* Modal za kreiranje/izmenu zadatka */}
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
            {
  name: "category_id",
  label: "Kategorija",
  type: "select",
  options: categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  })),
},

            {
  name: "task_list_id",
  label: "Lista",
  type: "select",
  options: lists.map((list) => ({
    value: list.id,
    label: list.name || list.title || `Lista ${list.id}`,
  })),
  // ✅ Dodaj defaultnu vrednost ako editujemo postojeći task
initialValue: editTask?.task_list_id || "",

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