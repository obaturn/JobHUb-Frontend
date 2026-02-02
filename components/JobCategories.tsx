
import React from 'react';
import { motion } from 'framer-motion';
import { JOB_CATEGORIES } from '../constants';
import CategoryCard from './CategoryCard';
import { SECTION_SPACING, CONTAINER_SPACING, GRID_SPACING } from '../src/design-system/tokens/spacing';
import { FADE_IN_UP, STAGGER_CONTAINER, VIEWPORT_ONCE } from '../src/design-system/tokens/animations';

const JobCategories: React.FC = () => {
  return (
    <section className={`bg-neutral-light ${SECTION_SPACING.large}`}>
      <div className={`container mx-auto ${CONTAINER_SPACING.default}`}>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          variants={FADE_IN_UP}
          className="text-center mb-12"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-neutral-dark"
          >
            Browse by Category
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Find the perfect job in the field that interests you most.
          </motion.p>
        </motion.div>
        
        <motion.div 
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 ${GRID_SPACING.normal}`}
        >
          {JOB_CATEGORIES.map((category, index) => (
            <motion.div
              key={category.name}
              variants={FADE_IN_UP}
              whileHover={{ y: -5, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default JobCategories;
