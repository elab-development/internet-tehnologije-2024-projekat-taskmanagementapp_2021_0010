import { useEffect, useState } from "react";
import api from "../api/axios";
import { Filter } from "lucide-react";
import ItemCard from "../components/ItemCard";
import ModalForm from "../components/ModalForm";
import { useSearchParams } from "react-router-dom";
import "../App.css";
import usePaginatedFetch from "../hooks/usePaginatedFetch";

export default function Tasks() {
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);                                                        
  const [searchParams] = useSearchParams();
  const [lists, setLists] = useState([]);
  const [categories, setCategories] = useState([]);
  const {
  data: tasks,
  currentPage,
  lastPage,
  fetchData,
} = usePaginatedFetch();

  //Pokušava da izvuče vrednost pridruženu ključu list_id iz trenutnog URL-a.
  const listId = searchParams.get("list_id");

  const fetchTasks = (page = 1) => {
  let url = listId
    ? `/task-lists/${listId}/tasks`
    : `/tasks/search`;

  if (!listId) {
    if (status !== "all") url += `?status=${status}`;
    if (priority !== "all") url += `${url.includes("?") ? "&" : "?"}priority=${priority}`;
  }

  fetchData(url, page, (res) => res.data.data);
};

// Okidač za učitavanje kada se promeni stranica, filter ili lista
  useEffect(() => {
    fetchTasks(1); // Uvek resetuj na 1. stranu kada se promeni filter
  }, [listId, status, priority]);

// Učitavanje listi i kategorija za modale
  useEffect(() => {
    api.get("/task-lists").then((res) => setLists(res.data.data));
    api.get("/task-categories").then((res) => setCategories(res.data.data));
  }, []);




  // --- Kreiranje ili ažuriranje zadatka ---
 const handleCreateOrUpdate = (data) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged-in for this actions");
    return;
  }

// Formatiraj podatke pre slanja
const formattedData = {
  //Preuzima sve postojeće parove ključ/vrednost iz originalnog data objekta (koji je stigao iz ModalForm komponente) i kopira ih u novi objekat formattedData
  //Ovo osigurava da su sva polja koja nisu eksplicitno navedena ispod i dalje uključena.
  ...data,
  title: data.title?.trim() || "",
  description: data.description?.trim() || "",
  priority: data.priority || null,
  status: data.status || null,
  deadline: data.deadline ? new Date(data.deadline).toISOString().split("T")[0] : null,
  estimated_hours: data.estimated_hours ? Number(data.estimated_hours) : null,
  category_id: data.category_id ? Number(data.category_id) : null,
                                                                  //iz URLa
  task_list_id: data.task_list_id ? Number(data.task_list_id) : (listId ? Number(listId) : null),
};

console.log(" Šaljem na backend:", formattedData);

const req = editTask
  ? api.put(`/tasks/${editTask.id}`, formattedData)
  : api.post("/tasks", formattedData);


  req
    .then(() => { // Ako je Promise u 'req' uspešan, pokreni ovo
      fetchTasks(currentPage);
      setShowModal(false);
      setEditTask(null);
    })
    .catch((err) => {
      if (err.response?.status === 401) {
        alert("You must be logged in!");
        localStorage.removeItem("token");
        window.location.href = "/login"; // preusmeri korisnika
      } else {
        console.error("Error occured:", err);
      }
    });
};


  // --- Brisanje zadatka ---
  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure?")) return;

  try {
    await api.delete(`/tasks/${id}`);
    fetchTasks(currentPage);
  } catch (err) {
    if (err.response?.status === 401) {
      alert("You must be logged!");
    } else {
      console.error("Error:", err);
    }
  }
};


