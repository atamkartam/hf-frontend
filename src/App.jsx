import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import TextToImage from "./pages/TextToImage";
import ImageHistory from "./pages/ImageHistory";
import TextDetail from "./pages/TextDetail";
import ImageDetail from "./pages/ImageDetail";
import TextHistory from "./pages/TextHistory";
import TextGeneration from "./pages/TextGeneration";

const AppLayout = ({ children, isSidebarOpen, toggleSidebar }) => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div style={{ flex: 1 }}>
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div style={{ padding: "1rem" }}>{children}</div>
      </div>
    </div>
  );
};

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; // Mengembalikan true jika token ada, false jika tidak
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  return !isAuthenticated() ? children : <Navigate to="/dashboard" />;
};

const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes (Only accessible when logged out) */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />

        {/* Protected Routes (Only accessible when logged in) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
              <Dashboard isSidebarOpen={isSidebarOpen} />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/text-to-image" element={
          <ProtectedRoute>
            <AppLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
              <TextToImage isSidebarOpen={isSidebarOpen} />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/image-history" element={
          <ProtectedRoute>
            <AppLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
              <ImageHistory isSidebarOpen={isSidebarOpen} />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/image-detail/:sessionId" element={
          <ProtectedRoute>
            <AppLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
              <ImageDetail isSidebarOpen={isSidebarOpen} />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/text-history" element={
          <ProtectedRoute>
            <AppLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
              <TextHistory isSidebarOpen={isSidebarOpen} />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/text-generation" element={
          <ProtectedRoute>
            <AppLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
              <TextGeneration isSidebarOpen={isSidebarOpen} />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/text-detail/:sessionId" element={
          <ProtectedRoute>
            <AppLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
              <TextDetail isSidebarOpen={isSidebarOpen} />
            </AppLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;