// Register.jsx (updated with API integration and toast)
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroBg from "@/assets/images/heroBg.png";
import authImg from "@/assets/images/authImg.png";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (apiError) setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstname.trim()) {
      newErrors.firstname = "First name is required";
      toast.warning("First name is required", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = "Last name is required";
      toast.warning("Last name is required", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      toast.warning("Email is required", {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      toast.warning("Please enter a valid email address", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      toast.warning("Password is required", {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      toast.warning("Password must be at least 8 characters long", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      toast.warning("Please confirm your password", {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading("Creating your account...");

    // Remove confirmPassword before sending
    const { confirmPassword, ...registrationData } = formData;

    // Call register API
    const result = await register(registrationData);

    if (result.success) {
      // Update loading toast to success
      toast.update(loadingToast, {
        render: "Account created successfully! Welcome to BH4RENT!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      // Redirect to dashboard or home
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } else {
      // Update loading toast to error
      toast.update(loadingToast, {
        render: result.error || "Registration failed. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      setApiError(result.error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow relative min-h-screen">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-12 mt-20">
          <div className="max-w-6xl mx-auto">
            {/* Split Container */}
            <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Left Side - Image with Text */}
              <div className="relative hidden md:block">
                <img
                  src={authImg}
                  alt="Boarding house"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h2 className="text-3xl font-bold mb-2">
                    Join BH4RENT Today!
                  </h2>
                  <p className="text-gray-200 mb-4">
                    Create an account to start your journey finding the perfect
                    boarding space.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span className="text-sm">
                        Access thousands of listings
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span className="text-sm">
                        Save your favorite properties
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span className="text-sm">
                        Get personalized recommendations
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="p-8 md:p-10">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Create an Account
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Join BH4RENT to find your perfect boarding space
                  </p>
                </div>

                {/* API Error Message - Keep for backup but toast will show */}
                {apiError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {apiError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="firstname"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          id="firstname"
                          name="firstname"
                          value={formData.firstname}
                          onChange={handleChange}
                          className={`w-full pl-9 pr-3 py-2 border ${
                            errors.firstname
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 placeholder-gray-400 text-sm`}
                          placeholder="John"
                        />
                      </div>
                      {errors.firstname && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.firstname}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="lastname"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          id="lastname"
                          name="lastname"
                          value={formData.lastname}
                          onChange={handleChange}
                          className={`w-full pl-9 pr-3 py-2 border ${
                            errors.lastname
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 placeholder-gray-400 text-sm`}
                          placeholder="Doe"
                        />
                      </div>
                      {errors.lastname && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.lastname}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-3 py-2 border ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 placeholder-gray-400 text-sm`}
                        placeholder="you@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-9 py-2 border ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 placeholder-gray-400 text-sm`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-9 py-2 border ${
                          errors.confirmPassword
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 placeholder-gray-400 text-sm`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>

                  {/* Divider */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-white text-gray-500">
                        Or sign up with
                      </span>
                    </div>
                  </div>

                  {/* Google Sign Up Button */}
                  <button
                    type="button"
                    onClick={() => {
                      toast.info("Google Sign Up coming soon!", {
                        position: "top-right",
                        autoClose: 2000,
                      });
                    }}
                    className="w-full flex items-center justify-center space-x-2 border border-gray-300 bg-white py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-gray-700 font-medium text-sm">
                      Sign up with Google
                    </span>
                  </button>

                  {/* Login Link */}
                  <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{" "}
                    <NavLink
                      to="/login"
                      className="text-primary font-semibold hover:underline"
                    >
                      Sign In
                    </NavLink>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
