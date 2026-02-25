// src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Home, Calendar, MessageSquare, Heart } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      label: "Properties Viewed",
      value: "24",
      icon: Home,
      color: "bg-blue-500",
    },
    { label: "Bookings", value: "3", icon: Calendar, color: "bg-green-500" },
    {
      label: "Messages",
      value: "12",
      icon: MessageSquare,
      color: "bg-purple-500",
    },
    { label: "Favorites", value: "8", icon: Heart, color: "bg-red-500" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstname}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your boarding house search
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-gray-700">
              You viewed "Cozy Studio in Downtown"
            </p>
            <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-gray-700">
              New message from landlord about "Modern Apartment"
            </p>
            <span className="text-xs text-gray-500 ml-auto">5 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <p className="text-gray-700">
              You saved "Luxury Condo with Pool" to favorites
            </p>
            <span className="text-xs text-gray-500 ml-auto">yesterday</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
