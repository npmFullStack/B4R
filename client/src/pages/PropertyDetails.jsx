// pages/PropertyDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { publicPropertyAPI } from "@/services/api";
import { MapPin, Bed, Bath, Users, Home, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await publicPropertyAPI.getPropertyById(id);
      if (response.data.success) {
        setProperty(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching property details:", error);
      toast.error("Failed to load property details");
      navigate("/find-boarding");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-96 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </button>

          {/* Image Gallery */}
          <div className="mb-8">
            <div className="relative h-96 rounded-lg overflow-hidden mb-4">
              {property.images && property.images.length > 0 ? (
                <img
                  src={`http://localhost:5000/uploads/properties/${property.images[currentImage]}`}
                  alt={property.address}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/1200x600?text=No+Image";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                  <Home className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {property.images && property.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`h-20 rounded-lg overflow-hidden ${
                      currentImage === index ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <img
                      src={`http://localhost:5000/uploads/properties/${image}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold mb-2">{property.address}</h1>
              <p className="text-gray-600 mb-4 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {property.city}, {property.state} {property.zip_code}
              </p>

              {/* Key Features */}
              <div className="flex gap-4 mb-6">
                <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                  <Bed className="w-4 h-4" />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                  <Bath className="w-4 h-4" />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                  <Users className="w-4 h-4" />
                  <span>Max {property.max_persons} Persons</span>
                </div>
              </div>

              {/* Property Rules */}
              {property.rules && property.rules.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">House Rules</h2>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {property.rules.map((rule, index) => (
                      <li key={index}>{rule.rule_name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Booking Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-24">
              <div className="mb-4">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(property.price)}
                </span>
                <span className="text-gray-600">/month</span>
              </div>

              <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors mb-3">
                Contact Landlord
              </button>

              <button className="w-full border border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors">
                Schedule Viewing
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetails;
