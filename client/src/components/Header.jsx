// components/Header.jsx (updated - search bar removed)
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Search,
  PlusCircle,
  Info,
  Phone,
  LogIn,
  UserPlus,
} from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const navigate = useNavigate();

  // Add scroll listener
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Find Boarding", path: "/find-boarding", icon: Search },
    { name: "About", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Phone },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo - with bigger red 4 and black BH RENT */}
          <NavLink to="/" className="flex items-center">
            <span
              className={`font-heading text-2xl font-bold transition-colors duration-300 ${
                isScrolled ? "text-gray-950" : "text-white"
              }`}
            >
              BH<span className="text-3xl text-primary">4</span>RENT
            </span>
          </NavLink>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-1 font-medium transition-colors duration-200 ${
                      isScrolled
                        ? isActive
                          ? "text-primary"
                          : "text-gray-700 hover:text-primary"
                        : isActive
                          ? "text-primary"
                          : "text-white/90 hover:text-white"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-3">
            <NavLink
              to="/login"
              className={`hidden sm:flex items-center space-x-1 font-medium transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:text-primary"
                  : "text-white/90 hover:text-white"
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </NavLink>

            <NavLink
              to="/register"
              className="flex items-center space-x-1 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>Get Started</span>
            </NavLink>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:text-primary"
                  : "text-white hover:text-white"
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t bg-white rounded-lg shadow-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 ${
                      isActive
                        ? "text-primary bg-primary-light"
                        : "text-gray-700"
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
            <NavLink
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700"
            >
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
