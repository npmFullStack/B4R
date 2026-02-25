// src/components/NavBar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, Bell, MessageCircle, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NavBar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showMessages, setShowMessages] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-2">
      <nav className="px-4">
        <div className="flex items-center justify-between">
          {/* Left section - Menu toggle and Logo */}
          <div className="flex items-center space-x-4">
            {/* Menu toggle button */}
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>

            {/* Logo */}
            <NavLink to="/dashboard" className="flex items-center">
              <span className="font-heading text-2xl font-bold text-gray-950">
                BH<span className="text-3xl text-primary">4</span>RENT
              </span>
            </NavLink>
          </div>

          {/* Right section - Notifications, Messages, Profile */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5 text-gray-700" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>

                  {/* Notifications dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b">
                        <h3 className="font-semibold text-gray-900">
                          Notifications
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                          <p className="text-sm text-gray-800">
                            New booking request
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            2 minutes ago
                          </p>
                        </div>
                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                          <p className="text-sm text-gray-800">
                            Your property was viewed
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            1 hour ago
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="relative">
                  <button
                    onClick={() => setShowMessages(!showMessages)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                    aria-label="Messages"
                  >
                    <MessageCircle className="w-5 h-5 text-gray-700" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  </button>

                  {/* Messages dropdown */}
                  {showMessages && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b">
                        <h3 className="font-semibold text-gray-900">
                          Messages
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                          <p className="text-sm font-medium text-gray-900">
                            John Doe
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            Hi, I'm interested in your property...
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            5 minutes ago
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-gray-700">
                      {user?.firstname}
                    </span>
                  </button>

                  {/* Profile dropdown menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <NavLink
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Dashboard
                      </NavLink>
                      <NavLink
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        My Profile
                      </NavLink>
                      <NavLink
                        to="/bookings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        My Bookings
                      </NavLink>
                      <hr className="my-2 border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // User not logged in - show sign in/up buttons
              <div className="flex items-center space-x-2">
                <NavLink
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
                >
                  Get Started
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
