
import React, { useState } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import { useAuthStore } from '../src/stores/authStore';

interface ForgotPasswordPageProps {
    onNavigate: (page: 'login' | 'signup' | 'forgot_password' | 'landing') => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
    const { forgotPassword, loading, error } = useAuthStore();
    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            await forgotPassword(email);
            setEmailSent(true);
        } catch (err) {
            console.error('Forgot password error:', err);
            // Error is already set in the store
        }
    };

    return (
        <AuthLayout title={emailSent ? "Check your inbox" : "Reset your password"} onNavigate={onNavigate}>
            {emailSent ? (
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        We've sent a password reset link to <span className="font-medium text-neutral-dark">{email}</span>. Please check your email and follow the instructions to reset your password.
                    </p>
                    <div className="mt-6">
                        <button
                            onClick={() => onNavigate('login')}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Return to Log In
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <p className="text-center text-sm text-gray-600 mb-6">
                        No problem. Enter your email address below and we'll send you a link to reset your password.
                    </p>
                    
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 mb-4">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}
                    
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    disabled={loading}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:opacity-50"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </div>
                    </form>
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Remember your password?{' '}
                        <button onClick={() => onNavigate('login')} className="font-medium text-primary hover:text-blue-700">
                            Back to Log in
                        </button>
                    </p>
                </>
            )}
        </AuthLayout>
    );
};

export default ForgotPasswordPage;