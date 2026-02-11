import React from 'react';

interface EmployerApplicationsProps {
  applications: any[];
  selectedJobId: number | null;
  jobs: any[];
  onBack: () => void;
}

const EmployerApplications: React.FC<EmployerApplicationsProps> = ({ 
  applications, 
  selectedJobId, 
  jobs,
  onBack 
}) => {
    const selectedJob = jobs.find(j => j.id === selectedJobId);

    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-dark">Applications</h1>
                        {selectedJob && (
                            <p className="text-gray-500 mt-1">
                                For: {selectedJob.title} at {selectedJob.company}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onBack}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        ← Back to Jobs
                    </button>
                </div>
            </div>
            
            <div className="p-6">
                {applications.length > 0 ? (
                    <div className="space-y-4">
                        {applications.map(app => (
                            <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="font-semibold text-neutral-dark">Applicant ID: {app.userId}</p>
                        <p className="text-sm text-gray-600 mt-1">
                                            Applied: {new Date(app.appliedDate).toLocaleDateString()}
                                        </p>
                                        {app.coverLetter && (
                                            <p className="text-sm text-gray-700 mt-2">{app.coverLetter}</p>
                                        )}
                                    </div>
                                    
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                        app.status === 'APPLIED' ? 'bg-blue-100 text-blue-800' :
                                        app.status === 'RESUME_VIEWED' ? 'bg-cyan-100 text-cyan-800' :
                                        app.status === 'IN_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                                        app.status === 'SHORTLISTED' ? 'bg-purple-100 text-purple-800' :
                                        app.status === 'INTERVIEW' ? 'bg-indigo-100 text-indigo-800' :
                                        app.status === 'OFFERED' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {app.status}
                                    </span>
                                </div>
                                
                                <div className="flex gap-2 mt-4">
                                    <button className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded text-sm font-medium hover:bg-yellow-100">
                                        Review
                                    </button>
                                    <button className="px-3 py-1 bg-purple-50 text-purple-700 rounded text-sm font-medium hover:bg-purple-100">
                                        Shortlist
                                    </button>
                                    <button className="px-3 py-1 bg-green-50 text-green-700 rounded text-sm font-medium hover:bg-green-100">
                                        Interview
                                    </button>
                                    <button className="px-3 py-1 bg-red-50 text-red-700 rounded text-sm font-medium hover:bg-red-100">
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>No applications yet for this job.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployerApplications;
