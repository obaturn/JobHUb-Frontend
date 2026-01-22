
import React from 'react';
import { JOB_CATEGORIES } from '../constants';
import CategoryCard from './CategoryCard';

const JobCategories: React.FC = () => {
  return (
    <section className="bg-neutral-light py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark">Browse by Category</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect job in the field that interests you most.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {JOB_CATEGORIES.map((category) => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobCategories;
