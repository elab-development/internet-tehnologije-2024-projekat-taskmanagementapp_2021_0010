import { useEffect, useState } from 'react';
import api from '../api/axios';
import { List, CheckCircle, AlertTriangle, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalLists: 0,
    completed: 0,
    emergency: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Kasnije ovde možeš povlačiti podatke sa svog API-ja
    // api.get('/dashboard-stats').then(res => setStats(res.data));
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your overview.</p>
        </div>
</div>

    </div>
  );
}
