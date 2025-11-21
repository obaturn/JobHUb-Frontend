
import React from 'react';

const CtaSection: React.FC = () => {
  return (
    <section className="bg-neutral-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-12 md:p-16 my-16 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Join thousands of companies and professionals who are building their future on JobHub.
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <a
              href="#"
              className="px-8 py-3 bg-white text-primary font-semibold rounded-md shadow-lg hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300"
            >
              For Employers
            </a>
            <a
              href="#"
              className="px-8 py-3 bg-accent text-white font-semibold rounded-md shadow-lg hover:bg-green-600 transform hover:-translate-y-1 transition-all duration-300"
            >
              For Job Seekers
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
