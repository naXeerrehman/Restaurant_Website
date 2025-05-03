import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const UploadItem = () => {
  const [name, setName] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    if (images) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/api/menus/create-menu`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Menu created:", response.data);
      setMessage("Menu created successfully!");

      setTimeout(() => {
        navigate("/Menu");
      }, 2000);

      setLoading(false);
    } catch (error) {
      console.error(
        "Error creating item:",
        error.response?.data || error.message
      );
      setMessage("Error creating item. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="ml-[5px]">
      <form
        className="flex flex-col items-center w-full max-w-lg mx-auto shadow-lg p-6 rounded-md lg:-mt-[10px] md:-mt-[20px] md:text-xl"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-y-4 mt-4 text-white">
          <h1 className="bg-red-600 text-xl md:text-2xl rounded-md p-3 font-semibold text-center lg:text-md">
            Upload Menu
          </h1>
          <div>
            <label className="block text-sm md:text-2xl font-medium">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter Food Name Here"
              value={name}
              className="border-2 px-4 py-1 rounded-md w-full text-black"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm md:text-2xl font-medium">
              Image
            </label>
            <input
              type="file"
              multiple
              required
              className="border-2 border-white px-4 py-2 rounded-md w-full"
              onChange={handleFileChange}
            />
          </div>

          {images.length > 0 && (
            <div className="mt-4">
              <h2 className="text-base md:text-2xl font-medium">
                Selected Image:
              </h2>
              <div className="flex flex-wrap gap-4 mt-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`image-${index}`}
                      className="w-[100px] h-[80px] md:h-[150px] md:w-[150px] lg:h-[150px] rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {message && (
            <div
              className={`w-full py-2 px-2 text-lg text-center text-white bg-red-600`}
            >
              {message}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`bg-red-600 text-white w-full rounded-md text-lg p-3 font-semibold md:text-2xl ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Uploading..." : "Click To Upload Menu"}
          </button>
          <Link
            className="bg-red-500 text-white w-full rounded-md text-lg p-3 font-semibold md:text-2xl text-center"
            to="https://convertio.co/"
          >
            Click To Convert Image/File Format
          </Link>
        </div>
      </form>
    </div>
  );
};

export default UploadItem;
