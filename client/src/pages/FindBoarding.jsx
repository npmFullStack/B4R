// pages/FindBoarding.jsx (updated with filter badges inside search bar)
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Search,
  MapPin,
  Home,
  Users,
  Filter,
  X,
  Bed,
  Bath,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { publicPropertyAPI } from "@/services/api";
import { toast } from "react-toastify";
import heroBg from "@/assets/images/heroBg.png";
import noSearchImg from "@/assets/images/NoSearch.png";

const FindBoarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: new URLSearchParams(location.search).get("search") || "",
    city: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    maxPersons: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [cities, setCities] = useState([]);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.city) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.bedrooms) count++;
    if (filters.maxPersons) count++;
    setActiveFilterCount(count);
  }, [filters]);

  // Fetch cities for filter dropdown
  useEffect(() => {
    fetchCities();
  }, []);

  // Fetch properties on mount and when URL search param changes
  useEffect(() => {
    const searchParam = new URLSearchParams(location.search).get("search");
    if (searchParam) {
      setFilters((prev) => ({ ...prev, search: searchParam }));
      fetchProperties({ ...filters, search: searchParam });
    } else {
      fetchProperties();
    }
  }, [location.search]);

  const fetchCities = async () => {
    try {
      const response = await publicPropertyAPI.getCities();
      if (response.data.success) {
        setCities(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchProperties = async (searchFilters = filters) => {
    setLoading(true);
    try {
      // Build params object, removing empty values
      const params = {};
      if (searchFilters.search) params.search = searchFilters.search;
      if (searchFilters.city) params.city = searchFilters.city;
      if (searchFilters.minPrice) params.minPrice = searchFilters.minPrice;
      if (searchFilters.maxPrice) params.maxPrice = searchFilters.maxPrice;
      if (searchFilters.bedrooms) params.bedrooms = searchFilters.bedrooms;
      if (searchFilters.maxPersons)
        params.maxPersons = searchFilters.maxPersons;

      const response = await publicPropertyAPI.searchProperties(params);

      if (response.data.success) {
        setProperties(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Update URL with search param
    if (filters.search) {
      navigate(`/find-boarding?search=${encodeURIComponent(filters.search)}`);
    } else {
      navigate("/find-boarding");
    }
    fetchProperties(filters);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setShowFilters(false);
    fetchProperties(filters);
  };

  const clearFilters = () => {
    setFilters({
      search: new URLSearchParams(location.search).get("search") || "",
      city: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      maxPersons: "",
    });
    fetchProperties({
      search: new URLSearchParams(location.search).get("search") || "",
      city: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      maxPersons: "",
    });
  };

  const removeFilter = (filterName) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (filterName === "city") newFilters.city = "";
      if (filterName === "price") {
        newFilters.minPrice = "";
        newFilters.maxPrice = "";
      }
      if (filterName === "bedrooms") newFilters.bedrooms = "";
      if (filterName === "maxPersons") newFilters.maxPersons = "";
      return newFilters;
    });
    // Fetch properties with updated filters
    setTimeout(() => {
      fetchProperties({
        ...filters,
        [filterName]: "",
        ...(filterName === "price" && { minPrice: "", maxPrice: "" }),
      });
    }, 0);
  };

  const handleViewProperty = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Search Section with heroBg */}
      <section className="relative bg-cover bg-center bg-no-repeat pt-24 pb-16 min-h-[450px] flex items-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />

        {/* Darker Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Find Your Perfect Boarding Space
            </h1>
            <p className="text-white/90 text-base mb-6">
              Search through hundreds of properties to find your ideal home
            </p>

            {/* Search Bar with Buttons Inside and Filter Badges */}
            <form onSubmit={handleSearch} className="mb-3">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Main Search Row */}
                <div className="flex items-center">
                  {/* Search Icon */}
                  <div className="pl-4">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Search Input */}
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search by location, city, or address..."
                    className="flex-1 px-3 py-3 focus:outline-none text-sm"
                  />

                  {/* Filter Button */}
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-3 font-medium transition-colors flex items-center gap-1.5 text-sm border-l border-gray-200 ${
                      showFilters || activeFilterCount > 0
                        ? "text-primary"
                        : "text-gray-600 hover:text-primary"
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline">Filter</span>
                  </button>

                  {/* Search Button */}
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-3 font-medium hover:bg-primary-dark transition-colors flex items-center gap-1.5 text-sm"
                  >
                    <Search className="w-4 h-4" />
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </div>

                {/* Active Filters Badges Row - Inside Search Bar */}
                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap items-center gap-2 px-4 pb-3 pt-1 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      Active filters:
                    </span>
                    {filters.city && (
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        {filters.city}
                        <button
                          onClick={() => removeFilter("city")}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {(filters.minPrice || filters.maxPrice) && (
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        ₱{filters.minPrice || "0"} - ₱
                        {filters.maxPrice || "Any"}
                        <button
                          onClick={() => removeFilter("price")}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {filters.bedrooms && (
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        {filters.bedrooms}+ beds
                        <button
                          onClick={() => removeFilter("bedrooms")}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {filters.maxPersons && (
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        Max{" "}
                        {filters.maxPersons === "4" ? "4+" : filters.maxPersons}
                        <button
                          onClick={() => removeFilter("maxPersons")}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </form>

            {/* Expanded Filters Dropdown - More Compact */}
            {showFilters && (
              <div className="relative">
                <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-20">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-800">
                        Filter Properties
                      </h3>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* City Filter */}
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-600 text-left">
                          City
                        </label>
                        <select
                          name="city"
                          value={filters.city}
                          onChange={handleFilterChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="">All Cities</option>
                          {cities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Price Range */}
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-600 text-left">
                          Price Range (₱)
                        </label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                            placeholder="Min"
                            min="0"
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <span className="text-gray-400 text-xs">—</span>
                          <input
                            type="number"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                            placeholder="Max"
                            min="0"
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>

                      {/* Bedrooms */}
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-600 text-left">
                          Bedrooms
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {["", "1", "2", "3", "4"].map((value) => (
                            <button
                              key={value || "any"}
                              type="button"
                              onClick={() =>
                                setFilters((prev) => ({
                                  ...prev,
                                  bedrooms:
                                    prev.bedrooms === value ? "" : value,
                                }))
                              }
                              className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                                filters.bedrooms === value
                                  ? "bg-primary text-white border-primary"
                                  : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
                              }`}
                            >
                              {value === "" ? "Any" : `${value}+`}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Max Persons */}
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-600 text-left">
                          Max Persons
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {["", "1", "2", "3", "4"].map((value) => (
                            <button
                              key={value || "any"}
                              type="button"
                              onClick={() =>
                                setFilters((prev) => ({
                                  ...prev,
                                  maxPersons:
                                    prev.maxPersons === value ? "" : value,
                                }))
                              }
                              className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                                filters.maxPersons === value
                                  ? "bg-primary text-white border-primary"
                                  : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
                              }`}
                            >
                              {value === ""
                                ? "Any"
                                : value === "4"
                                  ? "4+"
                                  : value}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-200">
                      <button
                        onClick={clearFilters}
                        className="px-4 py-1.5 text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={applyFilters}
                        className="px-4 py-1.5 text-xs bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="flex-1 py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {loading
                ? "Searching..."
                : `Found ${properties.length} propert${properties.length !== 1 ? "ies" : "y"}`}
            </p>
          </div>

          {/* Properties Grid - Updated to 1 item per row with image on left */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-lg shadow-md p-3 animate-pulse flex gap-4"
                >
                  <div className="w-48 h-32 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="space-y-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col md:flex-row"
                  onClick={() => handleViewProperty(property.id)}
                >
                  {/* Property Image - Left side */}
                  <div className="md:w-64 h-48 md:h-auto bg-gray-200 relative flex-shrink-0">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={`http://localhost:5000/uploads/properties/${property.images[0]}`}
                        alt={property.address}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <Home className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Available
                    </div>
                  </div>

                  {/* Property Details - Right side */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        {property.address}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {property.city}, {property.state} {property.zip_code}
                        </span>
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mb-3">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Bed className="w-4 h-4" />
                          <span className="text-sm">
                            {property.bedrooms} bedroom
                            {property.bedrooms !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Bath className="w-4 h-4" />
                          <span className="text-sm">
                            {property.bathrooms} bathroom
                            {property.bathrooms !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">
                            Max {property.max_persons} person
                            {property.max_persons !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {property.description && (
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                          {property.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(property.price)}
                        <span className="text-sm font-normal text-gray-600 ml-1">
                          /month
                        </span>
                      </span>
                      <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // No Results Found with NoSearch.png
            <div className="text-center py-12">
              <img
                src={noSearchImg}
                alt="No results found"
                className="w-64 h-64 mx-auto mb-4 opacity-75"
              />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Properties Found
              </h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                We couldn't find any properties matching your search criteria.
                Try adjusting your filters or check back later for new listings.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 bg-primary text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FindBoarding;
