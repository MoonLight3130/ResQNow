import React from 'react';
// LoadScript removed
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { EmergencyProvider, useEmergency } from './context/EmergencyContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import DispatchPage from './pages/DispatchPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DriverDashboard from './pages/DriverDashboard';

import Footer from './components/Footer';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null; // Or a loading spinner
  if (!user) return <Navigate to="/login" />;
  return children;
};

// Wrapper to handle redirection based on context state
const AppContent = () => {
  const { activeRequest } = useEmergency();
  const { user } = useAuth();

  if (user?.role === 'driver') {
    return (
      <div className="flex flex-col min-h-screen">
        {user && <Header />}
        <main className="flex-1 pt-4">
          <Routes>
            <Route path="/" element={<ProtectedRoute><DriverDashboard /></ProtectedRoute>} />
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/register" element={<Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-4">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

          <Route path="/" element={
            activeRequest ? <Navigate to="/dispatch" /> : <Home />
          } />

          <Route path="/dispatch" element={
            <ProtectedRoute>
              {!activeRequest ? <Navigate to="/" /> : <DispatchPage />}
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

// Libraries removed

function App() {
  return (
    <Router>
      <AuthProvider>
        <EmergencyProvider>
          <AppContent />
        </EmergencyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
