// src/pages/ListProperty.jsx
import React from "react";
import { Link } from "react-router-dom";
import NoProperty from "@/assets/images/NoProperty.png";

const ListProperty = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        List Your Property
      </h1>

      <div className="bg-white rounded-lg shadow p-12 text-center">
        <img
          src={NoProperty}
          alt="No property"
          className="w-48 h-48 mx-auto mb-6 opacity-50"
        />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          You haven't listed any properties yet
        </h3>
        <p className="text-gray-600 mb-6">
          Start earning by listing your first boarding house property.
        </p>
        <Link
          to="/add-property"
          className="inline-flex bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          List Your First Property
        </Link>
      </div>
    </div>
  );
};

export default ListProperty;
