import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaHome, FaAddressCard } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { RiLogoutBoxFill } from "react-icons/ri";
import { GiChickenOven } from "react-icons/gi";
import { IoLogIn } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaPhoneVolume } from "react-icons/fa6";
import Hinkley_Beanery from "../assets/Hinckley_Beanery.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);
        setIsAdmin(decodedToken.isAdmin);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsMenuOpen(false);
    }
  };

  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav
      className="sticky top-0 z-50 bg-red-600 text-white w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <NavLink to="/" className="flex items-center">
              <img
                src={Hinkley_Beanery || "/placeholder.svg"}
                alt="Hinkley Beanery"
                className="h-[100px] w-auto"
              />
            </NavLink>
          </div>
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <NavLinks
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
              handleLinkClick={handleLinkClick}
            />
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white "
              aria-controls="mobile-menu"
              aria-expanded="false"
              onMouseEnter={() => setIsMenuOpen(true)}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FaTimes className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FaBars className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${isMenuOpen ? "block" : "hidden"} lg:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <NavLinks
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            handleLinkClick={handleLinkClick}
          />
        </div>
      </div>
    </nav>
  );
};

const NavLinks = ({ isLoggedIn, isAdmin, handleLinkClick }) => {
  const linkClass =
    "hover:font-bold  text-center text-lg md:text-2xl text-white block px-1 py-1 rounded-md font-medium";
  const activeLinkClass =
    "border border-2 w-[150px] mx-auto text-center  text-lg text-white block px-1 py-2 rounded-md font-medium";

  return (
    <>
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}
        onClick={handleLinkClick}
      >
        <FaHome className="inline-block mr-2" />
        Home
      </NavLink>
      {/* {isLoggedIn && isAdmin && ( */}
      <NavLink
        to="/AdminPanel"
        className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}
        onClick={handleLinkClick}
      >
        <MdAdminPanelSettings className="inline-block mr-2" />
        Admin Panel
      </NavLink>
      {/* )} */}
      <NavLink
        to="/Shop"
        className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}
        onClick={handleLinkClick}
      >
        <GiChickenOven className="inline-block mr-2" />
        Menu
      </NavLink>
      <NavLink
        to="/About"
        className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}
        onClick={handleLinkClick}
      >
        <FaAddressCard className="inline-block mr-2" />
        About
      </NavLink>
      <NavLink
        to="/ContactPage"
        className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}
        onClick={handleLinkClick}
      >
        <FaPhoneVolume className="inline-block mr-2" />
        Contact
      </NavLink>
      {isLoggedIn ? (
        <NavLink
          to="/LogOutPage"
          className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}
          onClick={handleLinkClick}
        >
          <RiLogoutBoxFill className="inline-block mr-2" />
          Log out
        </NavLink>
      ) : (
        <NavLink
          to="/LoginPage"
          className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}
          onClick={handleLinkClick}
        >
          <IoLogIn className="inline-block mr-2" />
          Log in
        </NavLink>
      )}
    </>
  );
};

export default Navbar;
