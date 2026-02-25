// src/pages/AddNewProperty.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { propertyAPI } from "../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Select from "react-select";

const AddNewProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [rules, setRules] = useState([]);
  const [currentRule, setCurrentRule] = useState("");

  // Address search states
  const [addressOptions, setAddressOptions] = useState([]);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const [searchingCity, setSearchingCity] = useState(false);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [searchingProvince, setSearchingProvince] = useState(false);

  // Selected province for city filtering
  const [selectedProvince, setSelectedProvince] = useState(null);

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    zip_code: "",
    price: "",
    bedrooms: "1",
    bathrooms: "1",
    max_persons: "1",
    status: "available",
  });

  // Search timeouts
  const [addressTimeout, setAddressTimeout] = useState(null);
  const [provinceTimeout, setProvinceTimeout] = useState(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (addressTimeout) clearTimeout(addressTimeout);
      if (provinceTimeout) clearTimeout(provinceTimeout);
    };
  }, [addressTimeout, provinceTimeout]);

  // Search for addresses
  const searchAddress = (inputValue) => {
    if (addressTimeout) clearTimeout(addressTimeout);

    if (inputValue.length < 3) {
      setAddressOptions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setSearchingAddress(true);
      try {
        const response = await axios({
          method: "GET",
          url: `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            inputValue + ", Philippines",
          )}&addressdetails=1&limit=5`,
          headers: {
            Accept: "application/json",
            "User-Agent": "PropertyManagementApp/1.0",
          },
        });

        const options = response.data.map((item) => ({
          value: item,
          label: item.display_name,
          address: item.address,
        }));

        setAddressOptions(options);
      } catch (error) {
        console.error("Error searching address:", error);
      } finally {
        setSearchingAddress(false);
      }
    }, 500);

    setAddressTimeout(timeout);
  };

  // Search for provinces
  const searchProvince = (inputValue) => {
    if (provinceTimeout) clearTimeout(provinceTimeout);

    if (inputValue.length < 2) {
      setProvinceOptions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setSearchingProvince(true);
      try {
        const response = await axios({
          method: "GET",
          url: `https://nominatim.openstreetmap.org/search?format=json&state=${encodeURIComponent(
            inputValue,
          )}&country=Philippines&limit=10`,
          headers: {
            Accept: "application/json",
            "User-Agent": "PropertyManagementApp/1.0",
          },
        });

        // Filter unique province names
        const uniqueProvinces = new Map();
        response.data.forEach((item) => {
          const provinceName = item.display_name.split(",")[0];
          if (!uniqueProvinces.has(provinceName)) {
            uniqueProvinces.set(provinceName, {
              value: item,
              label: provinceName,
            });
          }
        });

        const options = Array.from(uniqueProvinces.values());
        setProvinceOptions(options);
      } catch (error) {
        console.error("Error searching province:", error);
      } finally {
        setSearchingProvince(false);
      }
    }, 500);

    setProvinceTimeout(timeout);
  };

  // Search for cities based on selected province
  const searchCities = async (province) => {
    if (!province) {
      setCityOptions([]);
      return;
    }

    setSearchingCity(true);
    try {
      // Search for cities in the selected province
      const response = await axios({
        method: "GET",
        url: `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          "cities in " + province.label + ", Philippines",
        )}&limit=20`,
        headers: {
          Accept: "application/json",
          "User-Agent": "PropertyManagementApp/1.0",
        },
      });

      // Filter and format city options
      const cities = response.data
        .filter(
          (item) =>
            item.type === "city" ||
            item.type === "town" ||
            item.type === "municipality",
        )
        .map((item) => ({
          value: item,
          label: item.display_name.split(",")[0],
        }))
        // Remove duplicates
        .filter(
          (city, index, self) =>
            index === self.findIndex((c) => c.label === city.label),
        );

      setCityOptions(cities);
    } catch (error) {
      console.error("Error searching cities:", error);
      // Try alternative search if first method fails
      try {
        const fallbackResponse = await axios({
          method: "GET",
          url: `https://nominatim.openstreetmap.org/search?format=json&city=${encodeURIComponent(
            "",
          )}&state=${encodeURIComponent(province.label)}&country=Philippines&limit=20`,
          headers: {
            Accept: "application/json",
            "User-Agent": "PropertyManagementApp/1.0",
          },
        });

        const cities = fallbackResponse.data
          .map((item) => ({
            value: item,
            label: item.display_name.split(",")[0],
          }))
          .filter(
            (city, index, self) =>
              index === self.findIndex((c) => c.label === city.label),
          );

        setCityOptions(cities);
      } catch (fallbackError) {
        console.error("Fallback city search failed:", fallbackError);
        toast.error("Failed to load cities for this province");
      }
    } finally {
      setSearchingCity(false);
    }
  };

  // Handle address selection
  const handleAddressSelect = (selectedOption) => {
    if (!selectedOption) {
      setFormData((prev) => ({
        ...prev,
        address: "",
        city: "",
        state: "",
        zip_code: "",
      }));
      return;
    }

    const address = selectedOption.address;

    // Extract address components
    const street = [
      address.road,
      address.suburb,
      address.neighbourhood,
      address.hamlet,
      address.village,
      address.town,
    ]
      .filter(Boolean)
      .join(", ");

    const city =
      address.city ||
      address.town ||
      address.municipality ||
      address.village ||
      address.hamlet ||
      "";
    const state = address.state || "";
    const zipCode = address.postcode || "";

    // If we get a state from the address, update the province selection
    if (state) {
      const provinceOption = { label: state, value: { display_name: state } };
      setSelectedProvince(provinceOption);
      searchCities(provinceOption);
    }

    setFormData((prev) => ({
      ...prev,
      address: street || selectedOption.label.split(",")[0],
      city: city,
      state: state,
      zip_code: zipCode,
    }));
  };

  // Handle province selection
  const handleProvinceSelect = (selectedOption) => {
    setSelectedProvince(selectedOption);

    if (selectedOption) {
      setFormData((prev) => ({
        ...prev,
        state: selectedOption.label,
        city: "", // Reset city when province changes
      }));

      // Search for cities in the selected province
      searchCities(selectedOption);
    } else {
      setSelectedProvince(null);
      setCityOptions([]);
      setFormData((prev) => ({
        ...prev,
        state: "",
        city: "",
      }));
    }
  };

  // Handle city selection
  const handleCitySelect = (selectedOption) => {
    if (selectedOption) {
      setFormData((prev) => ({
        ...prev,
        city: selectedOption.label,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 10) {
      toast.warning("You can only upload up to 10 images");
      return;
    }

    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error("Some images exceed 5MB. Please choose smaller files.");
      return;
    }

    setImages([...images, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);

    toast.success(`${files.length} image(s) added successfully!`);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    URL.revokeObjectURL(newPreviews[index]);

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setImagePreviews(newPreviews);

    toast.info("Image removed");
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [imagePreviews]);

  const addRule = () => {
    if (currentRule.trim()) {
      setRules([...rules, currentRule.trim()]);
      setCurrentRule("");
      toast.success("Rule added successfully!");
    } else {
      toast.warning("Please enter a rule first");
    }
  };

  const removeRule = (index) => {
    setRules(rules.filter((_, i) => i !== index));
    toast.info("Rule removed");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addRule();
    }
  };

  const validateForm = () => {
    const requiredFields = ["address", "city", "state", "price"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return false;
    }

    if (images.length === 0) {
      toast.warning("Please upload at least one property image");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      formDataToSend.append("rules", JSON.stringify(rules));

      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const loadingToast = toast.loading("Listing your property...");

      const response = await propertyAPI.createProperty(formDataToSend);

      if (response?.data?.success || response?.success) {
        toast.update(loadingToast, {
          render: "Property listed successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        setTimeout(() => {
          navigate("/properties", {
            state: { message: "Property listed successfully!" },
          });
        }, 1000);
      } else {
        throw new Error(response?.message || "Failed to list property");
      }
    } catch (err) {
      console.error("Submission error:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to list property";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Custom styles for react-select
  const selectStyles = {
    control: (base) => ({
      ...base,
      minHeight: "42px",
      borderColor: "#e2e8f0",
      "&:hover": {
        borderColor: "#cbd5e0",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#3B82F6"
        : state.isFocused
          ? "#EBF5FF"
          : "white",
      color: state.isSelected ? "white" : "#1a202c",
      cursor: "pointer",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 50,
    }),
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Add New Property
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Property Details</h2>

              {/* Location */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Location
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State/Province *
                      </label>
                      <Select
                        options={provinceOptions}
                        onInputChange={searchProvince}
                        onChange={handleProvinceSelect}
                        isLoading={searchingProvince}
                        placeholder="Search province first..."
                        isClearable
                        styles={selectStyles}
                        value={selectedProvince}
                        noOptionsMessage={() =>
                          searchingProvince
                            ? "Searching..."
                            : "Type to search provinces"
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <Select
                        options={cityOptions}
                        onChange={handleCitySelect}
                        isLoading={searchingCity}
                        placeholder={
                          selectedProvince
                            ? "Select city..."
                            : "Select province first"
                        }
                        isClearable
                        isDisabled={!selectedProvince}
                        styles={selectStyles}
                        value={cityOptions.find(
                          (option) => option.label === formData.city,
                        )}
                        noOptionsMessage={() =>
                          searchingCity
                            ? "Loading cities..."
                            : "No cities found"
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        name="zip_code"
                        value={formData.zip_code}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter zip code"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <Select
                      options={addressOptions}
                      onInputChange={searchAddress}
                      onChange={handleAddressSelect}
                      isLoading={searchingAddress}
                      placeholder="Type to search address..."
                      isClearable
                      styles={selectStyles}
                      noOptionsMessage={() =>
                        searchingAddress
                          ? "Searching..."
                          : "Type at least 3 characters to search"
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Pricing and Status */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Pricing & Status
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per month (₱) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="5000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    >
                      <option value="available">Available</option>
                      <option value="rented">Rented</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Room Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Room Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms *
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bathrooms *
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      required
                      min="1"
                      step="0.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Persons *
                    </label>
                    <input
                      type="number"
                      name="max_persons"
                      value={formData.max_persons}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Property Images</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images (Max 10)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
                <p className="text-sm text-gray-500 mt-1">
                  You can upload up to 10 images. Each image max 5MB.
                </p>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Rules */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Property Rules</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Rule
                </label>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={currentRule}
                    onChange={(e) => setCurrentRule(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="e.g., No pets allowed"
                  />
                  <button
                    type="button"
                    onClick={addRule}
                    className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  >
                    Add Rule
                  </button>
                </div>
              </div>

              {rules.length > 0 && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {rules.map((rule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                    >
                      <span className="text-sm text-gray-700 flex-1 mr-2">
                        {rule}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeRule(index)}
                        className="text-red-500 hover:text-red-700 flex-shrink-0"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {rules.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No rules added yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/properties")}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              "List Property"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewProperty;
