import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pelanggan from './pages/Pelanggan';
import Penggunaan from './pages/Penggunaan';
import Tagihan from './pages/Tagihan';
import Algoritma from './pages/Algoritma';
import Users from './pages/Users';
import Sidebar from './components/Sidebar';
import './App.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

// Admin Only Route
function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) return <Navigate to="/login" />;
  if (user.id_level !== 1) return <Navigate to="/dashboard" />;

  return children;
}


function AppContent() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const location = useLocation();

  useEffect(() => {
    // Listen to storage changes (for login/logout in other tabs)
    const handleStorage = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Listen to login/logout in this tab
  useEffect(() => {
    const origSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      origSetItem.apply(this, arguments);
      if (key === 'token') setToken(value);
      if (key === 'token' && value === null) setToken(null);
    };
    return () => { localStorage.setItem = origSetItem; };
  }, []);

  return (
    <div className="app-layout">
      {/* Sidebar hanya tampil jika user sudah login (ada token) dan bukan di halaman login */}
      {token && location.pathname !== '/login' && <Sidebar />}
      <div className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/pelanggan" element={<AdminRoute><Pelanggan /></AdminRoute>} />
          <Route path="/penggunaan" element={<ProtectedRoute><Penggunaan /></ProtectedRoute>} />
          <Route path="/tagihan" element={<ProtectedRoute><Tagihan /></ProtectedRoute>} />
          <Route path="/algoritma" element={<ProtectedRoute><Algoritma /></ProtectedRoute>} />
          <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
