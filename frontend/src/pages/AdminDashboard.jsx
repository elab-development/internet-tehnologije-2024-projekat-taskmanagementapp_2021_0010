import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { UserMinus, ShieldCheck, LogOut, Edit2, UserPlus } from 'lucide-react';
import ModalForm from '../components/ModalForm'; 
import ItemCard from '../components/ItemCard'; 

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = (page = 1) => {
    api.get(`/users?page=${page}&per_page=5`)
      .then((res) => {
        setUsers(res.data.data);
        setCurrentPage(res.data.meta.current_page);
        setLastPage(res.data.meta.last_page);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateOrUpdate = (data) => {
    const req = editUser
      ? api.put(`/users/${editUser.id}`, data)
      : api.post("/users", data);

    req.then(() => {
      fetchUsers(currentPage);
      setShowModal(false);
      setEditUser(null);
    }).catch(err => alert("Greška pri čuvanju korisnika"));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      api.delete(`/users/${id}`).then(() => fetchUsers(currentPage));
    }
  };

  return (
    <div className="tasks-page" style={{ maxWidth: '1100px', margin: '0 auto' }}>
<style>{`
  /* 1. Sklanjanje breadcrumbs-a */
  .breadcrumbs, .breadcrumbs-container { 
    display: none !important; 
  }

  /* 2. Kartica: Vraćamo je u normalu, samo dodajemo unutrašnji razmak */
  .item-card {
    padding: 20px !important;
    margin-bottom: 15px !important;
    display: flex !important;
    flex-direction: column !important; /* Bitno da bi actions otišao ispod */
    justify-content: flex-start !important;
  }

  /* 3. Header: Ime i Email ostaju u istom redu (horizontalno) */
  .item-header {
    display: flex !important;
    flex-direction: row !important; /* Vraća email pored imena */
    justify-content: space-between !important;
    align-items: center !important;
    width: 100% !important;
    margin-bottom: 0px !important; /* Sklanjamo stari margin ako postoji */
  }

  .item-header h3 {
    margin: 0 !important;
    font-size: 1.2rem !important;
  }

  /* 4. KLJUČNI DEO: Razmak do dugmića */
  .item-actions {
    margin-top: 25px !important; /* Ovde kontrolišeš razmak između teksta i dugmića */
    display: flex !important;
    gap: 10px !important;
    border-top: 1px solid rgba(255, 143, 163, 0.1); /* Suptilna linija iznad dugmića */
    padding-top: 15px !important;
  }

  /* 5. Admin Panel Header */
  .admin-header-line {
    border-bottom: 1px solid rgba(255, 143, 163, 0.2);
    margin-bottom: 30px;
    padding-bottom: 15px;
  }
`}</style>

      <div className="page-header admin-header-line">
        <div>
          <h1 style={{ fontSize: "2.5rem", color: "white", marginBottom: "5px" }}>Admin Panel</h1>
          <p style={{ color: "#888", fontSize: "1rem" }}>
            Overview of all registered accounts and system permissions.
          </p>
        </div>
        
        <div className="dashboard-buttons" style={{ display: 'flex', gap: '15px' }}>
          <button className="pink-btn" onClick={() => { setEditUser(null); setShowModal(true); }}>
            <UserPlus size={18} /> Add User
          </button>
          <button className="pink-btn" style={{ borderColor: '#ff1744' }} onClick={() => { localStorage.clear(); navigate('/login'); }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <div className="tasks-list">
        {users.map((user) => (
          <ItemCard
            key={user.id}
            title={user.name}
            subtitle={
              <div style={{ marginBottom: '10px' }}>
                <span style={{ color: '#ff8fa3' }}>{user.email}</span>
                <span style={{ margin: '0 10px', color: '#444' }}>|</span>
                <span className={`task-priority ${user.role === 'admin' ? 'high' : ''}`}>
                  <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {user.role}
                </span>
              </div>
            }
            // onEdit i onDelete će ItemCard-u proslediti akcije koje će biti odvojene gap-om iz CSS-a gore
            onEdit={() => {
              setEditUser(user);
              setShowModal(true);
            }}
            onDelete={user.id !== JSON.parse(localStorage.getItem('user'))?.id ? () => handleDelete(user.id) : null}
          />
        ))}
      </div>

      <div className="pagination" style={{ marginTop: '30px' }}>
        <button disabled={currentPage === 1} onClick={() => fetchUsers(currentPage - 1)}> ← </button>
        {[...Array(lastPage)].map((_, i) => (
          <button 
            key={i} 
            className={currentPage === i + 1 ? "active" : ""} 
            onClick={() => fetchUsers(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button disabled={currentPage === lastPage} onClick={() => fetchUsers(currentPage + 1)}> → </button>
      </div>

      {showModal && (
        <ModalForm
          title={editUser ? "Edit User" : "Add New User"}
          fields={[
            { name: "name", label: "Name", type: "text", placeholder: "Enter name" },
            { name: "email", label: "Email", type: "email", placeholder: "example@mail.com" },
            { 
              name: "role", 
              label: "Role", 
              type: "select", 
              options: [
                { value: "user", label: "User" },
                { value: "admin", label: "Admin" },
                { value: "guest", label: "Guest" }
              ] 
            },
            { name: "password", label: "Password", type: "password", placeholder: "••••••" },
          ]}
          initialData={editUser || { role: 'user' }}
          onSubmit={handleCreateOrUpdate}
          onClose={() => {
            setShowModal(false);
            setEditUser(null);
          }}
        />
      )}
    </div>
  );
}