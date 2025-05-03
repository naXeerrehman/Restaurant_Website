import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GiChickenOven } from "react-icons/gi";
import Grass from "../assets/Grass.jpg";
import "../App.css";

const ItemCarousel = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/items`);
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Custom arrows
  const CustomPrevArrow = ({ onClick }) => (
    <div
      className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer p-2 rounded-full text-black bg-white hover:bg-red-600"
      onClick={onClick}
    >
      <FaChevronLeft />
    </div>
  );

  const CustomNextArrow = ({ onClick }) => (
    <div
      className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer p-2 rounded-full text-black bg-white hover:bg-red-600"
      onClick={onClick}
    >
      <FaChevronRight />
    </div>
  );

  // Slider settings
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Default to 1 slide for mobile
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 640, // Small screens (mobile)
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // Tablets
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024, // Laptops
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ],
  };

  return (
    <div className="relative -mt-[30px] md:mt-[20px] lg:-mt-[10px] pt-6">
      {/* BG Image */}
      <div
        style={{ backgroundImage: `url(${Grass})` }}
        className="absolute inset-0"
      ></div>

      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Text */}
        <div className="flex items-center text-center mb-4 px-6 justify-between max-w-5xl mx-auto lg:px-8">
          <h1 className="text-2xl font-bold text-white md:text-3xl lg:text-4xl">
            Menu
          </h1>
          <Link
            to="./Menu"
            className="inline-block mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 md:text-lg lg:text-xl"
          >
            View Menu
          </Link>
        </div>

        {/* Slider */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center text-white">
            <GiChickenOven className="animate-zoomInOut text-5xl" />
            <div className="font-bold ml-2 mt-2 text-2xl">Loading...</div>
          </div>
        ) : (
          <div className="mx-auto max-w-screen-lg px-4">
            <Slider {...settings}>
              {items.map((item, index) => (
                <Link to="/Shop" key={index} className="px-2">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <img
                      src={item.imageUrls && item.imageUrls[0]}
                      alt={`${item.name}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold text-gray-600">
                        Price: £{item.price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCarousel;
