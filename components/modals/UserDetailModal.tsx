import React from 'react';
import { User } from '../../types';
import { XMarkIcon } from '../icons/XMarkIcon';

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
}

const DetailRow: React.FC<{ label: string, value: React.ReactNode }> = ({ label, value }) => (
    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
);

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl relative transform transition-all animate-slide-up flex flex-col max-h-[80vh]">
        <div className="p-6 border-b flex justify-between items-start">
            <div className="flex items-center gap-4">
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full"/>
                <div>
                    <h2 className="text-2xl font-bold text-neutral-dark">{user.name}</h2>
                    <p className="text-gray-500">{user.headline}</p>
                </div>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-6 h-6" />
            </button>
        </div>

        <div className="p-6 overflow-y-auto">
            <dl className="divide-y divide-gray-200">
                <DetailRow label="User ID" value={user.id} />
                <DetailRow label="Email" value={<a href={`mailto:${user.email}`} className="text-primary hover:underline">{user.email}</a>} />
                <DetailRow label="User Type" value={user.userType?.replace('_', ' ')} />
                <DetailRow label="Status" value={user.status} />
                <DetailRow label="Member Since" value={user.createdDate ? new Date(user.createdDate).toLocaleDateString() : 'N/A'} />
                <DetailRow label="Location" value={user.location} />
                <DetailRow label="About" value={<p className="whitespace-pre-wrap">{user.about}</p>} />
                 <DetailRow 
                    label="Skills" 
                    value={
                        <div className="flex flex-wrap gap-1">
                            {user.skills.map(s => <span key={s} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{s}</span>)}
                        </div>
                    } 
                />
            </dl>
        </div>
         <div className="p-4 bg-gray-50 border-t text-right rounded-b-lg">
            <button
                onClick={onClose}
                className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
                Close
            </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default UserDetailModal;