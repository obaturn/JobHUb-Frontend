import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import SocialLoginButtons from '../components/auth/SocialLoginButtons';

interface LoginPageProps {
    onNavigate: (page: 'landing' | 'login' | 'signup' | 'forgot_password') => void;
    onLoginSuccess: () => void;
    onEmployerLogin: () => void;
    onAdminLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess, onEmployerLogin, onAdminLogin }) => {
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Mock successful login - in real app, this would check credentials
        // For demo: alex.doe@example.com logs in as job seeker
        // jane.smith@innovate.com logs in as employer
        // admin@jobhub.com logs in as admin
        onLoginSuccess();
    };
    
    return (
        <AuthLayout title="Welcome back - Demo Credentials" onNavigate={onNavigate}>
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                            placeholder="alex.doe@example.com (Job Seeker)"
                            defaultValue="alex.doe@example.com"
                        />
                        <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                            placeholder="password123"
                            defaultValue="password123"
                        />
                        <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded transition-colors"
                        />
                        <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700">
                            Remember me
                        </label>
                    </div>

                    <div className="text-sm">
                        <button
                            type="button"
                            onClick={() => onNavigate('forgot_password')}
                            className="font-medium text-primary hover:text-primary-dark transition-colors"
                        >
                            Forgot password?
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        type="submit"
                        className="group w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                        <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Sign In
                    </button>
                </div>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <SocialLoginButtons onNavigate={onNavigate} />
            </div>
            <p className="mt-8 text-center text-sm text-gray-600">
                Not a member?{' '}
                <button onClick={() => onNavigate('signup')} className="font-medium text-primary hover:text-blue-700">
                    Sign up
                </button>
            </p>
        </AuthLayout>
    );
};

export default LoginPage;