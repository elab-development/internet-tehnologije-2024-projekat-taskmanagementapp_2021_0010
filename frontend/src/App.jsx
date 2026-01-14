import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Lists from "./pages/Lists";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout"; //
import Sidebar from "./components/Sidebar";
import Breadcrumbs from "./components/Breadcrumbs";
import { useState } from "react"; 
import api from "./api/axios";
import ModalForm from "./components/ModalForm";
import "./App.css";

function App() {
  return (
    <Router>
{/* <Router> je postavljen oko <AppContent /> zato što komponente unutar <AppContent /> koriste rutiranje (Route, Link, useNavigate…), pa moraju biti unutar Router konteksta. */}
{/* ❌ <Routes> ne bi radio
❌ useNavigate() bi bacio grešku
❌ <Link> ne bi znao gde vodi */}
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
// NOVO: Stanje za profil modal
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userData, setUserData] = useState({});

  // NOVO: Funkcija za otvaranje i učitavanje podataka
  const handleOpenProfile = () => {
  api.get("/user")
    .then((res) => {
      // uzima sve podatke korisnika dodaje / prepisuje polje password praznim stringom
      setUserData({ ...res.data.data, password: "" });
      setShowProfileModal(true);
    })
    .catch((err) => console.error("Error fetching user:", err));
};

const handleUpdateProfile = (data) => {
  //Pravimo kopiju podataka(ne diramo originalni state / form data)
  //payload su podaci koji idu u body HTTP zahteva.
  const payload = { ...data };

  // If password is empty, remove it so the backend doesn't try to update it
  if (!payload.password || payload.password.trim() === "") {
    delete payload.password;
  }

  api.put("/user", payload)
    .then(() => {
      alert("Profile updated successfully!");
      setShowProfileModal(false);
    })
    .catch((err) => {
      if (err.response && err.response.status === 422) {
        console.error("Validation errors:", err.response.data.errors);
        alert("Please check your input (e.g., email might be taken).");
      } else {
        console.error("Server Error:", err);
        alert("A server error occurred (500).");
      }
    });
};

  // Sidebar prikazujemo samo na glavnim stranicama
  const showSidebar = location.pathname === "/" || location.pathname === "/tasks" || location.pathname === "/lists";

  // Hide UI za login/register/logout-Deklarišemo promenljivu koja će biti true ili false
                                                  //Proverava da li se trenutni URL path nalazi u tom nizu.
  const hideUI = ["/login", "/register", "/logout"].includes(location.pathname);

  return (
    //<div> je glavni kontejner u kojem se nalazi ceo vizuelni sadržaj aplikacije.
    <div  className="app-container" style={{  backgroundColor: "#000", // da ne ostane crn ekran bez sadržaja  minHeight: "100vh",
}}   >
{/* Ako se prikazuje Sidebar, samo tada omogućavamo i Profile Modal */}
      {showSidebar && (
        <>
          <Sidebar onMyAccountClick={handleOpenProfile} />
          
          {/* Modal je ovde 'vezan' za postojanje Sidebara */}
          {showProfileModal && (
  <ModalForm title="My Account"
    fields={[
      { name: "name", label: "Name", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "password", label: "Change Password", type: "password" },
    ]}
    initialData={userData}
    //ne poziva se fja ovde
    onSubmit={handleUpdateProfile} 
    onClose={() => setShowProfileModal(false)}
  />
)}
        </>
      )}
       <main className="main-content">
        {/* Breadcrumbs prikazujemo samo kad UI nije sakriven */}
        {!hideUI && <Breadcrumbs />}

        <Routes>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} /> 
        </Routes>
      </main>
    </div>
  );
}

export default App;
