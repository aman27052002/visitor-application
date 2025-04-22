import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import GatekeeperDashboard from './pages/GatekeeperDashboard';
import { useState } from 'react';
import ProtectedRoute from './components/protectedRoute';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login setUser={setUser} />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute user={user} role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gatekeeper"
        element={
          <ProtectedRoute user={user} role="gatekeeper">
            <GatekeeperDashboard />
          </ProtectedRoute>
        }
      />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
