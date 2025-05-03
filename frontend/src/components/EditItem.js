import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { GiChickenOven } from "react-icons/gi"; // Make sure the icon is imported correctly
import FastFood6 from "../assets/FastFood6.jpg";
const EditItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    images: [],
  });
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (!itemId) {
      setError("Item ID is missing");
      setLoading(false);
      return;
    }

    const fetchItem = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/items/${itemId}`);
        setItem(response.data);
        setFormData({
          name: response.data.name,
          price: response.data.price,
          images: [], // Reset file uploads
        });
        setExistingImages(response.data.imageUrls || []);
        setLoading(false);
      } catch (err) {
        setError("Error fetching item details");
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, images: [...e.target.files] });
  };

  const handleRemoveNewImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true); // Set submitting to true

    if (!itemId) {
      setError("Item ID is missing");
      setIsSubmitting(false); // Reset submitting state
      return;
    }

    try {
      const form = new FormData();
      for (const key in formData) {
        if (key === "images") {
          formData.images.forEach((file) => form.append("images", file));
        } else {
          form.append(key, formData[key]);
        }
      }

      if (formData.images.length === 0) {
        existingImages.forEach((image) => form.append("images", image));
      }

      form.append("existingImages", JSON.stringify(existingImages));

      const response = await axios.put(
        `${BACKEND_URL}/api/items/${itemId}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccess(response.data.message);
      setItem(response.data.item);
      setTimeout(() => {
        navigate("/Shop");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating item");
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div>
      {/* Background Image */}
      <div className="absolute w-full">
        <img
          src={FastFood6}
          alt="FastFood_image"
          className="w-full h-screen lg:h-fit"
        />
      </div>
      {/* Content */}
      <div className="relative p-4 pt-12 md:pt-44 lg:pt-12">
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
            className="flex flex-col items-center w-full max-w-md mx-auto md:text-2xl"
            onSubmit={handleSubmit}
          >
            <h1 className="bg-red-600 text-white w-full text-2xl rounded-md p-2 font-semibold text-center md:text-2xl">
              Edit Food
            </h1>
            {error && <p className="text-red-500">{error}</p>}

            <div className="flex flex-col gap-y-4 w-full">
              <div>
                <label className="text-white">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-700 px-2 rounded-md w-full py-1"
                  required
                />
              </div>
              <div>
                <label className="text-white">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="border border-gray-700 px-2 rounded-md w-full py-1"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-white">Upload New Images</label>
                <input
                  type="file"
                  name="images"
                  multiple
                  onChange={handleImageChange}
                  className="border-2 border-white p-1 text-white rounded-md"
                />
              </div>

              {existingImages.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-xl text-white md:text-2xl">
                    Existing Image:
                  </h2>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`existing-image-${index}`}
                          className="w-[100px] h-[80px] md:h-[150px] md:w-[150px] lg:h-[120px] rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.images.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-xl text-white md:text-2xl">
                    New Updated Image:
                  </h2>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`new-image-${index}`}
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

              {success && (
                <div className="mb-4 p-2 rounded-md text-center bg-red-600 text-white">
                  {success}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className={`bg-red-600 text-white w-full text-2xl rounded-md p-2 font-semibold text-center md:text-3xl mt-2 ${
                  isSubmitting || loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Updating..." : "Click To Save Change(s)"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditItem;
