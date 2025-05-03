import React, { useState, useEffect } from "react";
import FastFood6 from "../assets/FastFood6.jpg";
import { GiChickenOven } from "react-icons/gi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [icons, setIcons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [clientMessage, setClientMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchSocialIcons();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const contactData = {
      name,
      email,
      clientMessage,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/api/contacts/create-message`,
        contactData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Item created:", response.data);
      setMessage("Message Sent successfully!");

      setTimeout(() => {
        navigate("/");
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
    <div>
      {/* Background Image */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <img
          src={FastFood6}
          alt="FastFood background"
          className="w-full h-full"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row justify-center items-center min-h-screen pt-16 pb-10 px-4">
        {/* Icons Section */}
        <div className="w-full lg:w-1/2 flex flex-col items-center mb-10 lg:mb-0">
          <div className="text-center text-white space-y-4 max-w-lg">
            <h1 className="text-4xl md:text-7xl font-bold">Contact Us</h1>
            <p
              className="text-lg md:text-3xl text-white"
              style={{
                textShadow:
                  "2px 2px 0 black, -2px 2px 0 black, 2px -2px 0 black, -2px -2px 0 white",
              }}
            >
              Get In Touch With Us By
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center">
                <GiChickenOven className="animate-zoomInOut text-5xl text-white" />
                <div className="font-bold text-white mt-2 text-2xl">
                  Loading...
                </div>
              </div>
            ) : (
              icons.map((icon) => (
                <div key={icon._id} className="flex justify-center">
                  <a href={icon.link} target="_blank" rel="noopener noreferrer">
                    <img
                      src={icon.image}
                      alt={icon.link}
                      className="w-12 h-12 md:w-20 md:h-20 object-contain rounded-full hover:scale-110 transition-transform"
                    />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2 max-w-xl px-4">
          <form className="w-full p-4 rounded-lg" onSubmit={handleSubmit}>
            <h1 className="font-bold bg-red-600 text-white mb-4 rounded-md text-center py-2 text-2xl">
              Send Message
            </h1>
            <div className="mb-4">
              <label className="block text-white mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter Your Name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter Your Email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Message</label>
              <textarea
                value={clientMessage}
                onChange={(e) => setClientMessage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Write Your Message"
                required
              ></textarea>
            </div>
            {message && (
              <div className={`mb-4 p-2 text-center bg-red-600 text-white`}>
                {message}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors font-bold disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
