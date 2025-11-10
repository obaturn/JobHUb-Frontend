import React from 'react';

export const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m12 5.25v-1.5m-12 1.5v-1.5m12 0a6 6 0 0 0-6-6m-6 6a6 6 0 0 1 6-6m0 0V4.5m5.25 6H12m-5.25 0H12" />
    </svg>
);