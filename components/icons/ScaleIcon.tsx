import React from 'react';

export const ScaleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52v16.5m-1.5-16.5v16.5m0 0c.09.05.18.1.27.15m-3.15-16.65L7.5 4.97m0 0A48.417 48.417 0 0 0 5.25 4.5c-2.291 0-4.545.16-6.75.47M5.25 4.97c-1.01.143-2.01.317-3 .52M5.25 4.97V21" />
    </svg>
);