import React, { useState } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import SocialLoginButtons from '../components/auth/SocialLoginButtons';
import { useAuthStore } from '../stores/useAuthStore';
import { Page, User } from '../types';

interface LoginPageProps {
    onNavigate: (page: Page) => void;
    onLoginSuccess: (user: User) => void;
    onEmployerLogin: () => void;
    onAdminLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess, onEmployerLogin, onAdminLogin }) => {
    const { login, user } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showResendVerification, setShowResendVerification] = useState(false);
    const [lastAttemptedEmail, setLastAttemptedEmail] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState<string | null>(null);
    
    const handleResendVerification = async () => {
        if (!lastAttemptedEmail) return;
        
        try {
            setResendLoading(true);
            setResendMessage(null);
            
            const { resendVerificationEmail } = await import('../src/api/authApi');
            await resendVerificationEmail(lastAttemptedEmail);
            
            setResendMessage('✅ Verification email sent! Please check your inbox and spam folder.');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to resend verification email';
            setResendMessage(`❌ ${message}`);
        } finally {
            setResendLoading(false);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const deviceId = `device-${Date.now()}`; // Generate device ID

        // Debug logging
        console.log('🔐 [LoginPage] Login attempt:', {
            email,
            passwordLength: password.length,
            passwordBytes: new TextEncoder().encode(password).length,
            passwordPreview: password.substring(0, 3) + '***' // Don't log full password in production
        });

        try {
            await login({ email, password, deviceId });
            // Get the user from store state after successful login
            const loggedInUser = useAuthStore.getState().user;
            if (loggedInUser) {
                onLoginSuccess(loggedInUser);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            
            console.error('❌ [LoginPage] Login error:', errorMessage);
            
            // Store email for potential resend verification
            setLastAttemptedEmail(email);
            
            // Check for specific error types
            if (errorMessage.includes('Email not verified') || errorMessage.includes('verification')) {
                setError('❌ Email not verified. Please check your email for the verification link and click it to activate your account.');
                setShowResendVerification(true);
            } else if (errorMessage.includes('Invalid email or password')) {
                setError('❌ Invalid email or password. Please check your credentials and try again.');
                setShowResendVerification(false);
            } else if (errorMessage.includes('Account locked')) {
                setError('❌ Account temporarily locked due to multiple failed login attempts. Please try again later.');
                setShowResendVerification(false);
            } else {
                setError(`❌ ${errorMessage}`);
                setShowResendVerification(false);
            }
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <AuthLayout title="Welcome back" onNavigate={onNavigate}>
            {/* Welcome Message */}
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-neutral-dark mb-2">Sign in to your account</h2>
                <p className="text-gray-600">Continue your professional journey</p>
            </div>

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
                            className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50 disabled:opacity-50"
                            placeholder="Enter your email address"
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
                            className="appearance-none block w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50 disabled:opacity-50"
                            placeholder="Enter your password"
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
                    <div className="p-5 bg-red-50 border-l-4 border-red-500 rounded-xl shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-red-900 mb-1">Login Failed</h3>
                                <p className="text-sm text-red-800">{error}</p>
                                
                                {/* Resend Verification Section */}
                                {showResendVerification && (
                                    <div className="mt-3 pt-3 border-t border-red-200">
                                        <p className="text-sm text-red-700 mb-2">
                                            Didn't receive the verification email?
                                        </p>
                                        <button
                                            onClick={handleResendVerification}
                                            disabled={resendLoading}
                                            className="text-sm font-medium text-red-800 hover:text-red-900 underline disabled:opacity-50"
                                        >
                                            {resendLoading ? 'Sending...' : 'Resend verification email'}
                                        </button>
                                        {resendMessage && (
                                            <p className="text-sm mt-2 text-red-700">{resendMessage}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    setError(null);
                                    setShowResendVerification(false);
                                    setResendMessage(null);
                                }}
                                className="flex-shrink-0 text-red-600 hover:text-red-900 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
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