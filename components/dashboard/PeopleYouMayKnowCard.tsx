import React from 'react';
import { User } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';

interface PeopleYouMayKnowCardProps {
    user: User;
}

const PeopleYouMayKnowCard: React.FC<PeopleYouMayKnowCardProps> = ({ user }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-shadow">
            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mb-3" />
            <div className="flex-grow">
                <h3 className="font-bold text-neutral-dark">{user.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{user.headline}</p>
            </div>
            <button className="mt-4 w-full flex items-center justify-center gap-1 px-4 py-2 border border-primary text-primary font-semibold rounded-full text-sm hover:bg-primary hover:text-white transition-colors">
                <PlusIcon className="w-4 h-4" />
                Connect
            </button>
        </div>
    );
};

export default PeopleYouMayKnowCard;