import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Regions } from "../Components/Regions";

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthdate: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  // Fetch current user on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("https://outfithavenstore-backend.onrender.com/api/me", {
      // Fixed endpoint to match your backend
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          navigate("/login");
        } else {
          setUser({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            birthdate: data.birthdate
              ? new Date(data.birthdate).toISOString().slice(0, 10)
              : "",
            phoneNumber: data.phoneNumber || "",
            address: {
              street: data.address?.street || "",
              city: data.address?.city || "",
              state: data.address?.state || "",
              zipCode: data.address?.zipCode || "",
            },
          });
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      birthdate: user.birthdate,
      phoneNumber: user.phoneNumber,
      address: {
        street: user.address.street,
        city: user.address.city,
        state: user.address.state, // This will map to region in checkout
        zipCode: user.address.zipCode, // This will map to postalCode in checkout
      },
    };

    try {
      const res = await fetch(
        "https://outfithavenstore-backend.onrender.com/api/user/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await res.json();
      if (result.success) {
        alert("Details updated successfully!");
      } else {
        alert("Update failed: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row mt-24 mx-auto max-w-6xl">
      <aside className="w-full md:w-1/4 border-r px-6 py-4">
        <h1 className="text-2xl font-bold mb-6">My Account</h1>
        <ul className="space-y-4 text-sm text-gray-700">
          <li className="hover:text-yellow-500">My details</li>
          <li
            onClick={handleLogout}
            className="hover:text-yellow-500 cursor-pointer"
          >
            Log out
          </li>
        </ul>
      </aside>

      <main className="w-full md:w-3/4 p-6">
        <h2 className="text-xl font-bold mb-4">My details</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">First Name</label>
              <input
                type="text"
                value={user.firstName}
                onChange={(e) =>
                  setUser({ ...user, firstName: e.target.value })
                }
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Last Name</label>
              <input
                type="text"
                value={user.lastName}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full border border-gray-300 p-2 rounded bg-gray-100"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Birth Date</label>
              <input
                type="date"
                value={user.birthdate}
                onChange={(e) =>
                  setUser({ ...user, birthdate: e.target.value })
                }
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Phone Number</label>
              <input
                type="text"
                value={user.phoneNumber}
                onChange={(e) =>
                  setUser({ ...user, phoneNumber: e.target.value })
                }
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Address</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Street</label>
                <input
                  type="text"
                  name="street"
                  value={user.address.street}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={user.address.city}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block mb-1">State/Region</label>
                <select
                  name="state"
                  value={user.address.state}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="">Select Region</option>
                  {Regions.map((region, index) => (
                    <option key={index} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Zip/Postal Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={user.address.zipCode}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Save Changes
          </button>
        </form>
      </main>
    </div>
  );
};

export default Account;

