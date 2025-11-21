import React from 'react';
import { ConnectionRequest } from '../../types';
import { MOCK_PEOPLE_YOU_MAY_KNOW } from '../../constants';
import ConnectionRequestCard from './ConnectionRequestCard';
import PeopleYouMayKnowCard from './PeopleYouMayKnowCard';

interface MyNetworkProps {
    requests: ConnectionRequest[];
    onAction: (requestId: string, action: 'accept' | 'ignore') => void;
}

const MyNetwork: React.FC<MyNetworkProps> = ({ requests, onAction }) => {
    return (
        <div className="space-y-8">
            {/* Invitations Section */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-dark">Invitations</h1>
                        <p className="text-gray-500 mt-1">Manage your pending connection requests.</p>
                    </div>
                     {requests.length > 0 && <span className="px-3 py-1 bg-primary text-white text-sm font-bold rounded-full">{requests.length}</span>}
                </div>
                {requests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {requests.map(req => (
                            <ConnectionRequestCard key={req.id} request={req} onAction={onAction} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center py-12 text-gray-500">No pending invitations.</p>
                )}
            </div>

            {/* People You May Know Section */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b">
                     <h2 className="text-2xl font-bold text-neutral-dark">People You May Know</h2>
                     <p className="text-gray-500 mt-1">Grow your professional network.</p>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                    {MOCK_PEOPLE_YOU_MAY_KNOW.map(user => (
                        <PeopleYouMayKnowCard key={user.id} user={user} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyNetwork;