import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import FastFood6 from "../assets/FastFood6.jpg";

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Fetch all menus
  const fetchMenus = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/menus`);
      setMenus(response.data);
    } catch (err) {
      setError("Failed to fetch menus");
    }
  };

  // Delete a menu
  const deleteMenu = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/menus/${id}`);
      setMenus(menus.filter((menu) => menu._id !== id));
      setMessage("Menu deleted successfully");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    } catch (err) {
      setError("Failed to delete menu");
      setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // Adminship logic
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
      try {
        const decodedToken = jwtDecode(token);
        setIsAdmin(decodedToken.isAdmin);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div>
      {/* Background Image */}
      <div className="fixed w-full">
        <img src={FastFood6} alt="FastFood_image" className="w-full h-screen" />
      </div>
      {/* Content */}
      <div className="mx-auto p-4 relative z-10">
        <h1 className="text-3xl font-bold mb-4 bg-red-600 w-[200px] text-center rounded-md mx-auto md:text-5xl md:w-[280px] px-2 py-2 text-white">
          Our Menus
        </h1>

        {error && (
          <p className="bg-red-600 text-white w-[250px] p-2 rounded mb-4 text-center mx-auto">
            {error}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menus.map((menu) => (
            // Menu Card
            <div
              key={menu._id}
              className="border-2 p-4 rounded shadow transition hover:border-red-600 hover:shadow-red-600 hover:shadow-2xl"
            >
              <h2 className="text-xl font-semibold text-center md:text-3xl text-white">
                {menu.name}
              </h2>
              <div className="mt-2">
                {menu.imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={menu.name}
                    className="rounded lg:w-full"
                    style={{ zIndex: 10 }}
                  />
                ))}
              </div>
              {isLoggedIn && isAdmin && (
                <div className="flex gap-x-3 mt-4 md:text-3xl lg:text-2xl">
                  <button
                    className="bg-yellow-500 text-white p-1 px-2 rounded-md flex items-center"
                    onClick={() =>
                      (window.location.href = `/EditMenu/${menu._id}`)
                    }
                  >
                    <FaEdit className="mr-2" /> Edit
                  </button>
                  <button
                    className="bg-red-600 text-white p-1 px-2 rounded-md flex items-center"
                    onClick={() => deleteMenu(menu._id)}
                  >
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        {message && (
          <p className="bg-red-600 text-white w-[250px] mt-4 mb-4 text-center mx-auto">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Menu;
