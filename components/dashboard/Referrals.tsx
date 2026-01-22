import React, { useState } from 'react';
import { User } from '../../types';
import { MOCK_REFERRALS } from '../../constants';
import { GiftIcon } from '../icons/GiftIcon';
import { ClipboardDocumentIcon } from '../icons/ClipboardDocumentIcon';
import { ClipboardDocumentCheckIcon } from '../icons/ClipboardDocumentCheckIcon';
import { LinkedInIcon } from '../icons/LinkedInIcon';
import { TwitterIcon } from '../icons/TwitterIcon';

interface ReferralsProps {
    user: User;
}

const statusColors: { [key in typeof MOCK_REFERRALS[0]['status']]: string } = {
    'Pending': 'bg-gray-100 text-gray-800',
    'Signed Up': 'bg-yellow-100 text-yellow-800',
    'Hired': 'bg-green-100 text-green-800',
};

const Referrals: React.FC<ReferralsProps> = ({ user }) => {
    const [copied, setCopied] = useState(false);
    const referralCode = user.name.replace(/\s+/g, '').toUpperCase() + '123';
    const referralLink = `https://jobhub.com/ref?code=${referralCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                        <GiftIcon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-dark">Refer a Friend, Get Rewarded</h1>
                        <p className="text-gray-500 mt-1">Invite friends to JobHub. When they get hired, you both get a $50 credit!</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-neutral-dark mb-4">Your Referral Link</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        readOnly
                        value={referralLink}
                        className="flex-grow w-full px-4 py-2 bg-neutral-light border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        onClick={handleCopy}
                        className="w-full sm:w-auto px-4 py-2 bg-secondary text-white font-semibold rounded-md hover:bg-teal-600 transition-colors flex items-center justify-center gap-2"
                    >
                        {copied ? <ClipboardDocumentCheckIcon className="w-5 h-5" /> : <ClipboardDocumentIcon className="w-5 h-5" />}
                        {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                </div>
                <div className="mt-4 flex items-center gap-4">
                    <p className="text-sm text-gray-500">Share via:</p>
                    <div className="flex gap-2">
                        <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-[#0077b5]"><LinkedInIcon className="w-5 h-5" /></a>
                        <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-[#1DA1F2]"><TwitterIcon className="w-5 h-5" /></a>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-neutral-dark">Your Referrals</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Friend</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Reward</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_REFERRALS.map(ref => (
                                <tr key={ref.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{ref.referredUserName}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[ref.status]}`}>{ref.status}</span>
                                    </td>
                                    <td className="px-6 py-4">{ref.reward}</td>
                                    <td className="px-6 py-4">{new Date(ref.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Referrals;