import React from 'react';

export const GiftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a2.25 2.25 0 0 1-2.25 2.25H5.25a2.25 2.25 0 0 1-2.25-2.25v-8.25M12 15v-1.5m0-1.5V12m0 0V9.75M12 9.75h1.5m-1.5 0H10.5m-3.75 3h7.5M9 15h6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);