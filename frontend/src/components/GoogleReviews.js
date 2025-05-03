import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Slider from "react-slick";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GiChickenOven } from "react-icons/gi";
import Grass from "../assets/Grass.jpg";
import { FaLongArrowAltRight } from "react-icons/fa";
import "../App.css";

const GoogleReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    setIsLoading(true);
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/reviews`);
        console.log("Fetched reviews:", response.data.reviews);
        setReviews(response.data.reviews);
      } catch (err) {
        setError("Failed to fetch reviews. Please try again later.");
        console.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
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
  const sliderSettings = {
    dots: false,
    infinite: true,
    arrows: true, // Enable arrows
    speed: 900,
    slidesToShow: 3, // Default to 3 slides for larger screens
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />, // Pass custom next arrow
    prevArrow: <CustomPrevArrow />, // Pass custom prev arrow
    responsive: [
      {
        breakpoint: 1024, // Laptops
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // Tablets
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640, // Mobile
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const renderStars = (rating) => {
    const maxStars = 5;
    const stars = [];

    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500 inline-block" />
        ) : (
          <FaRegStar key={i} className="text-gray-300 inline-block" />
        )
      );
    }

    return <div className="flex justify-center space-x-1">{stars}</div>;
  };

  const truncateReview = (text, limit) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <div className="relative -mt-[10px] py-20">
      {/* BG Image */}
      <div
        style={{ backgroundImage: `url(${Grass})` }}
        className="absolute inset-0"
      ></div>

      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Text */}
        <div className="flex flex-col px-6 md:flex-row lg:flex-row xl:flex-row mb-4 justify-between mx-auto lg:px-36">
          <h1 className="text-lg font-bold text-white md:text-3xl lg:text-4xl">
            Google Reviews
          </h1>
          <p className="text-lg font-bold text-white md:text-3xl lg:text-4xl">
            Total: {reviews.length}{" "}
            {reviews.length === 1 ? "Review" : "Reviews"}
          </p>
        </div>

        {/* Slider */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center text-white">
            <GiChickenOven className="animate-zoomInOut text-5xl" />
            <div className="font-bold ml-2 mt-2 text-2xl">
              Loading Reviews...
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-screen-lg px-4">
            <Slider {...sliderSettings}>
              {reviews.map((review, index) => (
                <div key={index} className="px-2">
                  <div className="border-2 border-white rounded-lg text-white h-[370px] flex flex-col">
                    {/* Profile Image */}
                    <img
                      src={
                        review.profile_photo_url ||
                        "https://via.placeholder.com/50"
                      }
                      alt={`${review.author_name}'s profile`}
                      className="w-12 h-12 rounded-full object-cover mx-auto mt-4"
                      onError={(e) => {
                        console.error(
                          `Image failed to load for: ${review.author_name}`
                        );
                        e.target.src = "https://via.placeholder.com/50"; // Fallback image
                      }}
                    />

                    {/* Author Name */}
                    <h3 className="font-bold text-xl text-center mt-2">
                      {review.author_name}
                    </h3>

                    {/* Star Rating */}
                    <div className="flex justify-center mt-2">
                      {renderStars(review.rating)}
                    </div>

                    {/* Review Date */}
                    <p className="text-xl text-center mt-2">
                      {new Date(review.time * 1000).toLocaleDateString()}
                    </p>

                    {/* Review Text */}
                    <div className="rounded-md p-4 mt-4 flex-grow">
                      <p className="text-xl">
                        {truncateReview(review.text, 130)}
                      </p>
                    </div>

                    {/* Read Full Review Link */}
                    <a
                      href={`https://maps.app.goo.gl/EqijbQxPHCMvp2RA8`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-white hover:underline mt-auto py-2 md:text-xl"
                    >
                      Read full review{" "}
                      <FaLongArrowAltRight className="inline-block" />
                    </a>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleReviews;
