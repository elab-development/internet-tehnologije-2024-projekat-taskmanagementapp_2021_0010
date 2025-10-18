import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Tasks from "./pages/Tasks";
import Lists from "./pages/Lists";
import './App.css';
import Sidebar from './components/Sidebar';


function App() {
  return (
    <Router>
      <div className="app-container">
       <Sidebar/>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/lists" element={<Lists />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
