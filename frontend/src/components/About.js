import React from "react";
import FastFood6 from "../assets/FastFood6.jpg";

const About = () => {
  return (
    <div>
      {/* Background Image */}
      <div className="absolute w-full">
        <img src={FastFood6} alt="FastFood_image" className="w-full h-screen" />
      </div>

      {/* About us */}
      <div className="relative pt-[120px] md:pt-[180px] lg:pt-12">
        <h1
          className="text-6xl text-white text-center rounded-md  w-fit ml-6 md:text-[100px] md:mb-[40px]"
          style={{
            textShadow:
              "2px 2px 0 black, -2px 2px 0 black, 2px -2px 0 black, -2px -2px 0 white",
          }}
        >
          About us
        </h1>

        <div className="space-y-4 mt-2">
          <div
            className="text-white text-xl rounded-md mb-[2px] px-4 md:text-4xl "
            style={{
              textShadow:
                "1px 1px 0 black, -1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black",
            }}
          >
            <h1>Address: Priestpopple, Hexham, Northumberland, NE46 1PH</h1>
          </div>

          <div
            className="text-white text-xl rounded-md mb-[2px] px-4 md:text-4xl"
            style={{
              textShadow:
                "1px 1px 0 black, -1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black",
            }}
          >
            <h1>Opening Hours: Open:1PM --- Close:11 PM (Daily)</h1>
          </div>

          <div
            className="text-xl text-white rounded-md mb-[2px] px-4 md:text-4xl"
            style={{
              textShadow:
                "1px 1px 0 black, -1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black",
            }}
          >
            <h1>Contact No: 0141 611 2994</h1>
          </div>

          <div
            className="text-xl text-white rounded-md mb-[2px] px-4 md:text-4xl"
            style={{
              textShadow:
                "1px 1px 0 black, -1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black",
            }}
          >
            <h1>Email: clearbusinessbyadrian@gmail.com</h1>
          </div>

          <div
            className="text-xl text-white rounded-md mb-[2px] px-4 md:text-4xl"
            style={{
              textShadow:
                "1px 1px 0 black, -1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black",
            }}
          >
            <h1>Owner: Mr. Adrian Venoion</h1>
          </div>

          <div
            className="text-xl text-white rounded-md mb-[2px] px-4 md:text-4xl"
            style={{
              textShadow:
                "1px 1px 0 black, -1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black",
            }}
          >
            <h1>Trading Since: DECEMBER 2016</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
