import React, { useState } from 'react';

const Categories = ({ categories, onCategoryClick }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  if (!categories || categories.length === 0) {
    return <div className="text-red-500">No categories available</div>;
  }

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
    onCategoryClick(categoryId);
  };

  return (
    <div className="w-full px-4 pt-1 md:pt-4 flex justify-center">
      {/* <h1 className="text-2xl font-bold mb-4">Categories</h1> */}
      <div className="flex overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`text-center w-28 rounded-lg p-2 hover:bg-gray-400 ${selectedCategoryId === null ? 'bg-black text-white' : 'bg-gray-300'}`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
            className={`flex-shrink-0 text-center w-fit flex items-center rounded-lg p-1 hover:bg-gray-400 ${selectedCategoryId === category._id ? 'bg-black text-white' : 'bg-gray-300'}`}
          >
            <img
              src={category.icon}
              alt={category.name}
              className="w-10 h-10 md:w-10 md:h-10 object-cover rounded-lg mx-auto"
            />
            <p className=" text-lg font-medium ml-2 ">{category.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
