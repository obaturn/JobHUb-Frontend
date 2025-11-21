import React from 'react';

export const FlagIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 6V7.5m0 13.5A2.25 2.25 0 0 0 5.25 21H18a2.25 2.25 0 0 0 2.25-2.25V7.5M18 7.5V3m0 4.5v.75m-12 5.25v-1.5m6 1.5v-1.5m6-1.5v-1.5m-6-1.5V3m0 1.5V7.5" />
    </svg>
);