import { useEffect, useState } from "react";
import api from "../api/axios";
import ItemCard from "../components/ItemCard";
import ModalForm from "../components/ModalForm";
import { useNavigate } from "react-router-dom";

export default function Lists() {
  const [lists, setLists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editList, setEditList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const navigate = useNavigate();

  const fetchLists = (page = 1) => {
    api.get(`/task-lists?page=${page}`)
      .then((res) => {
        setLists(res.data.data);
        setCurrentPage(res.data.meta.current_page);
        setLastPage(res.data.meta.last_page);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchLists();
  }, []);

 const handleCreateOrUpdate = (data) => {
  // Ako korisnik nije prijavljen (nema token)
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Morate biti prijavljeni da biste dodavali ili menjali liste!");
    return; // prekini funkciju odmah
  }

  const req = editList
    ? api.put(`/task-lists/${editList.id}`, data)
    : api.post(`/task-lists`, { ...data, user_id: 1 }); 

  req
    .then(() => {
      fetchLists();
      setShowModal(false);
      setEditList(null);
    })
    .catch((err) => {
      // ako backend ipak vrati 401 (npr. token istekao)
      if (err.response?.status === 401) {
        alert("You have to be logged in!");
        localStorage.removeItem("token");
        window.location.href = "/login"; // redirekt na login
      } else {
        console.error("Error occured during saving list", err);
      }
    });
};


const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete list?")) return;

  try {
    await api.delete(`/task-lists/${id}`);
    fetchLists();
  } catch (err) {
    if (err.response?.status === 401) {
        alert("You have to be logged in!");
    } else {
      console.error("Error occured during deleting list", err);
    }
  }
};


  return (
    <div className="lists-page">
      <div className="page-header">
        <h1 className="font-bold text-white mb-6" style={{ fontSize: '2rem' }}>Task Lists</h1>
        <button className="pink-btn" onClick={() => setShowModal(true)}>+ New List</button>
      </div>

      <div className="item-list">
        {lists.length === 0 ? (
          <p>No task lists found.</p>
        ) : (
          lists.map((list) => (
            <ItemCard
              key={list.id}
              title={list.name}
              subtitle={`${list.tasks.length} tasks`}
              description={list.description}
              onEdit={() => { setEditList(list); setShowModal(true); }}
              onDelete={() => handleDelete(list.id)}
              onClick={() => navigate(`/tasks?list_id=${list.id}`)}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => fetchLists(currentPage - 1)}>←</button>
        {[...Array(lastPage)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => fetchLists(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button disabled={currentPage === lastPage} onClick={() => fetchLists(currentPage + 1)}>→</button>
      </div>

      {showModal && (
        <ModalForm
          title={editList ? "Edit List" : "New List"}
          fields={[
            { name: "name", label: "Name", type: "text", placeholder: "Enter list name" },
            { name: "description", label: "Description", type: "text", placeholder: "Optional description" }
          ]}
          initialData={editList || {}}
          onSubmit={handleCreateOrUpdate}
          onClose={() => { setShowModal(false); setEditList(null); }}
        />
      )}
    </div>
  );
}
