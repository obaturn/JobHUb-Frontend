
import React from 'react';
import { BriefcaseIcon } from '../constants';

interface FooterProps {
  onNavigate: (page: 'landing' | 'login' | 'signup' | 'forgot_password') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const footerLinks = {
    'For Job Seekers': ['Find Jobs', 'Create Resume', 'Salary Calculator'],
    'For Employers': ['Post a Job', 'Search Resumes', 'Pricing'],
    'Company': ['About Us', 'Contact', 'Blog', 'Careers'],
    'Support': ['Help Center', 'Terms of Service', 'Privacy Policy'],
  };

  return (
    <footer className="bg-neutral-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <button onClick={() => onNavigate('landing')} className="flex items-center space-x-2 text-white">
              <BriefcaseIcon className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">JobHub</span>
            </button>
            <p className="mt-4 text-gray-400">Your next career move starts here.</p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="col-span-1">
              <h3 className="font-semibold tracking-wider uppercase">{title}</h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
           <div className="col-span-2 md:col-span-4 lg:col-span-2 mt-8 lg:mt-0">
             <h3 className="font-semibold tracking-wider uppercase">Stay Updated</h3>
             <p className="mt-4 text-gray-400">Get the latest job alerts and career tips.</p>
             <form className="mt-4 flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="email-newsletter" className="sr-only">Email address</label>
                <input 
                  id="email-newsletter"
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-3 py-2 text-gray-800 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md font-semibold hover:bg-blue-700 transition-colors">
                  Sign Up
                </button>
              </form>
           </div>
        </div>
        <div className="mt-16 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} JobHub, Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {/* Social Icons */}
            <a href="#" className="text-gray-400 hover:text-white"><span className="sr-only">Facebook</span><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg></a>
            <a href="#" className="text-gray-400 hover:text-white"><span className="sr-only">Twitter</span><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></a>
            <a href="#" className="text-gray-400 hover:text-white"><span className="sr-only">LinkedIn</span><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
