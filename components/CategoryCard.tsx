import React from 'react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <a href="#" className="group block text-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl hover:border-primary transform hover:-translate-y-2 transition-all duration-300">
      <div className="flex items-center justify-center h-16 w-16 mx-auto bg-blue-100 rounded-full mb-4 group-hover:bg-primary transition-colors duration-300">
        {React.cloneElement(category.icon, {
          className: "w-8 h-8 text-primary group-hover:text-white transition-colors duration-300"
        })}
      </div>
      <h3 className="text-lg font-semibold text-neutral-dark">{category.name}</h3>
    </a>
  );
};

export default CategoryCard;