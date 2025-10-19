import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Lists from "./pages/Lists";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout"; // ✅ dodaj
import Sidebar from "./components/Sidebar";
import Breadcrumbs from "./components/Breadcrumbs";
import "./App.css";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  // Sidebar prikazujemo samo na glavnim stranicama
  const showSidebar =
    location.pathname === "/" ||
    location.pathname === "/tasks" ||
    location.pathname === "/lists";

  // Hide UI za login/register/logout
  const hideUI = ["/login", "/register", "/logout"].includes(location.pathname);

  return (
    <div
      className="app-container"
      style={{
        backgroundColor: "#000", // da ne ostane crn ekran bez sadržaja
        minHeight: "100vh",
      }}
    >
      {showSidebar && <Sidebar />}

      <main className="main-content">
        {/* Breadcrumbs prikazujemo samo kad UI nije sakriven */}
        {!hideUI && <Breadcrumbs />}

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} /> {/* ✅ Logout ruta */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
