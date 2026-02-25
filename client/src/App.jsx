// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedLayout from "@/components/ProtectedLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import FindBoarding from "@/pages/FindBoarding";
import PropertyDetails from "@/pages/PropertyDetails";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import ListProperty from "@/pages/ListProperty";
import Properties from "@/pages/Properties";
import AddNewProperty from "@/pages/AddNewProperty";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/find-boarding" element={<FindBoarding />} />
          <Route path="/property/:id" element={<PropertyDetails />} />

          {/* Protected routes */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/list-property" element={<ListProperty />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/add-property" element={<AddNewProperty />} />
            <Route path="/edit-property/:id" element={<AddNewProperty />} />
            <Route path="/profile" element={<div>Profile Page</div>} />
            <Route path="/bookings" element={<div>My Bookings</div>} />
            <Route path="/favorites" element={<div>Favorites</div>} />
            <Route path="/messages" element={<div>Messages</div>} />
            <Route path="/settings" element={<div>Settings</div>} />
            <Route path="/analytics" element={<div>Analytics</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
