import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/account");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://outfithavenstore-backend.onrender.com/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      console.log(result);

      if (result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify({ id: result.user_id })); // or result.user.id if it's an object
        alert("Login successful!");
        navigate("/account");
      } else {
        alert(result.error || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong.");
    }
  };
  return (
    <div className="mt-24">
      <h1 className="text-center text-3xl md:text-2xl font-bold">Login</h1>
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-7 md:mt-5">
        <div className="flex flex-col w-80 md:w-[220px]">
          <label htmlFor="email" className="text-xs">
            Email
          </label>
          <input
            type="text"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="text-xs focus:outline-none border h-11 md:h-8 border-gray-400 p-2 py-[4px]"
          />
        </div>
        <div className="flex flex-col w-80 md:w-[220px]">
          <label htmlFor="password" className="text-sm">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="text-xs focus:outline-none border h-11 md:h-8 border-gray-400 p-2 py-[4px]"
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-black text-white w-80 h-11 mt-6 md:w-20 md:h-9 md:text-[11px] text-sm hover:bg-gray-700 mx-auto block"
      >
        Sign In
      </button>
      <div className="flex flex-col justify-center text-[12px] md:text-[13px] items-center mt-7 md:mt-5 gap-1 mt-10px mb-20">
        <div className="flex flex-row gap-1">
          <p className="text-gray-500">Don't have an account ?</p>
          <Link
            to="/signup"
            className="hover:text-yellow-500 flex flex-row gap-1 underline"
          >
            Sign Up
          </Link>
        </div>

        <Link to="/passwordrecovery" className="hover:text-yellow-500">
          Forgot Password
        </Link>
      </div>
    </div>
  );
};

export default Login;

