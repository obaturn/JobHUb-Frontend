
import React, { useState } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import SocialLoginButtons from '../components/auth/SocialLoginButtons';
import Toast from '../components/Toast';
import { Page } from '../types';

interface SignupPageProps {
    onNavigate: (page: Page) => void;
    onLoginSuccess: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigate, onLoginSuccess }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState<'job_seeker' | 'employer'>('job_seeker');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [retryAttempt, setRetryAttempt] = useState(0);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Password validation regex: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const validatePassword = (pwd: string): string[] => {
        const errors: string[] = [];
        if (pwd.length < 8) errors.push('At least 8 characters');
        if (!/[A-Z]/.test(pwd)) errors.push('One uppercase letter');
        if (!/[a-z]/.test(pwd)) errors.push('One lowercase letter');
        if (!/\d/.test(pwd)) errors.push('One number');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) errors.push('One special character (!@#$%^&*...)');
        return errors;
    };

    // Handle resend verification email
    const handleResendVerification = async () => {
        if (resendCooldown > 0) return;
        
        try {
            setResendLoading(true);
            setResendMessage(null);
            console.log('📧 [SignupPage] Requesting resend verification for:', registeredEmail);
            
            const { resendVerificationEmail } = await import('../src/api/authApi');
            await resendVerificationEmail(registeredEmail);
            
            console.log('✅ [SignupPage] Verification email resent successfully');
            setResendMessage({ type: 'success', text: '✓ Verification email resent! Check your inbox and spam folder.' });
            
            // Start 60-second cooldown
            setResendCooldown(60);
            const interval = setInterval(() => {
                setResendCooldown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to resend verification email';
            console.error('❌ [SignupPage] Resend error:', error);
            setResendMessage({ type: 'error', text: `Error: ${message}` });
        } finally {
            setResendLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('📝 Form submission started');
        setError(null);
        setFieldErrors({});

        const formData = new FormData(e.currentTarget);
        const firstName = (formData.get('firstName') as string).trim();
        const lastName = (formData.get('lastName') as string).trim();
        const email = (formData.get('email') as string).trim();
        const newErrors: Record<string, string> = {};

        console.log('📋 Form data:', { firstName, lastName, email, passwordLength: password.length, userType });

        // Validate first name
        if (!firstName) {
            newErrors.firstName = 'First name is required';
        }

        // Validate last name
        if (!lastName) {
            newErrors.lastName = 'Last name is required';
        }

        // Validate email
        if (!email) {
            newErrors.email = 'Email is required';
        }

        // Validate password
        if (!password) {
            newErrors.password = 'Password is required';
        } else {
            const passwordErrors = validatePassword(password);
            if (passwordErrors.length > 0) {
                newErrors.password = `Password must contain: ${passwordErrors.join(', ')}`;
            }
        }

        // Validate confirm password
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            console.warn('❌ Validation failed:', newErrors);
            setFieldErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            setRetryAttempt(0);
            console.log('🔄 Starting signup process...');
            
            console.log('👤 Signup data:', { firstName, lastName, email, userType });

            // Import and use the auth store
            const { useAuthStore } = await import('../stores/useAuthStore');
            const authStore = useAuthStore.getState();
            
            console.log('📤 Calling signup API...');
            await authStore.signup({
                firstName,
                lastName,
                email,
                password,
                userType: userType  // Now uses the selected user type!
            });
            
            console.log('✅ Signup successful!');
            // Don't auto-login, show email verification message instead
            setRegisteredEmail(email);
            setSignupSuccess(true);
        } catch (error) {
            console.error('❌ Signup failed:', error);
            
            // Parse backend validation errors
            if (error instanceof Error) {
                const message = error.message;
                console.log('📌 Error message:', message);
                
                if (message.includes('firstName')) {
                    newErrors.firstName = 'First name is required';
                }
                if (message.includes('lastName')) {
                    newErrors.lastName = 'Last name is required';
                }
                if (message.includes('passwordHash') || message.includes('password')) {
                    newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
                }
                if (Object.keys(newErrors).length > 0) {
                    console.log('🔴 Field errors:', newErrors);
                    setFieldErrors(newErrors);
                } else {
                    console.log('🔴 General error:', message);
                    // Check if this was a concurrent modification error (retried)
                    if (message.includes('Concurrent') && retryAttempt > 0) {
                        setError(`${message} (Retry ${retryAttempt}/3 completed. Please try again.)`);
                    } else if (message.includes('Concurrent')) {
                        setError('Server is processing your request. Retrying automatically...');
                        setRetryAttempt(1);
                    } else {
                        setError(message);
                    }
                    // Show toast notification for error
                    setToast({ message, type: 'error' });
                }
            } else {
                console.log('🔴 Unknown error type');
                const errorMsg = 'Signup failed. Please try again.';
                setError(errorMsg);
                setToast({ message: errorMsg, type: 'error' });
            }
        } finally {
            setLoading(false);
            console.log('🏁 Signup process ended');
        }
    };

    return (
        <>
            {/* Toast Notification */}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            
            <AuthLayout title="Join JobHub today" onNavigate={onNavigate}>
            {/* Email Verification Success Screen */}
            {signupSuccess && (
                <div className="text-center space-y-6">
                    {/* Success Icon */}
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    {/* Success Message */}
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-dark mb-2">Registration Successful!</h2>
                        <p className="text-gray-600">
                            We've sent a verification email to <span className="font-semibold text-neutral-dark">{registeredEmail}</span>
                        </p>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
                        <h3 className="font-semibold text-blue-900 mb-2">Next steps:</h3>
                        <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                            <li>Open your email inbox (click button below)</li>
                            <li>Look for email from JobHub (check spam folder if not found)</li>
                            <li>Click the "Verify Email" button in the email</li>
                            <li>You'll be automatically redirected to login</li>
                        </ol>
                    </div>

                    {/* Resend Verification Section */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="text-sm text-amber-900 mb-3">
                            Didn't receive the email? Check your spam folder or request a new verification link.
                        </p>
                        <button
                            onClick={handleResendVerification}
                            disabled={resendLoading || resendCooldown > 0}
                            className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                                resendCooldown > 0 || resendLoading
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                            }`}
                        >
                            {resendLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </span>
                            ) : resendCooldown > 0 ? (
                                `Resend in ${resendCooldown}s`
                            ) : (
                                'Resend Verification Email'
                            )}
                        </button>
                        {resendMessage && (
                            <div className={`mt-3 p-2 rounded text-sm ${
                                resendMessage.type === 'success'
                                    ? 'bg-success-50 text-success-700'
                                    : 'bg-error-50 text-error-700'
                            }`}>
                                {resendMessage.type === 'success' ? '✓ ' : '✕ '}
                                {resendMessage.text}
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3 pt-4">
                        <button
                            onClick={() => {
                                // Smart email client detection
                                const emailDomain = registeredEmail.split('@')[1]?.toLowerCase();
                                let emailUrl = '';
                                
                                if (emailDomain?.includes('gmail')) {
                                    emailUrl = 'https://mail.google.com';
                                } else if (emailDomain?.includes('outlook') || emailDomain?.includes('hotmail')) {
                                    emailUrl = 'https://outlook.live.com';
                                } else if (emailDomain?.includes('yahoo')) {
                                    emailUrl = 'https://mail.yahoo.com';
                                } else {
                                    // Generic mailto for other providers
                                    emailUrl = `mailto:${registeredEmail}`;
                                }
                                
                                window.open(emailUrl, '_blank');
                            }}
                            className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Open My Email
                        </button>
                        <button
                            onClick={() => onNavigate('login')}
                            className="w-full px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-semibold transition-colors text-sm"
                        >
                            I've already verified, take me to login
                        </button>
                        <button
                            onClick={() => {
                                setSignupSuccess(false);
                                setError(null);
                                setFieldErrors({});
                                setResendMessage(null);
                                setResendCooldown(0);
                            }}
                            className="w-full px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-semibold transition-colors"
                        >
                            Create Another Account
                        </button>
                    </div>

                    {/* Development Helper */}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <p className="text-xs text-gray-500 mb-2">Development: Need help verifying?</p>
                        <button
                            onClick={() => {
                                // Copy verification link instructions
                                const message = `Verification email sent to ${registeredEmail}. Check your email for the verification link with format: /api/auth/verify-email?token=...`;
                                alert(message);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 underline"
                        >
                            Show verification instructions
                        </button>
                    </div>
                </div>
            )}

            {/* Registration Form (hidden when signup successful) */}
            {!signupSuccess && (
                <>
            {/* Welcome Message */}
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-neutral-dark mb-2">Create your account</h2>
                <p className="text-gray-600">
                    {userType === 'job_seeker' 
                        ? 'Join millions of professionals building their careers' 
                        : 'Connect with top talent and grow your team'
                    }
                </p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="mb-6 p-5 bg-red-50 border-l-4 border-red-500 rounded-xl shadow-sm animate-shake">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <svg className="w-6 h-6 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-red-900 mb-1">Registration Failed</h3>
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="flex-shrink-0 text-red-600 hover:text-red-900 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <style>{`
                        @keyframes shake {
                            0%, 100% { transform: translateX(0); }
                            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                            20%, 40%, 60%, 80% { transform: translateX(5px); }
                        }
                        .animate-shake { animation: shake 0.5s ease-in-out; }
                    `}</style>
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
                            First Name
                        </label>
                        <div className="relative">
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                autoComplete="given-name"
                                required
                                className={`appearance-none block w-full px-4 py-3 border rounded-xl shadow-sm placeholder-gray-400 text-neutral-dark focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 ${fieldErrors.firstName ? 'border-error-500 focus:ring-error/20 focus:border-error-600' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'}`}
                                placeholder="e.g., John"
                            />
                            <svg className={`absolute right-3 top-3.5 w-5 h-5 ${fieldErrors.firstName ? 'text-error-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        {fieldErrors.firstName && (
                            <p className="text-sm text-error-600 font-medium">{fieldErrors.firstName}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
                            Last Name
                        </label>
                        <div className="relative">
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                autoComplete="family-name"
                                required
                                className={`appearance-none block w-full px-4 py-3 border rounded-xl shadow-sm placeholder-gray-400 text-neutral-dark focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 ${fieldErrors.lastName ? 'border-error-500 focus:ring-error/20 focus:border-error-600' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'}`}
                                placeholder="e.g., Doe"
                            />
                            <svg className={`absolute right-3 top-3.5 w-5 h-5 ${fieldErrors.lastName ? 'text-error-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        {fieldErrors.lastName && (
                            <p className="text-sm text-error-600 font-medium">{fieldErrors.lastName}</p>
                        )}
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
                            className={`appearance-none block w-full px-4 py-3 border rounded-xl shadow-sm placeholder-gray-400 text-neutral-dark focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 ${fieldErrors.email ? 'border-error-500 focus:ring-error/20 focus:border-error-600' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'}`}
                            placeholder="you@example.com"
                        />
                        <svg className={`absolute right-3 top-3.5 w-5 h-5 ${fieldErrors.email ? 'text-error-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                    </div>
                    {fieldErrors.email && (
                        <p className="text-sm text-error-600 font-medium">{fieldErrors.email}</p>
                    )}
                </div>

                {/* User Type Selection */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        I want to
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setUserType('job_seeker')}
                            className={`p-4 border-2 rounded-xl transition-all duration-200 text-left ${
                                userType === 'job_seeker'
                                    ? 'border-primary bg-primary/5 shadow-md'
                                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    userType === 'job_seeker' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                    🎯
                                </div>
                                <div>
                                    <h3 className={`font-semibold ${
                                        userType === 'job_seeker' ? 'text-primary' : 'text-gray-900'
                                    }`}>
                                        Find a Job
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        I'm looking for job opportunities
                                    </p>
                                </div>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setUserType('employer')}
                            className={`p-4 border-2 rounded-xl transition-all duration-200 text-left ${
                                userType === 'employer'
                                    ? 'border-primary bg-primary/5 shadow-md'
                                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    userType === 'employer' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                    🏢
                                </div>
                                <div>
                                    <h3 className={`font-semibold ${
                                        userType === 'employer' ? 'text-primary' : 'text-gray-900'
                                    }`}>
                                        Hire Talent
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        I want to post jobs and find candidates
                                    </p>
                                </div>
                            </div>
                        </button>
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`appearance-none block w-full px-4 py-3 pr-12 rounded-xl shadow-sm placeholder-gray-400 text-neutral-dark focus:outline-none focus:ring-2 transition-all duration-200 border bg-gray-50 ${fieldErrors.password ? 'border-error-500 focus:ring-error/20 focus:border-error-600' : password.length === 0 ? 'border-gray-200 focus:ring-primary/20 focus:border-primary' : 'border-gray-300 focus:ring-primary/20 focus:border-primary'}`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 top-3.5 w-5 h-5 ${fieldErrors.password ? 'text-error-500' : 'text-gray-400 hover:text-gray-600'}`}
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
                        {fieldErrors.password && (
                            <p className="text-sm text-error-600 font-medium">{fieldErrors.password}</p>
                        )}
                        {!fieldErrors.password && (
                            <p className="text-xs text-gray-500">
                                Must contain: 8+ characters, uppercase, lowercase, number, special character
                            </p>
                        )}
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
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                aria-invalid={fieldErrors.confirmPassword ? 'true' : 'false'}
                                className={`appearance-none block w-full px-4 py-3 pr-12 rounded-xl shadow-sm placeholder-gray-400 text-neutral-dark focus:outline-none focus:ring-2 transition-all duration-200 border bg-gray-50 ${
                                    fieldErrors.confirmPassword 
                                        ? 'border-error-500 focus:ring-error/20 focus:border-error-600' 
                                        : confirmPassword.length === 0 
                                            ? 'border-gray-200 focus:ring-primary/20 focus:border-primary' 
                                            : password === confirmPassword 
                                                ? 'border-success-500 focus:ring-success/20 focus:border-success-600' 
                                                : 'border-error-500 focus:ring-error/20 focus:border-error-600'
                                }`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className={`absolute right-3 top-3.5 w-5 h-5 ${
                                    fieldErrors.confirmPassword 
                                        ? 'text-error-500' 
                                        : confirmPassword && password === confirmPassword 
                                            ? 'text-success-500' 
                                            : 'text-gray-400 hover:text-gray-600'
                                }`}
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
                        {fieldErrors.confirmPassword && (
                            <p className="text-sm text-error-600 font-medium">{fieldErrors.confirmPassword}</p>
                        )}
                        {!fieldErrors.confirmPassword && confirmPassword && (
                            <p className={`text-sm ${password === confirmPassword ? 'text-success-600 font-medium' : 'text-error-600 font-medium'}`}>
                                {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                            </p>
                        )}
                    </div>
                </div>




                <button
                    type="submit"
                    disabled={loading || !!Object.keys(fieldErrors).length}
                    className="group w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {loading ? (
                        <>
                            <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.25" />
                                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Creating account...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Join JobHub
                        </>
                    )}
                </button>
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
                </>
            )}
            </AuthLayout>
        </>
    );
};

export default SignupPage;