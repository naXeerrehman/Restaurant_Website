import React, { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { jwtDecode } from "jwt-decode";

const DisplaySocialMediaIcons = () => {
  const [icons, setIcons] = useState([]);
  const [editingIconId, setEditingIconId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDetails, setEditingDetails] = useState({
    link: "",
    image: null,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchSocialIcons();
    checkAdminStatus();
  }, []);

  const fetchSocialIcons = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/socialIcons`);
      const data = await response.json();
      setIcons(data);
    } catch (error) {
      console.error("Failed to fetch socialIcons", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAdminStatus = () => {
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
  };

  const handleInputChange = (e) => {
    setEditingDetails({ ...editingDetails, [e.target.name]: e.target.value });
  };

  const handleEditSocialIcon = async (id) => {
    try {
      const formData = new FormData();
      formData.append("link", editingDetails.link);
      formData.append("image", editingDetails.image);

      const response = await fetch(`${BACKEND_URL}/api/socialIcons/${id}`, {
        method: "PUT",
        body: formData,
      });
      const updatedSocialIcon = await response.json();
      setIcons((prevSocialIcons) =>
        prevSocialIcons.map((icon) =>
          icon._id === updatedSocialIcon._id ? updatedSocialIcon : icon
        )
      );
      setEditingIconId(null);
    } catch (error) {
      console.error("Failed to edit socialIcon", error);
    }
  };

  const handleDeleteSocialIcon = async (id) => {
    try {
      await fetch(`${BACKEND_URL}/api/socialIcons/${id}`, {
        method: "DELETE",
      });
      setIcons((prevSocialIcons) =>
        prevSocialIcons.filter((icon) => icon._id !== id)
      );
    } catch (error) {
      console.error("Failed to delete socialIcon", error);
    }
  };

  return (
    <div className="w-[80%] h-[150px] md:h-[210px] lg:h-[180px] pt-[40px] mx-auto z-[10] md:pt-[100px] lg:pt-[90px]">
      <div className="flex justify-center items-center space-x-1">
        {icons.map((socialIcon) => (
          <div key={socialIcon._id}>
            {/* Editing inputs */}
            {editingIconId === socialIcon._id ? (
              <div className="relative w-full flex flex-col -mt-14 ml-14">
                <input
                  type="text"
                  name="link"
                  value={editingDetails.link}
                  onChange={handleInputChange}
                  placeholder="Enter link"
                  className="border p-2 w-[100%] mb-1"
                />
                <input
                  type="file"
                  name="image"
                  onChange={(e) =>
                    setEditingDetails({
                      ...editingDetails,
                      image: e.target.files[0],
                    })
                  }
                  className="border p-2 w-[100%] mb-2"
                />
                <div className="flex">
                  <button
                    onClick={() => handleEditSocialIcon(socialIcon._id)}
                    className="bg-green-500 text-white px-2 py-1 rounded-md mr-2 mb-1 w-[70px] md:ml-[10px] relative"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingIconId(null)}
                    className="bg-red-600 text-white px-2 py-1 rounded-md mr-2 mb-1 w-[70px] md:ml-[10px] relative"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative top-[10px]">
                <a
                  href={socialIcon.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={socialIcon.image}
                    alt={socialIcon.link}
                    className="w-[7vw] h-[7vw] max-w-[60px] md:h-[60px] md:w-[60px] lg:w-[40px] lg:h-[40px] rounded-full transition-transform duration-300 hover:-translate-y-[30%] ml-2.5 md:ml-1 lg:ml-[10px]"
                  />
                </a>
                {isLoggedIn && isAdmin && (
                  <div className="py-1 w-full flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditingIconId(socialIcon._id);
                        setEditingDetails({
                          link: socialIcon.link,
                          image: null,
                        });
                      }}
                      className="bg-yellow-500 border text-white rounded-md md:text-2xl w-[20px] h-[20px] md:w-[30px] md:h-[30px] lg:w-[24px] lg:h-[24px]"
                    >
                      <FaRegEdit className="ml-[2px] md:-mt-[2px]" />
                    </button>
                    <button
                      onClick={() => handleDeleteSocialIcon(socialIcon._id)}
                      className="bg-red-600 border text-white rounded-md md:text-2xl w-[20px] h-[20px] md:w-[30px] md:h-[30px] lg:w-[24px] lg:h-[24px]"
                    >
                      <MdDelete className="mx-auto" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplaySocialMediaIcons;
