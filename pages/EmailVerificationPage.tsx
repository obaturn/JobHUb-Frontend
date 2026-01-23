import React, { useEffect, useState } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import { Page } from '../types';

interface EmailVerificationPageProps {
    onNavigate: (page: Page) => void;
}

const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({ onNavigate }) => {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const verifyEmail = async () => {
            // Get token from URL query parameter
            const searchParams = new URLSearchParams(window.location.search);
            const token = searchParams.get('token');

            if (!token) {
                setStatus('error');
                setMessage('Verification token is missing. Please click the link from your email again.');
                return;
            }

            try {
                console.log('📧 [EmailVerificationPage] Verifying email with token:', token);
                
                const response = await fetch('/api/v1/auth/verify-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                if (!response.ok) {
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch (e) {
                        errorData = { message: `HTTP ${response.status}` };
                    }
                    
                    const errorMessage = errorData.message || errorData.error || 'Verification failed';
                    console.error('❌ [EmailVerificationPage] Verification error:', errorData);
                    
                    setStatus('error');
                    setMessage(errorMessage);
                    return;
                }

                const result = await response.json();
                console.log('✅ [EmailVerificationPage] Email verified successfully:', result);
                
                setStatus('success');
                setMessage('Your email has been verified successfully!');
                
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    onNavigate('login');
                }, 3000);
            } catch (error) {
                console.error('❌ [EmailVerificationPage] Error:', error);
                setStatus('error');
                setMessage(error instanceof Error ? error.message : 'An error occurred during verification');
            }
        };

        verifyEmail();
    }, [onNavigate]);

    return (
        <AuthLayout title="Email Verification" onNavigate={onNavigate}>
            <div className="text-center space-y-6">
                {/* Status Icon */}
                <div className="flex justify-center">
                    {status === 'loading' && (
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Message */}
                <div>
                    <h2 className={`text-2xl font-bold mb-2 ${
                        status === 'success' ? 'text-green-600' :
                        status === 'error' ? 'text-red-600' :
                        'text-blue-600'
                    }`}>
                        {status === 'loading' && 'Verifying Email'}
                        {status === 'success' && 'Email Verified!'}
                        {status === 'error' && 'Verification Failed'}
                    </h2>
                    <p className={`text-base ${
                        status === 'success' ? 'text-green-700' :
                        status === 'error' ? 'text-red-700' :
                        'text-blue-700'
                    }`}>
                        {message}
                    </p>
                </div>

                {/* Buttons */}
                <div className="space-y-3 pt-4">
                    {status === 'success' && (
                        <>
                            <p className="text-sm text-gray-600">You will be redirected to login in a few seconds...</p>
                            <button
                                onClick={() => onNavigate('login')}
                                className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-colors"
                            >
                                Go to Login Now
                            </button>
                        </>
                    )}
                    {status === 'error' && (
                        <>
                            <button
                                onClick={() => onNavigate('signup')}
                                className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-colors"
                            >
                                Try Signing Up Again
                            </button>
                            <button
                                onClick={() => onNavigate('login')}
                                className="w-full px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-semibold transition-colors"
                            >
                                Go to Login
                            </button>
                        </>
                    )}
                </div>

                {/* Help Text */}
                {status === 'loading' && (
                    <div className="text-sm text-gray-600 pt-4">
                        <p>Please wait while we verify your email address...</p>
                    </div>
                )}
            </div>
        </AuthLayout>
    );
};

export default EmailVerificationPage;
