import React, { useState, useEffect } from "react";
import FastFood from "../assets/FastFood.jpg";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "react-tooltip/dist/react-tooltip.css";
import { GiChickenOven } from "react-icons/gi";
import { jwtDecode } from "jwt-decode";
import DisplaySocialMediaIcons from "./DisplaySocialMediaIcon";
import { Tooltip } from "react-tooltip";

const Banner = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [icons, setIcons] = useState([]);
  const [editingIconId, setEditingIconId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDetails, setEditingDetails] = useState({
    link: "",
    image: null,
  });

  const [orderingWebsiteIcons, setOrderingWebsiteIcons] = useState([]);
  const [editingOrderingWebsiteIconId, setEditingOrderingWebsiteIconId] =
    useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchIcons();
    fetchOrderingWebsiteIcons();
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

  const fetchIcons = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/reservationWebsiteIcon`);
      const data = await response.json();
      setIcons(data);
    } catch (error) {
      console.error("Failed to fetch icons", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditIcon = async (id, details) => {
    try {
      const formData = new FormData();
      formData.append("link", details.link);
      if (details.image) {
        formData.append("image", details.image);
      }

      const response = await fetch(
        `${BACKEND_URL}/api/reservationWebsiteIcon/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      const updatedIcon = await response.json();
      setIcons((prevIcons) =>
        prevIcons.map((icon) =>
          icon._id === updatedIcon._id ? updatedIcon : icon
        )
      );
      setEditingIconId(null);
    } catch (error) {
      console.error("Failed to edit icon", error);
    }
  };

  const handleDeleteIcon = async (id) => {
    try {
      await fetch(`${BACKEND_URL}/api/reservationWebsiteIcon/${id}`, {
        method: "DELETE",
      });
      setIcons((prevIcons) => prevIcons.filter((icon) => icon._id !== id));
    } catch (error) {
      console.error("Failed to delete icon", error);
    }
  };

  const fetchOrderingWebsiteIcons = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/orderingWebsiteIcon`);
      const data = await response.json();
      setOrderingWebsiteIcons(data);
    } catch (error) {
      console.error("Failed to fetch icons", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditOrderingWebsiteIcon = async (id, details) => {
    try {
      const formData = new FormData();
      formData.append("link", details.link);
      if (details.image) {
        formData.append("image", details.image);
      }

      const response = await fetch(
        `${BACKEND_URL}/api/orderingWebsiteIcon/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      const updatedIcon = await response.json();
      setOrderingWebsiteIcons((prevIcons) =>
        prevIcons.map((icon) =>
          icon._id === updatedIcon._id ? updatedIcon : icon
        )
      );
      setEditingOrderingWebsiteIconId(null);
    } catch (error) {
      console.error("Failed to edit icon", error);
    }
  };

  const handleDeleteOrderingIcon = async (id) => {
    try {
      await fetch(`${BACKEND_URL}/api/orderingWebsiteIcon/${id}`, {
        method: "DELETE",
      });
      setOrderingWebsiteIcons((prevIcons) =>
        prevIcons.filter((icon) => icon._id !== id)
      );
    } catch (error) {
      console.error("Failed to delete icon", error);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Background Image */}
      <img
        src={FastFood}
        className="w-full h-[445px] md:h-[600px] xl:h-[525px] absolute"
        alt="Fastfood_image"
      />

      {/* Content Section */}
      <div className="flex flex-col md:flex-col lg:flex-row justify-center items-center relative mx-auto px-4 mt-[50px] lg:mt-[80px]">
        {/* Text Section */}
        <div className="w-full md:w-full px-4 text-center lg:mt-[50px]">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-semibold text-white leading-tight sm:leading-snug xl:leading-tight"
            style={{
              textShadow:
                "2px 2px 0 black, -2px 2px 0 black, 2px -2px 0 black, -2px -2px 0 white",
            }}
          >
            Welcome To The<br></br> Hinckley Beanery
            <br />
            The Tasty House
          </h1>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col space-y-6 sm:space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12 w-full justify-center items-center mt-8 md:mt-5 lg:mt-12 xl:mt-14">
          {/* Book Now Button Section */}
          <div className
          ="bg-red-600 rounded-md flex justify-center items-center w-[130px] md:w-3/12 md:h-[50px] h-[35px]">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center text-white">
                <GiChickenOven className="animate-zoomInOut text-4xl" />
                <div className="font-bold mt-2 text-lg">Loading...</div>
              </div>
            ) : (
              icons.map((icon) => (
                <div
                  key={icon._id}
                  className="w-full h-full flex flex-col justify-center items-center"
                >
                  {editingIconId === icon._id ? (
                    <div className="ml-[30px]">
                      <input
                        type="text"
                        value={editingDetails.link}
                        onChange={(e) =>
                          setEditingDetails({
                            ...editingDetails,
                            link: e.target.value,
                          })
                        }
                        className="p-1 rounded-md"
                      />
                      <input
                        type="file"
                        onChange={(e) =>
                          setEditingDetails({
                            ...editingDetails,
                            image: e.target.files[0],
                          })
                        }
                        className="p-1 rounded-md"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleEditIcon(icon._id, editingDetails)
                          }
                          className="bg-green-500 text-white px-2 py-1 rounded-md"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingIconId(null)}
                          className="bg-gray-500 text-white px-2 py-1 rounded-md"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      {/* Icon Section */}
                      <a
                        href={icon.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex justify-center items-center mt-3"
                        data-tooltip-id="reserve-tooltip"
                        data-tooltip-content="Click to reserve now"
                      >
                        <img
                          src={icon.image}
                          alt={icon.link}
                          className="h-[80px] w-[100px] md:w-[150px] md:h-[160px] -mt-6 md:-mt-9"
                        />
                      </a>
                    </div>
                  )}
                </div>
              ))
            )}
            {/* Edit and Delete Buttons for Book Now */}
            {isAdmin && isLoggedIn && icons.length > 0 && (
              <div className="flex space-x-2 absolute mt-[170px] md:mt-[240px] lg:mt-[80px]">
                <button
                  onClick={() => {
                    setEditingIconId(icons[0]._id);
                    setEditingDetails({
                      link: icons[0].link,
                      image: null,
                    });
                  }}
                  className="bg-yellow-500 border text-white rounded-md md:text-2xl w-[20px] h-[20px] md:w-[30px] md:h-[30px] lg:w-[24px] lg:h-[24px] px-[3px]"
                >
                  <FaRegEdit />
                </button>
                <button
                  onClick={() => handleDeleteIcon(icons[0]._id)}
                  className="bg-red-600 border text-white rounded-md md:text-2xl w-[20px] h-[20px] md:w-[30px] md:h-[30px] lg:w-[24px] lg:h-[24px] px-[1px]"
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>

          {/* Order Now Button Section */}
          <div className="bg-green-600 rounded-md flex justify-center items-center relative w-[130px] md:w-3/12 md:h-[50px] h-[35px]">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center text-white">
                <GiChickenOven className="animate-zoomInOut text-4xl sm:text-5xl" />
                <div className="font-bold mt-2 ml-2 text-lg sm:text-xl">
                  Loading...
                </div>
              </div>
            ) : (
              orderingWebsiteIcons.map((orderingWebsiteIcon) => (
                <div
                  key={orderingWebsiteIcon._id}
                  className="w-full h-full flex flex-col justify-center items-center"
                >
                  {editingOrderingWebsiteIconId === orderingWebsiteIcon._id ? (
                    <div className="ml-[30px]">
                      <input
                        type="text"
                        value={editingDetails.link}
                        onChange={(e) =>
                          setEditingDetails({
                            ...editingDetails,
                            link: e.target.value,
                          })
                        }
                        className="p-1 rounded-md"
                      />
                      <input
                        type="file"
                        onChange={(e) =>
                          setEditingDetails({
                            ...editingDetails,
                            image: e.target.files[0],
                          })
                        }
                        className="p-1 rounded-md"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleEditOrderingWebsiteIcon(
                              orderingWebsiteIcon._id,
                              editingDetails
                            )
                          }
                          className="bg-green-500 text-white px-2 py-1 rounded-md"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingOrderingWebsiteIconId(null)}
                          className="bg-gray-500 text-white px-2 py-1 rounded-md"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      {/* Icon Section */}
                      <a
                        href={orderingWebsiteIcon.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex justify-center items-center"
                        data-tooltip-id="order-tooltip"
                        data-tooltip-content="Click to order now"
                      >
                        <img
                          src={orderingWebsiteIcon.image}
                          alt={orderingWebsiteIcon.link}
                          className="w-full h-[60px] md:w-[150px] relative top-[14px] md:h-[80px] -mt-[28px] md:-mt-6"
                        />
                      </a>
                    </div>
                  )}
                </div>
              ))
            )}
            {/* Edit and Delete Buttons for Order Now */}
            {isAdmin && isLoggedIn && orderingWebsiteIcons.length > 0 && (
              <div className="flex space-x-2 absolute -mt-16 md:-mt-[90px] lg:mt-[80px]">
                <button
                  onClick={() => {
                    setEditingOrderingWebsiteIconId(
                      orderingWebsiteIcons[0]._id
                    );
                    setEditingDetails({
                      link: orderingWebsiteIcons[0].link,
                      image: null,
                    });
                  }}
                  className="bg-yellow-500 border text-white rounded-md md:text-2xl w-[20px] h-[20px] md:w-[30px] md:h-[30px] lg:w-[24px] lg:h-[24px] px-[3px]"
                >
                  <FaRegEdit />
                </button>
                <button
                  onClick={() =>
                    handleDeleteOrderingIcon(orderingWebsiteIcons[0]._id)
                  }
                  className="bg-red-600 border text-white rounded-md md:text-2xl w-[20px] h-[20px] md:w-[30px] md:h-[30px] lg:w-[24px] lg:h-[24px] px-[1px]"
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <DisplaySocialMediaIcons />
      </div>

      {/* Tooltips */}
      <Tooltip id="reserve-tooltip" className="mt-[35px] md:mt-[70px]" />
      <Tooltip id="order-tooltip" className="mt-[35px] md:mt-[70px]" />
    </div>
  );
};

export default Banner;
