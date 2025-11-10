
import React, { useState } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import SocialLoginButtons from '../components/auth/SocialLoginButtons';

interface SignupPageProps {
    onNavigate: (page: 'landing' | 'login' | 'signup' | 'forgot_password') => void;
    onLoginSuccess: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigate, onLoginSuccess }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // In real app, this would create account and show onboarding
        // For demo, we'll simulate the flow by going to job seeker dashboard
        // In production, you'd show an onboarding screen first
        onLoginSuccess();
    };

    return (
        <AuthLayout title="Join JobHub today" onNavigate={onNavigate}>
            {/* Welcome Message */}
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
                <p className="text-gray-600">Join millions of professionals building their careers</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                        Full Name
                    </label>
                    <div className="relative">
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                            placeholder="Enter your full name"
                        />
                        <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                </div>


                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                        Email address
                    </label>
                    <div className="relative">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                            placeholder="you@example.com"
                        />
                        <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                placeholder="••••••••"
                            />
                            <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                placeholder="••••••••"
                            />
                            <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>


                <div>
                    <button
                        type="submit"
                        className="group w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                        <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Join JobHub
                    </button>
                </div>
            </form>

            <div className="mt-6">
                 <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                    </div>
                </div>
                <SocialLoginButtons onNavigate={onNavigate} />
            </div>
            
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 mb-4">
                    By joining, you agree to our{' '}
                    <a href="#" className="text-primary hover:text-primary-dark font-medium underline decoration-1 underline-offset-2">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary hover:text-primary-dark font-medium underline decoration-1 underline-offset-2">
                        Privacy Policy
                    </a>
                </p>
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button onClick={() => onNavigate('login')} className="font-medium text-primary hover:text-blue-700">
                        Log in
                    </button>
                </p>
            </div>
        </AuthLayout>
    );
};

export default SignupPage;