
import React from 'react';
import { GlobeAltIcon } from './icons/GlobeAltIcon';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { UsersIcon } from './icons/UsersIcon';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center transform hover:-translate-y-2 transition-transform duration-300">
    <div className="inline-block bg-blue-100 text-primary p-4 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-neutral-dark mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: <GlobeAltIcon className="w-8 h-8" />,
      title: 'Vast Job Market',
      description: 'Access millions of job listings from top companies around the world, all in one place.',
    },
    {
      icon: <UsersIcon className="w-8 h-8" />,
      title: 'AI-Powered Matching',
      description: 'Our smart algorithm connects you with opportunities that perfectly match your skills and experience.',
    },
    {
      icon: <AcademicCapIcon className="w-8 h-8" />,
      title: 'Career Resources',
      description: 'Utilize our free resume builder, salary guides, and career advice to advance your professional journey.',
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark">Why Choose JobHub?</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We provide the tools and connections you need to build a successful career.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
