
import React from 'react';
import { GoogleIcon } from '../icons/GoogleIcon';
import { LinkedInIcon } from '../icons/LinkedInIcon';

interface SocialLoginButtonsProps {
    onNavigate: (page: 'landing' | 'login' | 'signup' | 'forgot_password') => void;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ onNavigate }) => {
    return (
        <div className="mt-6 grid grid-cols-1 gap-3">
            <div>
                <button
                    onClick={() => onNavigate('landing')}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                    <span className="sr-only">Sign in with Google</span>
                    <GoogleIcon className="w-5 h-5" />
                    <span className="ml-2">Google</span>
                </button>
            </div>

            <div>
                <button
                    onClick={() => onNavigate('landing')}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                    <span className="sr-only">Sign in with LinkedIn</span>
                    <LinkedInIcon className="w-5 h-5" />
                    <span className="ml-2">LinkedIn</span>
                </button>
            </div>
        </div>
    );
};

export default SocialLoginButtons;