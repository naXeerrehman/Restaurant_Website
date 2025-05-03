import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-red-600 w-full h-[60px] flex items-center text-center justify-center text-white relative bottom-0 md:text-2xl">
      <p>
        Copyright &copy; {currentYear} Hinckley Beanery. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
