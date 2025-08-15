import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://outfithavenstore-backend.onrender.com/api/categories"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="pt-36 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading collections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-36 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-50 p-8 rounded-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-300 text-black rounded hover:bg-yellow-400 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-36 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
          Our Collections
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Explore our premium categories
        </p>

        {categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-500">
              No collections available at the moment.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-0 md:px-5 mt-10 mb-20">
            {categories.map((category, index) => (
              <div
                key={index}
                className="relative group h-64 md:h-96 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${category.image})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                </div>
                <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {category.title}
                  </h2>
                  <Link
                    to={`/category/${encodeURIComponent(
                      category.link ||
                        category.title.toLowerCase().replace(/\s+/g, "-")
                    )}`}
                    className="mt-4 text-white underline text-sm hover:text-yellow-300 transition-colors duration-300"
                  >
                    View Products
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;

