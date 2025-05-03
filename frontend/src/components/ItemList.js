import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import FilterDropdown from "./FilterDropdown";
import { GiChickenOven } from "react-icons/gi";
import { jwtDecode } from "jwt-decode";
import FastFood6 from "../assets/FastFood6.jpg";
import "../App.css";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ type: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories] = useState(() => {
    const savedCategories = localStorage.getItem("categories");
    return savedCategories ? JSON.parse(savedCategories) : [];
  });
  const itemsPerPage = 6;

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const itemResponse = await axios.get(`${BACKEND_URL}/api/items`);
      setItems(itemResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/items/${itemId}`);
      setDeleteSuccess("Item deleted successfully!");
      setTimeout(() => {
        setDeleteSuccess("");
      }, 3000);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const filteredItems = items.filter((item) => {
    const itemName = item.name || "";
    return (
      itemName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.type === "" ||
        itemName.toLowerCase() === filters.type.toLowerCase())
    );
  });

  const handleFilterChange = (selectedValue) => {
    setFilters({ type: selectedValue || "" });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      {/* Content Container */}
      <div className="relative pb-4 md:pt-8 lg:pt-3">
        {/* Search, Filter and Menu*/}
        <div className="flex flex-col lg:flex-row lg:gap-x-3 lg:ml-[130px] items-center mb-1 md:mb-5 pt-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search For Foods..."
            className="w-[220px] md:w-[350px] border px-2 py-2 rounded-md md:text-2xl hover:shadow-2xl hover:shadow-white lg:text-xl mt-2 mb-1"
          />
          <FilterDropdown
            storageKey="filterManager_categories"
            categories={categories}
            placeholder="Filter"
            onFilterChange={handleFilterChange}
          />
          <Link
            to="/Menu"
            className="bg-green-500 w-[220px] md:w-[350px] lg:w-[240px] rounded-md text-white py-2 px-2 relative md:py-2.5 lg:py-2 md:text-xl md:mt-[10px] text-center hover:shadow-2xl hover:shadow-white lg:mb-1.5"
          >
            Click To View All Menus
          </Link>
        </div>
        {deleteSuccess && (
          <div className="bg-green-500 w-[230px] mx-auto text-white text-center text-lg p-2 rounded-md mb-4">
            {deleteSuccess}Item deleted successfully
          </div>
        )}
        {isLoading ? (
          <div className="flex justify-center items-center mt-10">
            <div className="text-white">
              <GiChickenOven className="animate-zoomInOut text-5xl ml-2 md:ml-[60px] md:text-7xl" />
              <p className="font-bold mt-2 md:text-3xl">Loading Items...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Food Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:px-32 px-[20%] md:px-4 mx-auto gap-y-2 md:gap-3">
              {currentItems.map((item) => (
                <div
                  key={item._id}
                  className="border-2 hover:border-red-600 hover:shadow-red-600 hover:shadow-2xl p-2 rounded-md shadow-md transition-shadow"
                >
                  <img
                    src={
                      item.imageUrls && item.imageUrls[0]
                        ? item.imageUrls[0]
                        : "placeholder-image-url"
                    }
                    alt={`${item.name} - ${item.price}`}
                    className="w-full h-[100px] lg:h-[150px] md:h-[200px] rounded-md mb-2 px-2"
                  />
                  <div className="text-white flex justify-between md:text-2xl">
                    <p className="text-md font-semibold">{item.name}</p>
                    <p className="text-md font-bold">Price: £{item.price}</p>
                  </div>
                  {isLoggedIn && isAdmin && (
                    <div className="mt-1 space-x-2">
                      <Link
                        to={`/EditItemPage/${item._id}`}
                        className="bg-yellow-500 text-white px-4 py-1 rounded-md"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="bg-red-600 text-white px-4 py-1 rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-red-600 text-white rounded-md mx-2 disabled:opacity-50"
              >
                Previous
              </button>

              {[...Array(totalPages).keys()].map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber + 1)}
                  className={`px-4 py-2 mx-1 rounded-md ${
                    currentPage === pageNumber + 1
                      ? "bg-white text-black border"
                      : "bg-gray-300"
                  }`}
                >
                  {pageNumber + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-red-600 text-white rounded-md mx-2 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ItemList;
