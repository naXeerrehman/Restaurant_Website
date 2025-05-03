import React, { useState } from "react";

const ReservationWebsiteIcon = () => {
  const [icons, setIcons] = useState([]);
  const [newIcon, setNewIcon] = useState({
    image: null, // For image file
    link: "", // For link
  });
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleAddIcon = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("link", newIcon.link);
      formData.append("image", newIcon.image);

      const response = await fetch(
        `${BACKEND_URL}/api/reservationWebsiteIcon`,
        {
          method: "POST",
          body: formData,
        }
      );
      const createdIcon = await response.json();
      setIcons([...icons, createdIcon]);
      setNewIcon({ image: null, link: "" }); // Clear form
    } catch (error) {
      console.error("Failed to add icon", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Use only the first file
    setNewIcon({ ...newIcon, image: file });
  };

  const handleRemoveImage = () => {
    setNewIcon({ ...newIcon, image: null });
  };

  return (
    <div className="p-3 mx-auto border-2 border-2-white mt-[16px] text-white rounded-md md:text-2xl lg:text-xl">
      <h2 className="text-xl font-semibold mb-4 md:text-3xl">
        Manage Reservation Website Icon
      </h2>

      <div className="mb-4">
        <div className="flex flex-col mb-2">
          <label htmlFor="icon-link" className="font-medium mb-1">
            Icon Link:
          </label>
          <input
            id="icon-link"
            type="text"
            placeholder="Enter icon link"
            value={newIcon.link}
            onChange={(e) => setNewIcon({ ...newIcon, link: e.target.value })}
            className="border-2 border-2-white p-2 rounded-md text-black"
          />
        </div>

        <div>
          <label className="block text-sm md:text-2xl font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            required
            className="border-2 border-white px-4 py-2 rounded-md w-full"
            onChange={handleFileChange}
          />
        </div>

        {newIcon.image && (
          <div className="mt-4">
            <h2 className="text-base md:text-2xl">Selected Image:</h2>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="relative">
                <img
                  src={URL.createObjectURL(newIcon.image)}
                  alt="preview"
                  className="w-[100px] h-[80px] md:h-[150px] md:w-[150px] lg:h-[150px] rounded-md"
                  onLoad={() => URL.revokeObjectURL(newIcon.image)}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleAddIcon}
          disabled={loading}
          className={`bg-red-600 text-white px-4 py-2 mt-2 rounded-md ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Uploading..." : "Add Icon"}
        </button>
      </div>
    </div>
  );
};

export default ReservationWebsiteIcon;
