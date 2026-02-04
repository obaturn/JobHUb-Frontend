import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { BriefcaseIcon } from '../../constants';
import { PencilIcon } from '../icons/PencilIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { XMarkIcon } from '../icons/XMarkIcon';
import { AcademicCapIcon } from '../icons/AcademicCapIcon';
import { LinkIcon } from '../icons/LinkIcon';
import { CheckBadgeIcon } from '../icons/CheckBadgeIcon';
import { getProfile, updateProfile, ProfileUpdateRequest } from '../../src/api/profileApi';

interface MyProfileProps {
  initialUser: User;
}

const MyProfile: React.FC<MyProfileProps> = ({ initialUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    // Ensure user has default values for arrays to prevent undefined errors
    const [user, setUser] = useState({
        ...initialUser,
        skills: initialUser.skills || [],
        experience: initialUser.experience || [],
        education: initialUser.education || [],
        about: initialUser.about || '',
        location: initialUser.location || '',
        headline: initialUser.headline || '',
        portfolioUrl: initialUser.portfolioUrl || '',
        avatar: initialUser.avatar || 'https://picsum.photos/seed/default/200/200',
        name: initialUser.name || 'User'
    });

    // Profile data from backend
    const [profile, setProfile] = useState<any>(null);

    // Load profile data on component mount
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const profileData = await getProfile();
            setProfile(profileData);
            
            // Update user state with profile data
            setUser(prev => ({
                ...prev,
                name: profileData.firstName && profileData.lastName 
                    ? `${profileData.firstName} ${profileData.lastName}` 
                    : prev.name,
                about: profileData.bio || prev.about,
                location: profileData.location || prev.location,
                avatar: profileData.avatarUrl || prev.avatar,
            }));
        } catch (err: any) {
            console.error('Profile load error:', err);
            setError(err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    // Form states for adding new entries
    const [newSkill, setNewSkill] = useState('');
    const [isAddingExperience, setIsAddingExperience] = useState(false);
    const [newExperience, setNewExperience] = useState({ title: '', company: '', period: '', description: '' });
    const [isAddingEducation, setIsAddingEducation] = useState(false);
    const [newEducation, setNewEducation] = useState({ institution: '', degree: '', fieldOfStudy: '', graduationYear: '' });

    const handleSave = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Split name into first and last name
            const nameParts = user.name.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            // Prepare profile update data matching your backend structure
            const profileUpdateData: ProfileUpdateRequest = {
                firstName: firstName,
                lastName: lastName,
                bio: user.about,
                location: user.location,
                avatarUrl: user.avatar,
                // Add phone if available
                phone: user.phone || undefined,
            };
            
            console.log('Sending profile update:', profileUpdateData);
            
            await updateProfile(profileUpdateData);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            console.error('Profile update error:', err);
            setError(err.message || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleCancel = () => {
        // Reload profile to reset changes
        loadProfile();
        setUser(prev => ({
            ...initialUser,
            skills: initialUser.skills || [],
            experience: initialUser.experience || [],
            education: initialUser.education || [],
            about: initialUser.about || '',
            location: initialUser.location || '',
            headline: initialUser.headline || '',
            portfolioUrl: initialUser.portfolioUrl || '',
            avatar: initialUser.avatar || 'https://picsum.photos/seed/default/200/200',
            name: initialUser.name || 'User'
        }));
        setIsEditing(false);
        setIsAddingExperience(false);
        setIsAddingEducation(false);
        setError(null);
        setSuccess(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: name === 'yearsOfExperience' ? (value === '' ? undefined : Number(value)) : value }));
    };

    const handleAddSkill = () => {
        if (newSkill.trim() && !(user.skills || []).includes(newSkill.trim())) {
            setUser(prev => ({ ...prev, skills: [...(prev.skills || []), newSkill.trim()] }));
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setUser(prev => ({ ...prev, skills: (prev.skills || []).filter(skill => skill !== skillToRemove) }));
    };

    const handleAddExperience = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUser(prev => ({...prev, experience: [newExperience, ...(prev.experience || [])]}));
        setNewExperience({ title: '', company: '', period: '', description: '' });
        setIsAddingExperience(false);
    };
    
    const handleRemoveExperience = (indexToRemove: number) => {
        setUser(prev => ({...prev, experience: (prev.experience || []).filter((_, index) => index !== indexToRemove)}));
    };

    const handleAddEducation = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUser(prev => ({...prev, education: [newEducation, ...(prev.education || [])]}));
        setNewEducation({ institution: '', degree: '', fieldOfStudy: '', graduationYear: '' });
        setIsAddingEducation(false);
    };
    
    const handleRemoveEducation = (indexToRemove: number) => {
        setUser(prev => ({...prev, education: (prev.education || []).filter((_, index) => index !== indexToRemove)}));
    };


    return (
        <div className="space-y-8">
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-600">{success}</p>
                </div>
            )}

            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-20 h-20 rounded-full ring-4 ring-white shadow-lg"
                            />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-dark">{user.name}</h1>
                            <p className="text-lg text-gray-600 mt-1">{user.headline}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {user.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {user.yearsOfExperience} years experience
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-3 text-sm bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-6 py-3 text-sm bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-3 text-sm bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                            >
                                <PencilIcon className="w-4 h-4" />
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Profile completion indicator */}
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                        <span className="text-sm text-gray-500">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Add your portfolio URL to reach 100%</p>
                </div>
            </div>

            {/* Enhanced Your Information Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-dark">Your Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Professional Headline</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="headline"
                                value={user.headline}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                placeholder="e.g., Senior Frontend Developer"
                            />
                        ) : (
                            <p className="text-gray-900 font-medium text-lg">{user.headline}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Location</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="location"
                                value={user.location}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                placeholder="e.g., San Francisco, CA"
                            />
                        ) : (
                            <p className="text-gray-900 flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {user.location}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Years of Experience</label>
                        {isEditing ? (
                            <input
                                type="number"
                                name="yearsOfExperience"
                                value={user.yearsOfExperience || ''}
                                onChange={handleChange}
                                min="0"
                                max="50"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                placeholder="e.g., 5"
                            />
                        ) : (
                            <p className="text-gray-900 flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {user.yearsOfExperience} years
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Portfolio Website</label>
                        {isEditing ? (
                            <input
                                type="url"
                                name="portfolioUrl"
                                value={user.portfolioUrl || ''}
                                onChange={handleChange}
                                placeholder="https://your-portfolio.com"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                            />
                        ) : (
                            user.portfolioUrl ? (
                                <a
                                    href={user.portfolioUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary-dark flex items-center gap-2 group"
                                >
                                    <LinkIcon className="w-4 h-4" />
                                    <span className="underline decoration-1 underline-offset-2">{user.portfolioUrl}</span>
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            ) : (
                                <p className="text-gray-400 italic flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    Not provided
                                </p>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-neutral-dark mb-4">About</h2>
                {isEditing ? (
                    <textarea 
                        name="about"
                        value={user.about}
                        onChange={handleChange}
                        rows={5}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                    />
                ) : (
                    <p className="text-gray-600 leading-relaxed">{user.about}</p>
                )}
            </div>
            
            {/* Skills Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-neutral-dark mb-4">Skills</h2>
                
                {/* Verified Skills */}
                {user.completedAssessments && user.completedAssessments.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-neutral-dark mb-3">Verified Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {user.completedAssessments.map(assessment => (
                                <span key={assessment.assessmentId} className="bg-accent/10 text-accent-700 text-sm font-medium px-3 py-1.5 rounded-full flex items-center gap-2">
                                    <CheckBadgeIcon className="w-5 h-5" />
                                    {assessment.title}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Other Skills */}
                <div>
                    {user.completedAssessments && user.completedAssessments.length > 0 && <h3 className="text-lg font-semibold text-neutral-dark mb-3">Other Skills</h3>}
                    {isEditing && (
                        <div className="flex gap-2 mb-4">
                            <input 
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                placeholder="Add a new skill"
                                className="flex-grow border border-gray-300 rounded-md p-2"
                            />
                            <button onClick={handleAddSkill} className="px-4 py-2 bg-primary text-white rounded-md font-semibold">Add</button>
                        </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                        {(user.skills || []).map(skill => (
                            <span key={skill} className="bg-blue-100 text-primary text-sm font-medium px-3 py-1.5 rounded-full flex items-center gap-2">
                                {skill}
                                {isEditing && (
                                    <button onClick={() => handleRemoveSkill(skill)} className="text-primary hover:text-blue-700">
                                        <XMarkIcon className="w-3 h-3"/>
                                    </button>
                                )}
                            </span>
                        ))}
                        {(!user.skills || user.skills.length === 0) && !isEditing && (
                            <p className="text-gray-400 italic">No skills added yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-neutral-dark">Experience</h2>
                    {isEditing && !isAddingExperience && <button onClick={() => setIsAddingExperience(true)} className="flex items-center text-sm text-primary font-medium hover:underline"><PlusIcon className="w-4 h-4 mr-1"/> Add Experience</button>}
                 </div>
                {isEditing && isAddingExperience && (
                    <form onSubmit={handleAddExperience} className="mb-6 p-4 border rounded-md bg-neutral-light space-y-3">
                        <input type="text" placeholder="Job Title" value={newExperience.title} onChange={e => setNewExperience({...newExperience, title: e.target.value})} required className="w-full border border-gray-300 rounded-md p-2"/>
                        <input type="text" placeholder="Company" value={newExperience.company} onChange={e => setNewExperience({...newExperience, company: e.target.value})} required className="w-full border border-gray-300 rounded-md p-2"/>
                        <input type="text" placeholder="Period (e.g., Jan 2021 - Present)" value={newExperience.period} onChange={e => setNewExperience({...newExperience, period: e.target.value})} required className="w-full border border-gray-300 rounded-md p-2"/>
                        <textarea placeholder="Description" value={newExperience.description} onChange={e => setNewExperience({...newExperience, description: e.target.value})} rows={3} className="w-full border border-gray-300 rounded-md p-2"/>
                        <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => setIsAddingExperience(false)} className="px-3 py-1 text-sm bg-gray-200 rounded-md">Cancel</button>
                            <button type="submit" className="px-3 py-1 text-sm bg-primary text-white rounded-md">Add</button>
                        </div>
                    </form>
                )}
                <div className="space-y-6">
                    {(user.experience || []).map((exp, index) => (
                        <div key={index} className="flex gap-4 group">
                            <div className="w-12 h-12 bg-neutral-light rounded-lg flex items-center justify-center flex-shrink-0">
                                <BriefcaseIcon className="w-6 h-6 text-primary"/>
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-bold text-neutral-dark">{exp.title}</h3>
                                <p className="text-gray-600 font-medium">{exp.company}</p>
                                <p className="text-sm text-gray-400">{exp.period}</p>
                                <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                            </div>
                            {isEditing && (
                                <button onClick={() => handleRemoveExperience(index)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-alert transition-opacity">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            )}
                        </div>
                    ))}
                    {(!user.experience || user.experience.length === 0) && !isEditing && (
                        <p className="text-gray-400 italic">No experience added yet</p>
                    )}
                </div>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-neutral-dark">Education</h2>
                    {isEditing && !isAddingEducation && (
                    <button onClick={() => setIsAddingEducation(true)} className="flex items-center text-sm text-primary font-medium hover:underline">
                        <PlusIcon className="w-4 h-4 mr-1"/> Add Education
                    </button>
                    )}
                </div>
                {isEditing && isAddingEducation && (
                    <form onSubmit={handleAddEducation} className="mb-6 p-4 border rounded-md bg-neutral-light space-y-3">
                        <input type="text" placeholder="Institution" value={newEducation.institution} onChange={e => setNewEducation({...newEducation, institution: e.target.value})} required className="w-full border border-gray-300 rounded-md p-2"/>
                        <input type="text" placeholder="Degree (e.g., B.S. in Computer Science)" value={newEducation.degree} onChange={e => setNewEducation({...newEducation, degree: e.target.value})} required className="w-full border border-gray-300 rounded-md p-2"/>
                        <input type="text" placeholder="Field of Study" value={newEducation.fieldOfStudy} onChange={e => setNewEducation({...newEducation, fieldOfStudy: e.target.value})} required className="w-full border border-gray-300 rounded-md p-2"/>
                        <input type="text" placeholder="Graduation Year" value={newEducation.graduationYear} onChange={e => setNewEducation({...newEducation, graduationYear: e.target.value})} required className="w-full border border-gray-300 rounded-md p-2"/>
                        <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => setIsAddingEducation(false)} className="px-3 py-1 text-sm bg-gray-200 rounded-md">Cancel</button>
                            <button type="submit" className="px-3 py-1 text-sm bg-primary text-white rounded-md">Add</button>
                        </div>
                    </form>
                )}
                <div className="space-y-6">
                    {(user.education || []).map((edu, index) => (
                        <div key={index} className="flex gap-4 group">
                            <div className="w-12 h-12 bg-neutral-light rounded-lg flex items-center justify-center flex-shrink-0">
                                <AcademicCapIcon className="w-6 h-6 text-primary"/>
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-bold text-neutral-dark">{edu.institution}</h3>
                                <p className="text-gray-600 font-medium">{edu.degree}</p>
                                <p className="text-sm text-gray-400">{edu.fieldOfStudy} &middot; {edu.graduationYear}</p>
                            </div>
                            {isEditing && (
                                <button onClick={() => handleRemoveEducation(index)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-alert transition-opacity">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            )}
                        </div>
                    ))}
                    {(!user.education || user.education.length === 0) && !isEditing && (
                        <p className="text-gray-400 italic">No education added yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProfile;