

import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Job, InterviewQuestion } from '../../types';
import { MicrophoneIcon } from '../icons/MicrophoneIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';

interface InterviewPracticeProps {
  appliedJobs: Job[];
  savedJobs: Job[];
  jobToPractice?: Job | null;
  onPracticeHandled?: () => void;
}

type SessionState = 'idle' | 'selecting_job' | 'generating_questions' | 'in_progress' | 'getting_feedback' | 'finished';

const InterviewPractice: React.FC<InterviewPracticeProps> = ({ appliedJobs, savedJobs, jobToPractice, onPracticeHandled }) => {
    const [sessionState, setSessionState] = useState<SessionState>('idle');
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<string[]>([]);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [error, setError] = useState<string | null>(null);

    const practiceJobs = useMemo(() => {
        const allJobs = [...appliedJobs, ...savedJobs];
        const uniqueJobs = Array.from(new Map(allJobs.map(job => [job.id, job])).values());
        return uniqueJobs;
    }, [appliedJobs, savedJobs]);

    useEffect(() => {
        if (jobToPractice && sessionState === 'idle') {
            handleStartSession(jobToPractice);
            if (onPracticeHandled) {
                onPracticeHandled();
            }
        }
    }, [jobToPractice, sessionState, onPracticeHandled]);

    const handleStartSession = async (job: Job) => {
        setSelectedJob(job);
        setSessionState('generating_questions');
        setError(null);
        setQuestions([]);
        setUserAnswers([]);
        setFeedback([]);
        setCurrentQuestionIndex(0);

        try {
            const apiKey = process.env.API_KEY;
            if (!apiKey) throw new Error("API Key is missing.");
            const ai = new GoogleGenAI({ apiKey });

            const prompt = `You are an expert hiring manager. For the job title "${job.title}", generate a JSON array of 5 diverse interview questions. Include 3 behavioral questions and 2 technical questions relevant to this role. The output must be a valid JSON array of objects, where each object has a 'type' ('behavioral' or 'technical') and a 'question' string.`;
            const responseSchema = {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        type: { type: Type.STRING },
                        question: { type: Type.STRING }
                    },
                    required: ['type', 'question']
                }
            };
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: 'application/json', responseSchema }
            });

            const parsedQuestions = JSON.parse(response.text);
            setQuestions(parsedQuestions);
            setSessionState('in_progress');
        } catch (e) {
            console.error(e);
            setError("Sorry, couldn't generate questions. Please try again.");
            setSessionState('selecting_job');
        }
    };

    const handleAnswerSubmit = async () => {
        setSessionState('getting_feedback');
        const updatedAnswers = [...userAnswers];
        updatedAnswers[currentQuestionIndex] = currentAnswer;
        setUserAnswers(updatedAnswers);
        
        try {
            const apiKey = process.env.API_KEY;
            if (!apiKey) throw new Error("API Key is missing.");
            const ai = new GoogleGenAI({ apiKey });

            const prompt = `You are a friendly and constructive interview coach. The user is practicing for a '${selectedJob?.title}' position.
            Question: "${questions[currentQuestionIndex].question}"
            User's Answer: "${currentAnswer}"
            Provide feedback on their answer. Structure your response in Markdown with two sections: "### What Went Well" and "### Areas for Improvement". Keep feedback concise, encouraging, and provide one actionable tip.`;

            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            const updatedFeedback = [...feedback];
            updatedFeedback[currentQuestionIndex] = response.text;
            setFeedback(updatedFeedback);
            setSessionState('in_progress');
        } catch (e) {
            console.error(e);
            const updatedFeedback = [...feedback];
            updatedFeedback[currentQuestionIndex] = "Sorry, I couldn't generate feedback for this answer right now.";
            setFeedback(updatedFeedback);
            setSessionState('in_progress');
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setCurrentAnswer('');
        } else {
            setSessionState('finished');
        }
    };

    const resetSession = () => {
        setSessionState('idle');
        setSelectedJob(null);
    };

    const renderContent = () => {
        switch (sessionState) {
            case 'idle':
                return (
                    <div className="text-center">
                        <MicrophoneIcon className="w-16 h-16 mx-auto text-primary" />
                        <h2 className="mt-4 text-2xl font-bold text-neutral-dark">Practice Your Interview Skills</h2>
                        <p className="mt-2 max-w-lg mx-auto text-gray-600">Prepare for your next interview with an AI-powered mock session. Get role-specific questions and receive instant feedback on your answers.</p>
                        <button onClick={() => setSessionState('selecting_job')} className="mt-6 px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">Start a New Session</button>
                    </div>
                );

            case 'selecting_job':
                return (
                    <div>
                        <h2 className="text-xl font-bold text-center mb-4">Select a Job to Practice For</h2>
                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                        <div className="max-h-96 overflow-y-auto space-y-2">
                            {practiceJobs.map(job => (
                                <button key={job.id} onClick={() => handleStartSession(job)} className="w-full text-left p-4 bg-white border rounded-lg hover:bg-blue-50 hover:border-primary transition-all flex items-start gap-4">
                                    <img src={job.logo} alt={job.company} className="w-10 h-10 rounded-md"/>
                                    <div>
                                        <p className="font-bold text-neutral-dark">{job.title}</p>
                                        <p className="text-sm text-gray-500">{job.company}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="text-center mt-4">
                            <button onClick={resetSession} className="text-sm text-gray-500 hover:underline">Cancel</button>
                        </div>
                    </div>
                );
            
            case 'generating_questions':
                return (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-gray-600">Generating questions for {selectedJob?.title}...</p>
                    </div>
                );

            case 'in_progress':
            case 'getting_feedback':
                const currentQ = questions[currentQuestionIndex];
                const hasFeedback = feedback[currentQuestionIndex];
                return (
                    <div>
                        <div className="mb-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                            </div>
                            <p className="text-sm text-right text-gray-500 mt-1">Question {currentQuestionIndex + 1} of {questions.length}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <span className="text-xs font-semibold text-primary uppercase">{currentQ.type} Question</span>
                            <p className="font-semibold text-lg text-neutral-dark mt-1">{currentQ.question}</p>
                        </div>
                        <div className="mt-4">
                            <textarea
                                value={currentAnswer}
                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                placeholder="Type your answer here..."
                                rows={6}
                                className="w-full border-gray-300 rounded-md shadow-sm p-2"
                                disabled={sessionState === 'getting_feedback' || !!hasFeedback}
                            />
                        </div>
                        {!hasFeedback && (
                            <div className="text-right mt-4">
                                <button onClick={handleAnswerSubmit} disabled={!currentAnswer.trim() || sessionState === 'getting_feedback'} className="px-5 py-2 bg-primary text-white rounded-md font-semibold disabled:bg-gray-400">
                                    {sessionState === 'getting_feedback' ? 'Getting Feedback...' : 'Submit Answer'}
                                </button>
                            </div>
                        )}
                        {hasFeedback && (
                             <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                                <h3 className="font-bold text-green-800 flex items-center gap-2"><SparklesIcon className="w-5 h-5"/> AI Feedback</h3>
                                <div className="prose prose-sm max-w-none mt-2 text-gray-700" dangerouslySetInnerHTML={{ __html: feedback[currentQuestionIndex].replace(/###/g, '<strong>').replace(/\n/g, '<br />') }} />
                                <div className="text-right mt-2">
                                    <button onClick={handleNextQuestion} className="px-5 py-2 bg-secondary text-white rounded-md font-semibold">
                                        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Session'}
                                    </button>
                                </div>
                             </div>
                        )}
                    </div>
                );
            case 'finished':
                return (
                    <div>
                        <div className="text-center pb-6 border-b">
                            <h2 className="text-2xl font-bold text-neutral-dark">Mock Interview Complete!</h2>
                            <p className="text-gray-600">You practiced for the {selectedJob?.title} role.</p>
                        </div>
                        <div className="space-y-6 py-6 max-h-[50vh] overflow-y-auto">
                            {questions.map((q, index) => (
                                <div key={index}>
                                    <p className="font-semibold text-neutral-dark">{index + 1}. {q.question}</p>
                                    <div className="mt-2 pl-4 border-l-2">
                                        <p className="text-sm text-gray-600 italic">Your Answer: "{userAnswers[index]}"</p>
                                        <div className="mt-2 p-3 bg-green-50 rounded-r-lg text-sm prose prose-sm" dangerouslySetInnerHTML={{ __html: feedback[index].replace(/###/g, '<strong>').replace(/\n/g, '<br />') }}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                         <div className="text-center mt-6 pt-6 border-t">
                            <button onClick={resetSession} className="px-6 py-2 bg-primary text-white font-semibold rounded-md">Start New Session</button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 min-h-[60vh] flex flex-col justify-center relative">
             {sessionState !== 'idle' && sessionState !== 'finished' && (
                <button onClick={resetSession} className="absolute top-6 right-6 text-sm text-gray-500 hover:underline flex items-center gap-1">
                   <ArrowLeftIcon className="w-4 h-4" /> Back to start
                </button>
            )}
            {renderContent()}
             <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default InterviewPractice;