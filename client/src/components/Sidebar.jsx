// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Calendar,
  MessageSquare,
  Heart,
  Settings,
  LogOut,
  Users,
  Building2,
  BarChart3,
  PlusCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isCollapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: LayoutDashboard },
    { path: "/properties", name: "My Properties", icon: Building2 },
    { path: "/bookings", name: "Bookings", icon: Calendar },
    { path: "/favorites", name: "Favorites", icon: Heart },
    { path: "/messages", name: "Messages", icon: MessageSquare, badge: 3 },
    { path: "/profile", name: "Profile", icon: Users },
    { path: "/settings", name: "Settings", icon: Settings },
    { path: "/analytics", name: "Analytics", icon: BarChart3 },
  ];

  const handleListProperty = () => {
    navigate("/list-property");
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate("/");
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <aside
        className="bg-white shadow-lg h-screen fixed left-0 top-0 transition-all duration-300 z-50"
        style={{ width: isCollapsed ? "80px" : "256px" }}
      >
        <div className="flex flex-col h-full relative">
          {/* Logo */}
          <div
            className={`h-16 flex items-center ${isCollapsed ? "justify-center" : "justify-start pl-6"} border-b border-gray-100`}
          >
            {isCollapsed ? (
              <span className="font-bold text-xl text-primary">B4</span>
            ) : (
              <span className="font-bold text-xl text-primary">
                BH<span className="text-2xl">4</span>RENT
              </span>
            )}
          </div>

          {/* User badge - always visible */}
          <div
            className={`p-4 ${!isCollapsed ? "border-b border-gray-100" : ""}`}
          >
            {isCollapsed ? (
              // Collapsed view - just avatar
              <div className="flex justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm relative">
                  <span className="text-white font-semibold text-lg">
                    {user?.firstname?.charAt(0)}
                    {user?.lastname?.charAt(0)}
                  </span>
                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></span>
                </div>
              </div>
            ) : (
              // Expanded view - full user info with gradient background
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-lg">
                      {user?.firstname?.charAt(0)}
                      {user?.lastname?.charAt(0)}
                    </span>
                  </div>
                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-white"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">
                    {user?.firstname} {user?.lastname}
                  </p>
                  <p className="text-xs text-gray-500 truncate flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Online
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* List Property Button */}
          <div className={`px-4 ${!isCollapsed ? "mb-2" : ""}`}>
            <button
              onClick={handleListProperty}
              className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"} p-3 w-full bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors relative group shadow-sm`}
              title={isCollapsed ? "List Property" : ""}
            >
              <PlusCircle className="w-5 h-5" />
              {!isCollapsed && (
                <span className="font-medium">List Property</span>
              )}

              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  List Property
                </span>
              )}
            </button>
          </div>

          {/* Navigation menu */}
          <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <p
              className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ${isCollapsed ? "text-center" : "px-4"}`}
            >
              {isCollapsed ? "•••" : "Menu"}
            </p>
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"} p-3 rounded-lg transition-all duration-200 group relative ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {/* Tooltip for collapsed mode */}
                      {isCollapsed && (
                        <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                          {item.name}
                          {item.badge && ` (${item.badge})`}
                        </span>
                      )}

                      {/* Icon with badge indicator */}
                      <div className="relative">
                        <Icon
                          className={`w-5 h-5 ${isActive ? "text-primary" : ""}`}
                        />
                        {item.badge && !isCollapsed && (
                          <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.name}</span>
                          {item.badge && (
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}

                      {/* Active indicator - new design */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"></div>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout button - light red color */}
          <div className="p-4">
            <button
              onClick={handleLogoutClick}
              className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"} p-3 w-full rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors group relative`}
            >
              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  Logout
                </span>
              )}

              <LogOut className="w-5 h-5" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">Logout</span>
                  <span className="text-xs text-rose-400">⌘Q</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 animate-fadeIn">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-rose-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Confirm Logout
                  </h3>
                </div>
                <button
                  onClick={handleLogoutCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to logout? You'll need to login again to
                access your account.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={handleLogoutCancel}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
