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
    <div className="w-full px-1 py-3">
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            selectedCategoryId === null
              ? 'bg-ink-900 text-white shadow-soft'
              : 'bg-white text-ink-600 border border-ink-200 hover:border-brand-300'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
            className={`shrink-0 flex items-center gap-2 rounded-full pl-1.5 pr-4 py-1.5 text-sm font-semibold transition-colors ${
              selectedCategoryId === category._id
                ? 'bg-brand-600 text-white shadow-soft'
                : 'bg-white text-ink-600 border border-ink-200 hover:border-brand-300'
            }`}
          >
            <img
              src={category.icon}
              alt={category.name}
              className="w-7 h-7 object-cover rounded-full bg-white"
            />
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
