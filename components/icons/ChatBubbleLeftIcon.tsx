import React from 'react';

export const ChatBubbleLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m2.25 2.25H15M3.75 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z" />
    </svg>
);