const handleExport = async () => {
  try {
    const response = await api.get("/tasks/export", {
      responseType: "blob", //Ovo je instrukcija za Axios (HTTP klijent) da očekuje odgovor u formatu Binary Large Object (Blob) predstavlja sirove, neobrađene podatke (bajtove)., a ne kao standardni JSON
    });

    //Ova metoda generiše jedinstven, privremeni URL koji ukazuje na podatke koji se sada nalaze u memoriji pretraživača.
   //Ovaj URL je neophodan jer se HTML link (<a> tag) ne može direktno povezati sa Blob objektom.
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Kreiraj <a> element i simuliraj klik za preuzimanje
    const link = document.createElement("a");
    link.href = url;
    //Atribut download govori pretraživaču da, kada se link klikne, sačuva sadržaj sa imenom "tasks_export.csv"
    link.setAttribute("download", "tasks_export.csv");
    //dodavanje u dom-programatski ubacujemo <a> tag u stranicu da bi browser mogao da ga "klikne" i pokrene preuzimanje.
    document.body.appendChild(link);
    //simuliranje klika
    link.click();

    // Nakon što je preuzimanje pokrenuto, važno je osloboditi memoriju i očistiti DOM.
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(" Greška pri izvozu:", error);
    alert("Error occured during export!");
  }
};


  // --- Render ---
  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1 className="font-bold text-white mb-6" style={{ fontSize: "2rem" }}>
          {listId ? "Tasks in list" : "All tasks"}
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
              <option value="all">All status</option>
              <option value="started">Started</option>
              <option value="in progress">In Progress</option>
              <option value="finished">Finished</option>
            </select>

            <select
              className="filter-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="all">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          
        </div>

        {/* Dugme za dodavanje zadatka */}
        <button className="pink-btn" onClick={() => setShowModal(true)}>
          + Add task
        </button>
      </div>

      {/* Lista zadataka */}
      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p>There is no tasks to show.</p>
        ) : (
          tasks.map((task) => (
            //Svaki element u tasks nizu se pretvara u ItemCard komponentu:
            <ItemCard
              key={task.id}
              title={task.title}
              subtitle={
                <>
                {/* Prazne vitičaste zagrade sa razmakom unutra, {" "}, koriste se u React/JSX kodu da bi se ubacio jedan razmak (space) između dva susedna HTML (JSX) elementa, a da se pritom ne naruši struktura ili stilizovanje. */}
                  Priority:{" "}
                  <span
                    className={`task-priority ${
                      task.priority === "emergency" ? "emergency" : ""
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
              description={`Deadline: ${task.deadline || "There`s no deadline"}`}
              onEdit={() => {
  const taskData = {
    ...task,
    // proveravajući da li su ID-jevi ugnježdeni (npr. task.category?.id) ili su direktno na objektu.
    category_id: task.category_id || task.category?.id || "",
    task_list_id: task.task_list_id || task.taskList?.id || "",
    // formatiraj datum (da ne bude null ili full ISO string)
    deadline: task.deadline ? task.deadline.split("T")[0] : "",
  };

  console.log(" Edit modal data:", taskData); // vidi u konzoli da li ima category_id i task_list_id
  setEditTask(taskData);
  setShowModal(true);
}}

              onDelete={() => handleDelete(task.id)}
            />
          ))
        )}
      </div>
{/*  Dugme za izvoz CSV-a */}
<div className="export-btn-container">
  <button className="pink-btn" onClick={handleExport}>
    📤 Get CSV
  </button>
</div>



      {/* Paginacija */}
      
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => fetchTasks(currentPage - 1)}
          >
            ←
          </button>
          {/* Dobijate niz čija dužina odgovara ukupnom broju stranica. */}
                                {/* Prvi argument (vrednost elementa) se ignoriše jer nam je potrebna samo dužina niza. */}
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
      

      {/* Modal za kreiranje/izmenu zadatka */}
      {showModal && (
        <ModalForm
          title={editTask ? "Edit task" : "New task"}
          fields={[
            {
              name: "title",
              label: "Title",
              type: "text",
              placeholder: "Title",
            },
            {
              name: "description",
              label: "Description",
              type: "text",
              placeholder: "Description",
            },
            {
              name: "priority",
              label: "Priority",
              type: "select",
              options: ["low", "medium", "high", "emergency"],
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["started", "in progress", "finished"],
            },
            { name: "deadline", label: "Deadline", type: "date" },
            {
              name: "estimated_hours",
              label: "Estimated hours",
              type: "number",
              placeholder: "example: 5",
            },
            {
  name: "category_id",
  label: "Category",
  type: "select",
  options: categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  })),
},

    {
  name: "task_list_id",
  label: "List",
  type: "select",
  options: lists.map((list) => ({
    value: list.id,
    label: list.name || list.title || `Lista ${list.id}`,
  })),
  // Dodaj defaultnu vrednost ako editujemo postojeći task
  //?. znači “ako postoji editTask, uzmi task_list_id”.
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