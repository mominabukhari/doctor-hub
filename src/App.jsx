import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages Import
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AssistantDashboard from './pages/AssistantDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Role-Based Router Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!profile || !allowedRoles.includes(profile.role))) {
    // If user's role is not allowed, fallback to their dashboard or home
    if (profile?.role === 'patient') return <Navigate to="/patient" replace />;
    if (profile?.role === 'doctor') return <Navigate to="/doctor" replace />;
    if (profile?.role === 'assistant') return <Navigate to="/assistant" replace />;
    if (profile?.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Dashboards according to Roles */}
      <Route path="/patient" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/doctor" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <DoctorDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/assistant" element={
        <ProtectedRoute allowedRoles={['assistant']}>
          <AssistantDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Catch All - Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}