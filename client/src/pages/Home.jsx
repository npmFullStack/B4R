// Home.jsx (updated with min-h-screen hero)
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroImg1 from "@/assets/images/heroImg1.png";
import heroImg2 from "@/assets/images/heroImg2.png";
import heroImg3 from "@/assets/images/heroImg3.png";
import heroImg4 from "@/assets/images/heroImg4.png";
import heroImg5 from "@/assets/images/heroImg5.png";
import heroBg from "@/assets/images/heroBg.png";

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const heroImages = [heroImg1, heroImg2, heroImg3, heroImg4, heroImg5];

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Manual navigation
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length,
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section - min-h-screen */}
      <section className="relative bg-cover bg-center bg-no-repeat min-h-screen flex items-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />

        {/* Darker Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Find Your Perfect
                <span className="text-primary"> Boarding Space</span>
              </h1>
              <p className="text-lg md:text-xl mb-6 text-gray-200">
                Discover comfortable and affordable boarding houses near you.
                Your ideal living space is just a click away.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-lg">
                  Start Searching
                </button>
                <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                  List Your Property
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-8">
                <div>
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-gray-300">Properties</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">1000+</div>
                  <div className="text-gray-300">Happy Tenants</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-gray-300">Cities</div>
                </div>
              </div>
            </div>

            {/* Right Image Carousel */}
            <div className="relative max-w-md mx-auto">
              <div className="relative overflow-hidden rounded-lg shadow-2xl">
                {/* Images */}
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentImage * 100}%)` }}
                >
                  {heroImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Boarding house ${index + 1}`}
                      className="w-full h-[300px] object-cover flex-shrink-0"
                    />
                  ))}
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentImage === index
                          ? "w-6 bg-primary"
                          : "bg-white/50 hover:bg-white"
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied tenants who found their ideal boarding
            space with BH4RENT
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              Browse Properties
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              List Your Property
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
