import { useEffect, useState } from "react";
import api from "../api/axios";
import ItemCard from "../components/ItemCard";
import { useNavigate } from "react-router-dom";

export default function Lists() {
  const [lists, setLists] = useState([]);
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

  return (
    <div className="lists-page">
      <div className="page-header">
        <h1 className="font-bold text-white mb-6" style={{ fontSize: '2rem' }}>Task Lists</h1>
        <button className="pink-btn">+ New List</button>
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
    </div>
  );
}
