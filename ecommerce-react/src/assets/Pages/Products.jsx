import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaInstagram } from "react-icons/fa";
import { HiMinus } from "react-icons/hi2";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [current, setCurrent] = useState(0);
  const [sliderImages, setSliderImages] = useState([
    `${import.meta.env.BASE_URL}images/nike.jpg`,
    `${import.meta.env.BASE_URL}images/adi.jpg`,
    `${import.meta.env.BASE_URL}images/puma.jpg`,
  ]);
  const [loading, setLoading] = useState(true);

  // Define the layout configuration for the 4 categories
  const categoryLayout = [
    {
      colSpan: "col-span-2 md:col-span-2",
      rowSpan: "",
    },
    {
      colSpan: "col-span-1 md:col-span-1 md:row-start-2",
      rowSpan: "md:row-span-2",
    },
    {
      colSpan: "col-span-1 md:col-span-1 md:row-start-2",
      rowSpan: "md:row-span-2",
    },
    {
      colSpan: "col-span-2 md:col-span-3",
      rowSpan: "md:row-span-2",
    },
  ];

  // Fetch products
  useEffect(() => {
    fetch("https://outfithavenstore-backend.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch categories from backend
  useEffect(() => {
    fetch("https://outfithavenstore-backend.onrender.com/api/categories")
      .then((res) => res.json())
      .then((data) => {
        // Only take first 4 categories and merge with layout
        const formattedCategories = data.slice(0, 4).map((cat, index) => ({
          ...cat,
          ...categoryLayout[index],
        }));
        setCategories(formattedCategories);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch slider images from the backend
  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        const res = await fetch(
          "https://outfithavenstore-backend.onrender.com/api/slider"
        );
        const data = await res.json();
        if (data.length > 0 && data[0].images.length > 0) {
          setSliderImages(data[0].images);
        }
      } catch (err) {
        console.error(err);
        setSliderImages([`${import.meta.env.BASE_URL}images/default.png`]);
      } finally {
        setLoading(false);
      }
    };
    fetchSliderImages();
  }, []);

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));

  const nextSlide = () =>
    setCurrent((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="h-16 w-16 border-4 border-white border-t-transparent rounded-full animate-slow-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center text-2xl font-bold md:text-3xl md:font-semibold mt-6">
        ALL PRODUCTS
      </h1>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {products.map((product) => (
          <Link to={`/product/${product._id}`} key={product._id}>
            <div className="border rounded-lg shadow-md p-4 hover:shadow-xl transition">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <h2 className="text-center">{product.name}</h2>
              <p className="text-md text-center mt-2">
                ₱{product.price.toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center mb-4">
        <button className="flex items-center justify-center bg-black text-white text-xs py-4 px-10 mt-11">
          Shop All Collections
        </button>
      </div>

      {/* Categories Section */}
      {/* Categories Section with Slower Animation */}
      <div className="grid grid-cols-2 md:grid-cols-5 md:grid-rows-2 gap-3 p-4 h-[500px]">
        {categories.map((cat, index) => (
          <Link
            key={cat._id || index}
            to={`/category/${encodeURIComponent(
              cat.link || cat.title.toLowerCase().replace(/\s+/g, "-")
            )}`}
            className={`group relative flex flex-col items-center justify-center p-4 overflow-hidden isolate ${cat.colSpan} ${cat.rowSpan}`}
          >
            {/* Background Image with slower animation */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-[transform] duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:scale-[1.08]"
              style={{
                backgroundImage: `url(${cat.image})`,
                transformOrigin: "center center",
              }}
              aria-hidden="true"
            >
              {/* Gradient overlay with slower transition */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/30 transition-opacity duration-1000 group-hover:opacity-60" />
            </div>

            {/* Content with slower animation */}
            <div className="relative z-10 text-center transition-all duration-1000 ease-out group-hover:-translate-y-1">
              <h1 className="text-lg md:text-2xl font-bold text-white drop-shadow-lg transition-all duration-1000 group-hover:opacity-90">
                {cat.title}
              </h1>
              <span className="inline-block mt-3 text-sm md:text-base font-medium text-white border-b-2 border-white/80 transition-all duration-1000 group-hover:border-white group-hover:translate-y-1">
                View Products
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Image Slider */}
      <div
        className="relative h-[75vh] md:h-[80vh] bg-cover bg-center transition-all duration-300 mt-5 md:mt-14"
        style={{ backgroundImage: `url(${sliderImages[current]})` }}
      >
        <div className="absolute inset-0 bg-black/30 z-10">
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-white bg-black/50 p-3 rounded-full hover:bg-black/70"
            aria-label="Previous Slide"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-white bg-black/50 p-3 rounded-full hover:bg-black/70"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:px-80 md:mt-5 tracking-normal">
        <h1 className="text-center text-3xl px-16 mt-5 md:text-3xl font-bold text-gray-800">
          Outfit Haven brings you the best local clothing brands from the
          Philippines, celebrating Filipino style and community.
        </h1>
        <h1 className="flex justify-center items-center">
          <Link to="#">
            <HiMinus className="text-5xl" />
          </Link>
        </h1>
        <p className="text-center px-3 md:px-7">
          Outfit Haven is a home for local Filipino brands—built to showcase
          creativity, culture, and identity through fashion. We celebrate the
          spirit of Filipino streetwear and inspire the next generation through
          every piece we carry.
        </p>
      </div>

      <div className="flex justify-center mt-5">
        <button className="flex item-center justify-center text-center px-8 py-2 text-sm bg-black text-white">
          Learn More
        </button>
      </div>

      <div className="relative flex items-center justify-center py-4 mt-10">
        <h1 className="text-2xl font-bold text-gray-700">Instagram</h1>
        <button className="absolute mt-24 md:right-16 flex items-center gap-2 bg-black text-white text-xs px-8 py-3">
          <FaInstagram />
          Follow Us
        </button>
      </div>
    </div>
  );
};

export default Products;

