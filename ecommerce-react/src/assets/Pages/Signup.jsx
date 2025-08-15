import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://outfithavenstore-backend.onrender.com/api/register",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      console.log(result);

      if (result.message) {
        alert("✅ Registration successful!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        });
      } else {
        alert(result.error || "❌ Registration failed.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Something went wrong. Try again later.");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mt-24">
      <h1 className="text-center text-2xl font-bold">Register Your Account</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center mt-10 space-y-4"
      >
        {/* Row 1: First & Last Name */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col w-80 md:w-[260px]">
            <label htmlFor="firstName" className="text-sm mb-1">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className="border border-gray-400 p-2 text-sm focus:outline-none h-11"
            />
          </div>
          <div className="flex flex-col w-80 md:w-[260px]">
            <label htmlFor="lastName" className="text-sm mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className="border border-gray-400 p-2 text-sm focus:outline-none h-11"
            />
          </div>
        </div>

        {/* Row 2: Email & Password */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col w-80 md:w-[260px]">
            <label htmlFor="email" className="text-sm mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-400 p-2 text-sm focus:outline-none h-11"
            />
          </div>
          <div className="flex flex-col w-80 md:w-[260px]">
            <label htmlFor="password" className="text-sm mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-400 p-2 text-sm focus:outline-none h-11"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-black text-white w-80 md:w-28 h-8 mt-11 hover:bg-gray-800"
        >
          Submit
        </button>

        {/* Cancel Link */}
        <Link to="/" className="text-sm text-black hover:underline mt-1">
          Cancel
        </Link>
      </form>
    </div>
  );
};

export default Signup;

