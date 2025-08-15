import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

const Category = () => {
  const { categoryLink } = useParams(); // Use category link from URL params
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    // Fetch category data by link
    fetch(
      `https://outfithavenstore-backend.onrender.com/api/categories/link/${categoryLink}`
    )
      .then((res) => res.json())
      .then((data) => {
        setCategory(data);
        // Fetch products for the category after category data is fetched
        fetch(
          `https://outfithavenstore-backend.onrender.com/api/products/category/${data._id}`
        )
          .then((res) => res.json())
          .then((data) => setCategoryProducts(data))
          .catch((err) =>
            console.error("Error fetching category products:", err)
          );
      })
      .catch((err) => console.error("Error fetching category:", err));
  }, [categoryLink]);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when category changes
  }, [categoryLink]);

  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${category?.image})` }}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center px-4">
            {category?.title}
          </h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mt-6 px-4 sm:px-6 md:px-12 lg:px-28 flex flex-col sm:flex-row sm:justify-between gap-4">
        <div className="hidden sm:flex flex-wrap items-center text-center gap-1">
          <Link to="/">
            <div className="flex items-center gap-1">
              <p className="text-xs text-gray-400">Home</p>
              <IoIosArrowForward className="text-[8px]" />
            </div>
          </Link>
          <Link to="/shop">
            <div className="flex items-center gap-1">
              <p className="text-xs text-gray-400">Shop</p>
              <IoIosArrowForward className="text-[8px]" />
            </div>
          </Link>
          <Link to={`/category/${categoryLink}`}>
            <div className="flex items-center gap-1">
              <p className="text-xs text-black">{category?.title}</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 sm:p-6 md:p-8">
        {categoryProducts.length > 0 ? (
          categoryProducts.map((product) => (
            <Link to={`/product/${product._id}`} key={product._id}>
              <div className="border rounded-lg shadow-md p-4 hover:shadow-xl transition">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-auto object-contain"
                />
                <h2 className="text-center mt-2 font-semibold">
                  {product.name}
                </h2>
                <p className="text-md text-center mt-1">
                  ₱{product.price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center col-span-4">
            No products available in this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default Category;
