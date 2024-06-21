import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Components/Auth/login';
import Register from './Components/Auth/register';
import EventsList from './Components/Events/EventsList';
import UserDashboard from './Components/User/UserDashboard';
import AdminDashboard from './Components/User/AdminDashboard';
import EventEdit from './Components/Events/EventEdit';
import EventDetails from './Components/Events/EventDetails';


const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role] = useState(localStorage.getItem("role") || "");

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<EventsList token={token} /> } />
          <Route path='/event/:id' element={<EventDetails token={token} />} />
          <Route path='/event/:id/edit' element={token ? <EventEdit token={token} /> : <Navigate to="/login" />} />
          <Route path='/register' element={<Register setToken={setToken} role="USER" />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/adm-reg-adm-registruoti" element={<Register setToken={setToken} role="ADMIN" />} />
          <Route path="/user" element={role === "USER" ? <UserDashboard token={token} /> : (role === "ADMIN" ? <Navigate to="/" /> : <Navigate to="/login" />)} />
          <Route path="/admin" element={role === "ADMIN" ? <AdminDashboard token={token} /> : (role === "USER" ? <Navigate to="/" /> : <Navigate to="/login" />)} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
