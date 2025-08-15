import React, { useState, useEffect } from "react";
import { CiUser, CiSearch, CiShoppingCart } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseSharp } from "react-icons/io5";
import { FaTwitter, FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [clickedLink, setClickedLink] = useState(null);

  const [products, setProducts] = useState([]); // State for storing fetched products
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  const location = useLocation();
  const isTransparentRoute = ["/", "/collections"].includes(location.pathname);

  // Fetch products from the API
  useEffect(() => {
    fetch("https://outfithavenstore-backend.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClickLink = (link) => {
    setClickedLink(link);
    setTimeout(() => setClickedLink(null), 200);
  };

  const handleMobileClick = (link) => {
    handleClickLink(link);
    setIsOpen(false);
  };

  const handleSearchClick = () => {
    setShowSearchOverlay(true);
    setSearchTerm("");
  };

  const handleSearchClose = () => {
    setShowSearchOverlay(false);
    setSearchTerm("");
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <nav
      className={`flex justify-between items-center p-4 fixed top-0 left-0 z-30 w-full transition-all duration-300 ${
        isTransparentRoute && !isScrolled
          ? "bg-transparent text-white mt-5 md:mt-6"
          : "bg-white text-black shadow-md h-[50px]"
      }`}
    >
      <button
        onClick={toggleMenu}
        className={`md:hidden flex flex-col space-y-1 text-2xl ${
          isTransparentRoute && !isScrolled ? "text-white" : "text-black"
        }`}
      >
        <RxHamburgerMenu />
      </button>

      <h1
        className="text-lg md:text-4xl font-bold ml-8 mt-3"
        style={{ fontFamily: "Condiment" }}
      >
        Outfit Haven
      </h1>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-4 text-xs gap-4">
        <li>
          <Link
            to="/"
            onClick={() => handleClickLink("/")}
            className={`transition-transform duration-150 ease-in-out ${
              clickedLink === "/" ? "scale-95" : ""
            }`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/shop"
            onClick={() => handleClickLink("/shop")}
            className={`transition-transform duration-150 ease-in-out ${
              clickedLink === "/shop" ? "scale-95" : ""
            }`}
          >
            Shop
          </Link>
        </li>
        <li>
          <Link
            to="/how-to-order"
            onClick={() => handleClickLink("/how-to-order")}
            className={`transition-transform duration-150 ease-in-out ${
              clickedLink === "/how-to-order" ? "scale-95" : ""
            }`}
          >
            How To Order
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            onClick={() => handleClickLink("/contact")}
            className={`transition-transform duration-150 ease-in-out ${
              clickedLink === "/contact" ? "scale-95" : ""
            }`}
          >
            Contact
          </Link>
        </li>
      </ul>

      {/* Icons */}
      <div className="flex space-x-4 text-2xl md:mr-10">
        <Link to={localStorage.getItem("token") ? "/account" : "/login"}>
          <CiUser className="cursor-pointer" />
        </Link>
        <CiSearch onClick={handleSearchClick} className="hidden md:flex" />
        <Link to="/cart">
          <CiShoppingCart className="cursor-pointer" />
        </Link>
      </div>

      {/* Mobile Menu */}
      <ul
        className={`fixed top-0 left-0 h-full w-full bg-gray-100 text-black p-6 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden flex flex-col gap-y-11`}
      >
        <div className="relative w-full mt-10">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for products..."
            className="w-full p-2 rounded border border-gray-300 bg-white text-black outline-none"
          />

          {searchTerm && (
            <div
              className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg rounded max-h-60 overflow-y-auto z-50"
              style={{
                zIndex: 9999, // Ensure this element is on top of others
                pointerEvents: "auto", // Ensure that links can be clicked
              }}
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    onClick={() => {
                      setSearchTerm("");
                      setIsOpen(false);
                    }}
                    className="flex items-center p-2 hover:bg-gray-100 border-b border-gray-100"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-contain mr-3"
                    />
                    <span className="text-sm">{product.name}</span>
                  </Link>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500 text-center">
                  No products found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Links */}
        <li>
          <Link
            to="/"
            onClick={() => handleMobileClick("/")}
            className={`flex justify-center items-center transition-transform duration-150 ease-in-out ${
              clickedLink === "/" ? "scale-95" : ""
            }`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/shop"
            onClick={() => handleMobileClick("/shop")}
            className={`flex justify-center items-center transition-transform duration-150 ease-in-out ${
              clickedLink === "/shop" ? "scale-95" : ""
            }`}
          >
            Shop
          </Link>
        </li>
        <li>
          <Link
            to="/how-to-order"
            onClick={() => handleMobileClick("/how-to-order")}
            className={`flex justify-center items-center transition-transform duration-150 ease-in-out ${
              clickedLink === "/how-to-order" ? "scale-95" : ""
            }`}
          >
            How To Order
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            onClick={() => handleMobileClick("/contact")}
            className={`flex justify-center items-center transition-transform duration-150 ease-in-out ${
              clickedLink === "/contact" ? "scale-95" : ""
            }`}
          >
            Contact
          </Link>
        </li>

        <button
          className="absolute top-10 right-8 text-2xl"
          onClick={toggleMenu}
        >
          <IoCloseSharp />
        </button>

        <li className="flex justify-center items-center gap-11 mt-11">
          <FaTwitter />
          <FaFacebookF />
          <FaInstagram />
        </li>
      </ul>

      {/* Search Overlay */}
      {showSearchOverlay && (
        <div className="fixed inset-0 bg-white text-black max-h-fit bg-opacity-95 z-50 flex flex-col items-center justify-start pt-20 px-6">
          <button
            className="absolute top-8 right-8 text-3xl text-black"
            onClick={handleSearchClose}
          >
            <IoCloseSharp />
          </button>
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for products..."
            className="w-full max-w-3xl p-4 text-lg border-b border-black text-center bg-transparent outline-none"
          />
          <div className="mt-10 text-black w-full max-w-6xl p-2">
            <p className="text-center mb-6 text-lg">
              {searchTerm
                ? `Results for "${searchTerm}"`
                : "Start typing to search..."}
            </p>
            {searchTerm && filteredProducts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="text-center">
                    <Link
                      to={`/product/${product._id}`} // Link to product details
                      onClick={() => {
                        setSearchTerm(""); // Clear the search term
                        setShowSearchOverlay(false); // Close the search overlay
                      }}
                      className="flex flex-col items-center"
                    >
                      <img
                        src={product.images[0]} // Assuming the first image is the main one
                        alt={product.name}
                        className="w-full object-contain"
                      />
                      <p className="mt-2 text-sm">{product.name}</p>
                    </Link>
                  </div>
                ))}
              </div>
            )}
            {searchTerm && filteredProducts.length === 0 && (
              <p className="text-center">No products found.</p>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

