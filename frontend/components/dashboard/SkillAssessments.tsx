import React, { useState } from 'react';
import { CompletedAssessment, SkillAssessment } from '../../types';
import { AVAILABLE_ASSESSMENTS } from '../../constants';
import { AcademicCapIcon } from '../icons/AcademicCapIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { CheckBadgeIcon } from '../icons/CheckBadgeIcon';
import AssessmentModal from '../modals/AssessmentModal';

interface SkillAssessmentsProps {
    completedAssessments: CompletedAssessment[];
    onCompleteAssessment: (assessment: CompletedAssessment) => void;
}

const SkillAssessments: React.FC<SkillAssessmentsProps> = ({ completedAssessments, onCompleteAssessment }) => {
    const [selectedAssessment, setSelectedAssessment] = useState<SkillAssessment | null>(null);
    
    const isAssessmentCompleted = (assessmentId: string) => {
        return completedAssessments.some(a => a.assessmentId === assessmentId);
    };

    const getCompletedAssessment = (assessmentId: string) => {
        return completedAssessments.find(a => a.assessmentId === assessmentId);
    }
    
    const handleModalClose = () => {
        setSelectedAssessment(null);
    }

    return (
        <>
            <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-neutral-dark">Skill Assessments</h1>
                    <p className="text-gray-500 mt-1">Validate your skills and earn badges to stand out to employers.</p>
                </div>
                
                {/* Completed Assessments */}
                {completedAssessments.length > 0 && (
                     <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold text-neutral-dark">Your Badges</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                            {completedAssessments.map(assessment => (
                                <div key={assessment.assessmentId} className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-4">
                                    <CheckBadgeIcon className="w-8 h-8 text-green-500 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-green-800">{assessment.title}</p>
                                        <p className="text-sm text-green-700">Score: {assessment.score}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
               
                {/* Available Assessments */}
                <div className="bg-white rounded-lg shadow-md">
                     <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-neutral-dark">Available Assessments</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {AVAILABLE_ASSESSMENTS.map(assessment => {
                            const completedVersion = getCompletedAssessment(assessment.id);
                            return (
                                <div key={assessment.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-grow">
                                        <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                                            <AcademicCapIcon className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-neutral-dark">{assessment.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{assessment.description}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                                                <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5" />{assessment.durationMinutes} min</span>
                                                <span>&bull;</span>
                                                <span>{assessment.questionCount} questions</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="self-end sm:self-center flex-shrink-0">
                                        {completedVersion ? (
                                             <button 
                                                onClick={() => setSelectedAssessment(assessment)}
                                                className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                                            >
                                                Retake
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => setSelectedAssessment(assessment)}
                                                className="px-4 py-2 text-sm bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                Start Assessment
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {selectedAssessment && (
                <AssessmentModal 
                    assessment={selectedAssessment}
                    onClose={handleModalClose}
                    onComplete={onCompleteAssessment}
                />
            )}
        </>
    );
};

export default SkillAssessments;
