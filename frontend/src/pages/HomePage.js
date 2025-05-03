import React from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import ItemCarousel from "../components/ItemCarousel";
import GoogleMap from "../components/GoogleMap";
import Footer from "../components/Footer";
import GoogleReviews from "../components/GoogleReviews";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Banner />
      <ItemCarousel />
      <GoogleReviews />
      <GoogleMap />
      <Footer />
    </div>
  );
};

export default Home;
