import React, { useEffect, useState, useRef } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import { Page } from '../types';

interface EmailVerificationPageProps {
    onNavigate: (page: Page) => void;
    onLoginSuccess?: () => void;
}

const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({ onNavigate, onLoginSuccess }) => {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email...');
    // Use ref to prevent multiple API calls in React 18 Strict Mode
    const verificationAttempted = useRef(false);

    useEffect(() => {
        const verifyEmail = async () => {
            // Guard against multiple invocations (React 18 Strict Mode runs effects twice)
            if (verificationAttempted.current) {
                console.log('⚠️ [EmailVerificationPage] Verification already attempted, skipping');
                return;
            }
            verificationAttempted.current = true;

            // Get token from URL query parameter
            // URLSearchParams.get() automatically decodes URL-encoded characters
            const searchParams = new URLSearchParams(window.location.search);
            const token = searchParams.get('token');

            console.log('📧 [EmailVerificationPage] ========== EMAIL VERIFICATION STARTED ==========');
            console.log('📧 [EmailVerificationPage] Full URL:', window.location.href);
            console.log('📧 [EmailVerificationPage] Search params raw:', window.location.search);

            if (!token) {
                console.error('❌ [EmailVerificationPage] No token found in URL query parameters');
                setStatus('error');
                setMessage('Verification token is missing. Please click the link from your email again.');
                return;
            }

            // Log token details for debugging
            console.log('📧 [EmailVerificationPage] Token extracted (length:', token.length, ')');
            console.log('📧 [EmailVerificationPage] Token (full):', token);
            console.log('📧 [EmailVerificationPage] Token format check:', /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token) ? 'Valid UUID' : 'Not a UUID');

            try {
                // PRIMARY METHOD: Use GET request (backend supports @GetMapping)
                // The backend expects: GET /api/v1/auth/verify-email?token=<UUID>
                // We need to encode the token for URL safety
                const encodedToken = encodeURIComponent(token);
                const verifyUrl = `/api/v1/auth/verify-email?token=${encodedToken}`;
                
                console.log('📧 [EmailVerificationPage] Calling backend GET:', verifyUrl);
                console.log('📧 [EmailVerificationPage] Encoded token:', encodedToken);
                
                const response = await fetch(verifyUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log('📧 [EmailVerificationPage] Backend response status:', response.status);
                console.log('📧 [EmailVerificationPage] Backend response headers:', Object.fromEntries(response.headers.entries()));

                // Handle error responses
                if (!response.ok) {
                    const responseText = await response.text();
                    console.error('❌ [EmailVerificationPage] Backend returned error');
                    console.error('❌ [EmailVerificationPage] Status:', response.status);
                    console.error('❌ [EmailVerificationPage] Response body:', responseText);
                    
                    let errorMessage = 'Email verification failed';
                    
                    try {
                        const errorData = JSON.parse(responseText);
                        errorMessage = errorData.message || errorData.error || errorMessage;
                        console.error('❌ [EmailVerificationPage] Parsed error data:', errorData);
                    } catch (e) {
                        // Response is not JSON
                        errorMessage = responseText.substring(0, 200) || `Server error (${response.status})`;
                        console.error('❌ [EmailVerificationPage] Response is not valid JSON');
                    }
                    
                    setStatus('error');
                    setMessage(errorMessage);
                    return;
                }

                // Parse successful response
                // Backend returns: {"message": "Email verified successfully."}
                const responseText = await response.text();
                console.log('✅ [EmailVerificationPage] Backend response body:', responseText);
                
                let responseData;
                try {
                    responseData = JSON.parse(responseText);
                    console.log('✅ [EmailVerificationPage] Parsed response:', responseData);
                } catch (e) {
                    console.warn('⚠️ [EmailVerificationPage] Backend returned non-JSON response');
                    responseData = null;
                }

                // Check if backend included auth tokens (future feature)
                if (responseData && responseData.accessToken && responseData.refreshToken) {
                    console.log('🔐 [EmailVerificationPage] Backend included auth tokens, logging user in');
                    
                    // Validate tokens before storing
                    if (responseData.accessToken && responseData.accessToken !== 'undefined' && responseData.accessToken !== 'null' &&
                        responseData.refreshToken && responseData.refreshToken !== 'undefined' && responseData.refreshToken !== 'null') {
                        
                        localStorage.setItem('accessToken', responseData.accessToken);
                        localStorage.setItem('refreshToken', responseData.refreshToken);
                        
                        if (responseData.user) {
                            localStorage.setItem('user', JSON.stringify(responseData.user));
                        }
                        
                        const { useAuthStore } = await import('../stores/useAuthStore');
                        const authStore = useAuthStore.getState();
                        authStore.setAuthenticated(true, responseData.user, responseData.accessToken);
                        
                        setStatus('success');
                        setMessage('Your email has been verified successfully! Redirecting to dashboard...');
                        
                        if (onLoginSuccess) {
                            onLoginSuccess();
                        }
                        
                        setTimeout(() => {
                            onNavigate('universal_dashboard');
                        }, 2000);
                    } else {
                        console.warn('⚠️ [EmailVerificationPage] Backend returned invalid tokens, proceeding with normal flow');
                        setStatus('success');
                        setMessage('Your email has been verified successfully! Please log in to continue.');
                        
                        setTimeout(() => {
                            onNavigate('login');
                        }, 3000);
                    }
                } else {
                    // Normal flow: Email verified, user must log in separately
                    console.log('✅ [EmailVerificationPage] Email verified! Redirecting to login...');
                    
                    setStatus('success');
                    setMessage('✅ Email verified successfully!');
                    
                    // Show progress messages for better UX
                    setTimeout(() => {
                        setMessage('🔐 Preparing your account...');
                    }, 1000);
                    
                    setTimeout(() => {
                        setMessage('🚀 Redirecting to login...');
                    }, 2000);
                    
                    // Redirect after 3 seconds total
                    setTimeout(() => {
                        onNavigate('login');
                    }, 3000);
                }
            } catch (error) {
                console.error('❌ [EmailVerificationPage] Unexpected error during verification');
                console.error('❌ [EmailVerificationPage] Error type:', error?.constructor?.name);
                console.error('❌ [EmailVerificationPage] Error message:', error instanceof Error ? error.message : String(error));
                console.error('❌ [EmailVerificationPage] Error stack:', error instanceof Error ? error.stack : 'N/A');
                
                setStatus('error');
                setMessage(error instanceof Error ? error.message : 'An unexpected error occurred during verification. Please try again.');
            }
        };

        verifyEmail();
    }, [onNavigate, onLoginSuccess]);

    return (
        <AuthLayout title="Email Verification" onNavigate={onNavigate}>
            <div className="text-center space-y-6">
                {/* Status Icon */}
                <div className="flex justify-center">
                    {status === 'loading' && (
                        <div className="relative w-16 h-16">
                            {/* Spinning circle background */}
                            <div className="absolute inset-0 bg-blue-100 rounded-full"></div>
                            
                            {/* Animated spinning border */}
                            <svg className="absolute inset-0 w-16 h-16 animate-spin" viewBox="0 0 50 50">
                                <circle
                                    className="text-blue-200"
                                    strokeWidth="3"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="20"
                                    cx="25"
                                    cy="25"
                                />
                                <circle
                                    className="text-blue-600"
                                    strokeWidth="3"
                                    stroke="currentColor"
                                    fill="transparent"
                                    strokeDasharray="80 200"
                                    strokeLinecap="round"
                                    r="20"
                                    cx="25"
                                    cy="25"
                                    style={{
                                        transformOrigin: '50% 50%',
                                    }}
                                />
                            </svg>
                            
                            {/* Shield icon in center */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
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
                            <p className="text-sm text-gray-600 animate-pulse">
                                {message.includes('Redirecting') ? 'Redirecting now...' : 'You will be redirected to login in a few seconds...'}
                            </p>
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
