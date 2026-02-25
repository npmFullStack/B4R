// src/components/ProtectedLayout.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import NavBar from "./NavBar";

const ProtectedLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Add padding to main content when sidebar state changes
  React.useEffect(() => {
    // Add padding to the main content area instead of body
    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.style.marginLeft = isSidebarOpen ? "256px" : "80px";
    }
    return () => {
      if (mainContent) {
        mainContent.style.marginLeft = "0";
      }
    };
  }, [isSidebarOpen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isCollapsed={!isSidebarOpen} onToggle={toggleSidebar} />
      <NavBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Main content with dynamic margin */}
      <main
        className="p-6 pt-20 transition-all duration-300 ease-in-out"
        style={{ marginLeft: isSidebarOpen ? "256px" : "80px" }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;
