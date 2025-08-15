import React from "react";
import { FaTwitter } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { HiOutlineMinusSmall } from "react-icons/hi2";

const Footer = () => {
  return (
    <footer className="bg-white text-black py-4">
      <div className="flex flex-col items-center mt-8 justify-center md:flex-row md:justify-between ">
        <h1
          className=" text-5xl md:text-6xl font-bold md:ml-32 mt-3 cursor-pointer"
          style={{ fontFamily: "Condiment" }}
        >
          Outfit Haven
        </h1>
        <ul className="hidden md:flex space-x-4 md:mr-11 text-sm">
          <li>Home</li>
          <li>Shop</li>
          <li>Brand</li>
          <li>Blog</li>
          <li>Contact</li>
        </ul>
        <div className="flex mt-3 gap-2 md:mr-44 md:gap-4 cursor-pointer">
          <FaTwitter />
          <FaFacebookF />
          <FaInstagram />
        </div>
      </div>
      <div className="hidden md:flex items-center justify-center text-5xl ml-16">
        <HiOutlineMinusSmall />
      </div>
      <ul className="hidden md:flex flex-row items-center justify-center gap-0 text-xs ml-20 mt-3 cursor-pointer">
        <li>Privacy Policy</li>
        <li className="ml-48">Terms and Conditions</li>
      </ul>
    </footer>
  );
};

export default Footer;
