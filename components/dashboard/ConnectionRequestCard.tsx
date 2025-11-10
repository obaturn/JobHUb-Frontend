import React from 'react';
import { ConnectionRequest } from '../../types';

interface ConnectionRequestCardProps {
    request: ConnectionRequest;
    onAction: (requestId: string, action: 'accept' | 'ignore') => void;
}

const ConnectionRequestCard: React.FC<ConnectionRequestCardProps> = ({ request, onAction }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center shadow-sm">
            <img src={request.user.avatar} alt={request.user.name} className="w-20 h-20 rounded-full mb-3" />
            <h3 className="font-bold text-neutral-dark">{request.user.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2 flex-grow">{request.user.headline}</p>
            <p className="text-xs text-gray-400 mt-2">{request.mutualConnections} mutual connections</p>
            <div className="mt-4 w-full space-y-2">
                <button 
                    onClick={() => onAction(request.id, 'accept')}
                    className="w-full px-4 py-2 bg-primary text-white font-semibold rounded-md text-sm hover:bg-blue-700"
                >
                    Accept
                </button>
                <button 
                    onClick={() => onAction(request.id, 'ignore')}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md text-sm hover:bg-gray-300"
                >
                    Ignore
                </button>
            </div>
        </div>
    );
};

export default ConnectionRequestCard;