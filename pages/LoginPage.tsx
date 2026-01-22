import React, { useState } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import SocialLoginButtons from '../components/auth/SocialLoginButtons';
import { useAuthStore } from '../src/stores/authStore';
import { Page, User } from '../types';

interface LoginPageProps {
    onNavigate: (page: Page) => void;
    onLoginSuccess: (user: User) => void;
    onEmployerLogin: () => void;
    onAdminLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess, onEmployerLogin, onAdminLogin }) => {
    const { login } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const deviceId = `device-${Date.now()}`; // Generate device ID

        try {
            const user = await login({ email, password, deviceId });
            // If we get here without MFA, login was successful
            onLoginSuccess(user);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            
            setError(errorMessage || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
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
                            disabled={loading}
                            className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 disabled:opacity-50"
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
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            required
                            disabled={loading}
                            className="appearance-none block w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 disabled:opacity-50"
                            placeholder="password123"
                            defaultValue="password123"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                            className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 hover:text-gray-600 disabled:opacity-50"
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

                {/* Error Message */}
                {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            disabled={loading}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded transition-colors disabled:opacity-50"
                        />
                        <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700">
                            Remember me
                        </label>
                    </div>

                    <div className="text-sm">
                        <button
                            type="button"
                            onClick={() => onNavigate('forgot_password')}
                            disabled={loading}
                            className="font-medium text-primary hover:text-primary-dark transition-colors disabled:opacity-50"
                        >
                            Forgot password?
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="group w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        {loading ? 'Signing in...' : 'Sign In'}
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

            {/* MFA removed from login flow in mock mode */}
        </AuthLayout>
    );
};

export default LoginPage;