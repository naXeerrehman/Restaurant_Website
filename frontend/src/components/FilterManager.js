import { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const FilterManager = ({ onFilterApply }) => {
  const STORAGE_KEY = "filterManager_categories"; // Unique key for localStorage
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState(null);
  const [editedLabel, setEditedLabel] = useState("");
  const [categories, setCategories] = useState([]);

  const capitalizeFirstLetter = (str) => {
    const words = str.split(" ");
    if (words.length > 1) {
      // Capitalize the last word
      words[words.length - 1] =
        words[words.length - 1].charAt(0).toUpperCase() +
        words[words.length - 1].slice(1).toLowerCase();
    } else {
      // Capitalize the first word if there's only one
      words[0] =
        words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
    }
    return words.join(" ");
  };

  // Load categories from localStorage
  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (storedCategories) {
      setCategories(storedCategories);
    }
  }, []);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  // Add a new category
  const handleAdd = () => {
    if (newCategory.trim()) {
      const category = {
        value: newCategory.toLowerCase(),
        label: capitalizeFirstLetter(newCategory),
      };
      setCategories((prevCategories) => [...prevCategories, category]);
      setNewCategory(""); // Clear the input after adding
    }
  };

  const handleSaveEdit = () => {
    setCategories((prevCategories) => {
      return prevCategories.map((cat) =>
        cat.value === editCategory.value
          ? {
              ...cat,
              label: capitalizeFirstLetter(editedLabel),
              value: editedLabel.toLowerCase(),
            }
          : cat
      );
    });
    setEditCategory(null);
    setEditedLabel("");
  };

  // Start editing a category
  const handleEditCategory = (category) => {
    setEditCategory(category);
    setEditedLabel(category.label);
  };

  // Delete a category
  const handleDelete = (categoryToDelete) => {
    setCategories((prevCategories) =>
      prevCategories.filter((category) => category.value !== categoryToDelete)
    );
  };

  return (
    <div className="p-4 border-2 border-white rounded-md mx-auto mt-10 relative">
      <h2 className="text-lg font-semibold mb-4 text-white md:text-3xl lg:text-md">
        Manage Filters
      </h2>

      {/* Add Category */}
      <div className="mb-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Add new category"
          className="border-2 rounded-md px-2 py-1 w-full mb-2 md:text-2xl"
        />
        <button
          onClick={handleAdd}
          className="bg-red-600 text-white rounded-md px-4 py-2 w-full md:text-2xl"
        >
          Add Category
        </button>
      </div>

      {/* List and Edit/Delete Categories */}
      <div>
        {categories.map((category) => (
          <div
            key={category.value}
            className="flex justify-between items-center"
          >
            {editCategory?.value === category.value ? (
              <>
                <input
                  type="text"
                  value={editedLabel}
                  onChange={(e) => setEditedLabel(e.target.value)}
                  className="border-2 rounded-md px-8 py-1"
                />
                <button
                  onClick={handleSaveEdit}
                  className="bg-blue-500 text-white rounded-md px-2 ml-2"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <span className="text-white md:text-3xl lg:text-md">
                  {category.label}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="text-yellow-500 text-2xl md:text-5xl lg:text-3xl"
                  >
                    <FaRegEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(category.value)}
                    className="text-red-600 md:text-5xl lg:text-3xl text-2xl"
                  >
                    <MdDelete />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterManager;
