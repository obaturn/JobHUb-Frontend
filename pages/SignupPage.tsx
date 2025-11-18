
import React, { useState } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import SocialLoginButtons from '../components/auth/SocialLoginButtons';
import { Page } from '../types';

interface SignupPageProps {
    onNavigate: (page: Page) => void;
    onLoginSuccess: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigate, onLoginSuccess }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Call onLoginSuccess to trigger onboarding
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
                            className="appearance-none block w-full px-4 py-3 border border-gray-600 bg-gray-800 rounded-xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
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
                            className="appearance-none block w-full px-4 py-3 border border-gray-600 bg-gray-800 rounded-xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
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
                                type={showPassword ? "text" : "password"}
                                required
                                className="appearance-none block w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                ) : (
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
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
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                className="appearance-none block w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? (
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                ) : (
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
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