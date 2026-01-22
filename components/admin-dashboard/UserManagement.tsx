import React, { useState, useMemo } from 'react';
import { User } from '../../types';
import { MOCK_ALL_USERS } from '../../constants';
import { MagnifyingGlassIcon } from '../icons/MagnifyingGlassIcon';
import UserDetailModal from '../modals/UserDetailModal';

const statusColors: { [key in User['status'] & string]: string } = {
    'Active': 'bg-green-100 text-green-800',
    'Suspended': 'bg-yellow-100 text-yellow-800',
    'Banned': 'bg-red-100 text-red-800',
};

const userTypeColors: { [key in User['userType'] & string]: string } = {
    'job_seeker': 'bg-blue-100 text-blue-800',
    'employer': 'bg-indigo-100 text-indigo-800',
    'admin': 'bg-gray-200 text-gray-800',
};

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>(MOCK_ALL_USERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [userTypeFilter, setUserTypeFilter] = useState('All');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
            const matchesUserType = userTypeFilter === 'All' || user.userType === userTypeFilter;
            return matchesSearch && matchesStatus && matchesUserType;
        });
    }, [users, searchTerm, statusFilter, userTypeFilter]);
    
    const handleViewUser = (user: User) => setSelectedUser(user);
    const handleCloseModal = () => setSelectedUser(null);
    const handleSuspendUser = (userId: string) => alert(`User ${userId} would be suspended.`);
    const handleBanUser = (userId: string) => alert(`User ${userId} would be banned.`);

    return (
        <>
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-neutral-dark">User Management</h1>
                <p className="text-gray-500 mt-1">View, manage, and moderate all users on the platform.</p>
            </div>
            
            {/* Filters and Search */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-b">
                <div className="relative md:col-span-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                </div>
                <div className="md:col-span-1">
                     <select value={userTypeFilter} onChange={e => setUserTypeFilter(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary text-sm">
                        <option value="All">All User Types</option>
                        <option value="job_seeker">Job Seeker</option>
                        <option value="employer">Employer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="md:col-span-1">
                     <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary text-sm">
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Banned">Banned</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">User</th>
                            <th scope="col" className="px-6 py-3">User Type</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Created Date</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full"/>
                                        <div>
                                            <p className="font-bold text-gray-900">{user.name}</p>
                                            <p className="text-xs">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${userTypeColors[user.userType || 'job_seeker']}`}>
                                        {user.userType?.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[user.status || 'Active']}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{user.createdDate ? new Date(user.createdDate).toLocaleDateString() : 'N/A'}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 text-sm">
                                        <button onClick={() => handleViewUser(user)} className="font-medium text-primary hover:underline">View</button>
                                        <span className="text-gray-300">|</span>
                                        <button onClick={() => handleSuspendUser(user.id)} className="font-medium text-yellow-600 hover:underline">Suspend</button>
                                        <span className="text-gray-300">|</span>
                                        <button onClick={() => handleBanUser(user.id)} className="font-medium text-alert hover:underline">Ban</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p>No users found matching your criteria.</p>
                </div>
            )}
        </div>
        {selectedUser && <UserDetailModal user={selectedUser} onClose={handleCloseModal} />}
        </>
    );
};

export default UserManagement;
