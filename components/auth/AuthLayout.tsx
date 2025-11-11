
import React, { ReactNode } from 'react';
import { BriefcaseIcon } from '../../constants';

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
  onNavigate: (page: 'landing' | 'login' | 'signup' | 'forgot_password') => void;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Close button */}
      <button
        onClick={() => onNavigate('landing')}
        className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white transition-all duration-200"
        aria-label="Close login"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
            <button
              onClick={() => onNavigate('landing')}
              className="group flex items-center space-x-3 text-primary hover:text-primary-dark transition-colors duration-300"
            >
                <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300">
                  <BriefcaseIcon className="w-7 h-7" />
                </div>
                <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  JobHub
                </span>
            </button>
        </div>
        <h2 className="mt-8 text-center text-3xl font-extrabold text-neutral-dark">
          {title}
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Join thousands of professionals building their careers
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-100">
          {children}
        </div>

        {/* Trust indicators */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">Trusted by professionals worldwide</p>
          <div className="flex justify-center items-center gap-6 opacity-60">
            <div className="text-gray-400 font-medium text-sm">Google</div>
            <div className="text-gray-400 font-medium text-sm">Microsoft</div>
            <div className="text-gray-400 font-medium text-sm">Meta</div>
            <div className="text-gray-400 font-medium text-sm">Amazon</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;