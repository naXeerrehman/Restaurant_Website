import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { GiChickenOven } from "react-icons/gi";
import FastFood6 from "../assets/FastFood6.jpg";

const EditMenu = () => {
  const [menu, setMenu] = useState({ name: "", price: "", imageUrls: [] });
  const [newImages, setNewImages] = useState([]); // For new image uploads
  const [newImagePreviews, setNewImagePreviews] = useState([]); // For previewing new images
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  
   const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const { id: menuId } = useParams(); // Get menu ID from route parameters
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/menus/${menuId}`);
        setMenu(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch menu details");
        setLoading(false);
      }
    };

    fetchMenu();
  }, [menuId]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);

    // Generate image previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true); // Start submission state

    const formData = new FormData();
    formData.append("name", menu.name);
    formData.append("price", menu.price);

    // Append new images
    for (let i = 0; i < newImages.length; i++) {
      formData.append("images", newImages[i]);
    }

    try {
      await axios.put(`${BACKEND_URL}/api/menus/${menuId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Menu updated successfully");
      setTimeout(() => navigate("/Menu"), 2000);
    } catch (err) {
      setError("Failed to update menu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveNewImage = (index) => {
    // Remove from newImages array
    const updatedImages = [...newImages];
    updatedImages.splice(index, 1);
    setNewImages(updatedImages);

    // Remove from previews array
    const updatedPreviews = [...newImagePreviews];
    URL.revokeObjectURL(updatedPreviews[index]); // Clean up memory
    updatedPreviews.splice(index, 1);
    setNewImagePreviews(updatedPreviews);
  };

  return (
    <div>
      {/* Background Image */}
      <div className="fixed w-full">
        <img src={FastFood6} alt="FastFood_image" className="w-full h-screen" />
      </div>

      {/* Content */}
      <div className="relative p-5 pt-20 md:pt-38 lg:pt-8">
        {loading ? (
          <div className="flex flex-col justify-center items-center mt-5 text-white">
            <GiChickenOven className="animate-zoomInOut text-5xl md:text-6xl" />
            <div className="font-bold ml-2 mt-2 md:text-3xl">Loading...</div>
          </div>
        ) : error ? (
          <p className="w-[300px] text-white bg-red-600 py-2 rounded-md text-center mx-auto">
            {error}
          </p>
        ) : (
          <form
            className="flex flex-col items-center w-full max-w-md mx-auto md:text-2xl space-y-8"
            onSubmit={handleSubmit}
          >
            <h1 className="bg-red-600 text-white w-full text-2xl rounded-md p-2 font-semibold text-center md:text-3xl">
              Edit Menu
            </h1>

            <div className="flex flex-col gap-y-4 w-full">
              <div>
                <label className="text-white text-2xl md:text-3xl">
                  Menu Name
                </label>
                <input
                  type="text"
                  value={menu.name}
                  onChange={(e) => setMenu({ ...menu, name: e.target.value })}
                  className="border border-gray-700 px-2 rounded-md w-full py-1 text-2xl md:text-3xl"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-white text-2xl md:text-3xl">
                  Upload Image
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="border-2 border-white p-1 text-white text-2xl md:text-3xl rounded-md"
                />
              </div>

              {/* Existing Images */}
              {menu.imageUrls.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-2xl text-white md:text-3xl ">
                    Existing Image:
                  </h2>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {menu.imageUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`existing-menu-${index}`}
                          className="w-[100px] h-[80px] md:h-[150px] md:w-[150px] lg:h-[120px] rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Image Previews */}
              {newImagePreviews.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-2xl text-white md:text-3xl">
                    New Updated Image:
                  </h2>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {newImagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`new-menu-${index}`}
                          className="w-[100px] h-[80px] md:h-[150px] md:w-[150px] lg:h-[120px] rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-[18px] flex items-center justify-center"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {error && (
              <p className="text-red-600 border-2 border-white mt-2 text-2xl p-2 w-full text-center md:text-3xl">
                {error}
              </p>
            )}
            {success && (
              <p className="text-white border-2 border-white mt-2 text-2xl p-1 w-full text-center md:text-3xl">
                {success}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className={`bg-red-600 text-white w-full text-2xl rounded-md p-2 font-semibold text-center md:text-3xl mt-2 ${
                isSubmitting || loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "updating..." : "Click To Save Change(s)"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditMenu;
