
import React from 'react';
import { UserPlusIcon } from './icons/UserPlusIcon';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';

const Step: React.FC<{ icon: React.ReactNode; number: number; title: string; description: string; }> = ({ icon, number, title, description }) => (
  <div className="relative flex-1 text-center">
    <div className="relative inline-block">
        <div className="flex items-center justify-center w-20 h-20 bg-white border-2 border-primary text-primary rounded-full shadow-lg mx-auto">
        {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-white">
            {number}
        </div>
    </div>
    <div className="mt-4">
      <h3 className="text-lg font-bold text-neutral-dark">{title}</h3>
      <p className="mt-1 text-gray-600 text-sm max-w-xs mx-auto">{description}</p>
    </div>
  </div>
);

const HowItWorks: React.FC = () => {
  const seekerSteps = [
    { icon: <UserPlusIcon className="w-8 h-8" />, title: 'Create Account', description: 'Build your professional profile and upload your resume.' },
    { icon: <MagnifyingGlassIcon className="w-8 h-8" />, title: 'Find Jobs', description: 'Search and filter through millions of job opportunities.' },
    { icon: <PaperAirplaneIcon className="w-8 h-8" />, title: 'Apply', description: 'Easily apply to your dream jobs with just a few clicks.' },
  ];

  const employerSteps = [
    { icon: <UserPlusIcon className="w-8 h-8" />, title: 'Post a Job', description: 'Describe your open role and company to attract candidates.' },
    { icon: <MagnifyingGlassIcon className="w-8 h-8" />, title: 'Find Talent', description: 'Search our database of skilled professionals to find the perfect fit.' },
    { icon: <PaperAirplaneIcon className="w-8 h-8" />, title: 'Hire', description: 'Connect with, interview, and hire top talent for your team.' },
  ];

  return (
    <section className="bg-neutral-light py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Getting started is simple. Follow these easy steps to land your dream job or find the perfect candidate.
          </p>
        </div>
        
        <div className="space-y-16">
          {/* Job Seekers */}
          <div>
            <h3 className="text-2xl font-bold text-center mb-12 text-primary">For Job Seekers</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-y-12 md:gap-8">
              {seekerSteps.map((step, index) => (
                <React.Fragment key={index}>
                    <Step icon={step.icon} number={index + 1} title={step.title} description={step.description} />
                    {index < seekerSteps.length - 1 && <div className="hidden md:block border-t-2 border-dashed border-gray-300 flex-grow mt-[-4rem] mx-[-2rem]"></div>}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Employers */}
          <div className="pt-8">
            <h3 className="text-2xl font-bold text-center mb-12 text-secondary">For Employers</h3>
             <div className="flex flex-col md:flex-row items-center justify-center gap-y-12 md:gap-8">
              {employerSteps.map((step, index) => (
                <React.Fragment key={index}>
                    <Step icon={step.icon} number={index + 1} title={step.title} description={step.description} />
                    {index < employerSteps.length - 1 && <div className="hidden md:block border-t-2 border-dashed border-gray-300 flex-grow mt-[-4rem] mx-[-2rem]"></div>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
