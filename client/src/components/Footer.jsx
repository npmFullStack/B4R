// components/Footer.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Search,
  Info,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navItems = [
    { name: "Find Boarding", path: "/find-boarding", icon: Search },
    { name: "About", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Phone },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  const contactInfo = [
    { icon: Phone, text: "+1 (555) 123-4567" },
    { icon: Mail, text: "info@bh4rent.com" },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <NavLink to="/" className="flex items-center mb-4">
              <span className="font-heading text-2xl font-bold text-white">
                BH<span className="text-3xl text-primary">4</span>RENT
              </span>
            </NavLink>
            <p className="text-gray-400 mb-4">
              Your trusted platform for finding the perfect boarding space.
              Connecting tenants with quality accommodations since 2024.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="bg-gray-800 p-2 rounded-lg hover:bg-primary transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index} className="flex items-start space-x-2">
                    <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-400">{item.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-3">
              Subscribe to get updates on new properties and offers
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; {currentYear} BH4RENT. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <NavLink
                to="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </NavLink>
              <NavLink
                to="/terms"
                className="hover:text-primary transition-colors"
              >
                Terms of Service
              </NavLink>
              <NavLink
                to="/faq"
                className="hover:text-primary transition-colors"
              >
                FAQ
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
