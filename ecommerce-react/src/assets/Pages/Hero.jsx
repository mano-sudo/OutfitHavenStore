import React, { useState, useEffect } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const defaultImage = `${import.meta.env.BASE_URL}images/default.png`;

const ImageSlider = () => {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlider = async () => {
      try {
        const res = await fetch(
          "https://outfithavenstore-backend.onrender.com/api/slider"
        );
        const data = await res.json();

        if (data.length > 0 && data[0].images.length > 0) {
          setImages(data[0].images);
        } else {
          setImages([defaultImage]); // Only set default after fetch
        }
      } catch (err) {
        console.error(err);
        setImages([defaultImage]);
      } finally {
        setLoading(false);
      }
    };
    fetchSlider();
  }, []);

  const prevSlide = () => {
    if (!images.length) return;
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (!images.length) return;
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    // Simple loading animation
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="h-16 w-16 border-4 border-white border-t-transparent rounded-full animate-slow-spin"></div>
      </div>
    );
  }

  return (
    <div
      className="relative h-screen bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: `url(${images[current]})` }}
    >
      {/* Navigation buttons */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      {/* left button*/}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-white"
      >
        <IoIosArrowBack className="text-2xl" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-white"
      >
        <IoIosArrowForward className="text-2xl" />
      </button>
    </div>
  );
};

export default ImageSlider;

