import React, { useState } from 'react';
import { Page } from '../types';

interface OnboardingPageProps {
    onComplete: (userType: 'job_seeker' | 'employer') => void;
    onNavigate: (page: Page) => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete, onNavigate }) => {
    const [selectedIntent, setSelectedIntent] = useState<'job_seeker' | 'employer' | null>(null);

    const handleContinue = () => {
        if (selectedIntent) {
            onComplete(selectedIntent);
        }
    };

    const options = [
        {
            id: 'job_seeker',
            title: 'Find a job',
            description: 'Discover opportunities and advance your career',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            features: ['Apply to jobs', 'Get discovered by employers', 'Track applications', 'Build your profile']
        },
        {
            id: 'employer',
            title: 'Hire talent',
            description: 'Find and connect with qualified candidates',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            features: ['Post job openings', 'Review applications', 'Find candidates', 'Manage your team']
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to JobHub!</h1>
                    <p className="text-lg text-gray-600">What brings you here today?</p>
                </div>

                {/* Options */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {options.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => setSelectedIntent(option.id as 'job_seeker' | 'employer')}
                            className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                                selectedIntent === option.id
                                    ? 'border-primary bg-primary/5 shadow-lg'
                                    : 'border-gray-200 bg-white hover:border-primary/50'
                            }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${
                                    selectedIntent === option.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {option.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.title}</h3>
                                    <p className="text-gray-600 mb-4">{option.description}</p>
                                    <ul className="space-y-1">
                                        {option.features.map((feature, index) => (
                                            <li key={index} className="text-sm text-gray-500 flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Continue Button */}
                <div className="text-center">
                    <button
                        onClick={handleContinue}
                        disabled={!selectedIntent}
                        className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                            selectedIntent
                                ? 'bg-primary hover:bg-primary-dark hover:shadow-lg transform hover:scale-105'
                                : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        {selectedIntent ? `Continue as ${selectedIntent === 'job_seeker' ? 'Job Seeker' : 'Employer'}` : 'Select an option to continue'}
                    </button>
                    <p className="text-sm text-gray-500 mt-4">
                        You can always change this later in your settings
                    </p>
                </div>

                {/* Skip option */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => onNavigate('landing')}
                        className="text-gray-400 hover:text-gray-600 text-sm underline"
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;