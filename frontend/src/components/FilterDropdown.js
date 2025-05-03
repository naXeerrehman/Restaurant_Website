import { useState, useEffect } from "react";

const FilterDropdown = ({ storageKey, placeholder, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem(storageKey));
    if (storedCategories) {
      setCategories(storedCategories);
    }
  }, [storageKey]);

  const handleOptionClick = (value) => {
    setSelectedValue(value);
    onFilterChange(value);
    setIsOpen(false);
  };

  return (
    <div
      className="relative inline-block text-center md:mt-2 w-[220px] md:w-[350px] mb-1"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Dropdown button */}
      <button
        className="border px-2 py-1.5 md:py-2 lg:py-1.5 text-2xl rounded-md bg-red-600 text-white w-full text-center hover:shadow-2xl hover:shadow-white transition-all duration-300"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {selectedValue === null ? placeholder : selectedValue}
      </button>

      {/* Dropdown menu */}
      <div
        className={`absolute left-0 w-full bg-white border rounded-md shadow-lg z-10 transition-all duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <ul className="py-1 text-2xl">
          {/* Reset option */}
          <li
            onClick={() => handleOptionClick(null)}
            className="px-4 py-2 hover:bg-red-600 hover:text-white cursor-pointer transition-colors duration-200"
          >
            All
          </li>
          {/* Category options */}
          {categories.map((category, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(category.label)}
              className="px-4 py-2 hover:bg-red-600 hover:text-white cursor-pointer transition-colors duration-200"
            >
              {category.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FilterDropdown;
