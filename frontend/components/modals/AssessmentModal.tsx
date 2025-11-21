import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { SkillAssessment, AssessmentQuestion, CompletedAssessment } from '../../types';
import { XMarkIcon } from '../icons/XMarkIcon';
import { AcademicCapIcon } from '../icons/AcademicCapIcon';
import { CheckBadgeIcon } from '../icons/CheckBadgeIcon';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';

interface AssessmentModalProps {
  assessment: SkillAssessment;
  onClose: () => void;
  onComplete: (completedAssessment: CompletedAssessment) => void;
}

const AssessmentModal: React.FC<AssessmentModalProps> = ({ assessment, onClose, onComplete }) => {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) throw new Error("API Key is missing.");
        
        const ai = new GoogleGenAI({ apiKey });
        
        const prompt = `
            You are an AI that generates educational content. 
            Create a ${assessment.questionCount}-question multiple-choice quiz about ${assessment.topic}. 
            The questions should assess an intermediate level of knowledge.
            For each question, provide 4 options and clearly indicate the correct answer.
            You MUST output the response as a valid JSON array of objects. Do not include any text or formatting outside of the JSON array.
        `;
        
        const responseSchema = {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING }
            },
            required: ['question', 'options', 'correctAnswer']
          }
        };

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
          }
        });
        
        const parsedResponse = JSON.parse(response.text);
        setQuestions(parsedResponse);
        setUserAnswers(new Array(parsedResponse.length).fill(null));

      } catch (e) {
        console.error("Failed to fetch questions:", e);
        setError("Sorry, we couldn't generate the assessment questions right now. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [assessment]);

  const handleNext = () => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setUserAnswers(newAnswers);
    setSelectedOption(null);
    setCurrentQuestionIndex(prev => prev + 1);
  };
  
  const handleSubmit = () => {
    const finalAnswers = [...userAnswers];
    finalAnswers[currentQuestionIndex] = selectedOption;
    
    let correctAnswers = 0;
    questions.forEach((q, index) => {
        if(finalAnswers[index] === q.correctAnswer) {
            correctAnswers++;
        }
    });
    
    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);
    setIsSubmitted(true);
    
    if (finalScore >= 70) {
        onComplete({
            assessmentId: assessment.id,
            title: assessment.title,
            score: finalScore,
            dateCompleted: new Date().toISOString().split('T')[0]
        });
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const passed = score >= 70;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl relative transform transition-all animate-slide-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-neutral-dark flex items-center gap-2">
                    <AcademicCapIcon className="w-6 h-6 text-primary"/>
                    {assessment.title} Assessment
                </h2>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-6 h-6" />
            </button>
        </div>
        
        {/* Content */}
        <div className="p-8 overflow-y-auto">
            {isLoading && <div className="text-center py-12">Loading...</div>}
            {error && <div className="text-center py-12 text-alert">{error}</div>}
            
            {!isLoading && !error && !isSubmitted && currentQuestion && (
                <div>
                    <p className="text-sm text-gray-500 mb-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
                    <h3 className="text-lg font-semibold text-neutral-dark mb-6">{currentQuestion.question}</h3>
                    <div className="space-y-3">
                        {currentQuestion.options.map(option => (
                            <button
                                key={option}
                                onClick={() => setSelectedOption(option)}
                                className={`w-full text-left p-4 border rounded-lg transition-all duration-200 ${selectedOption === option ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white hover:bg-blue-50 border-gray-300'}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {!isLoading && !error && isSubmitted && (
                 <div className="text-center">
                    <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
                         {passed ? <CheckBadgeIcon className="w-12 h-12 text-green-500" /> : <XMarkIcon className="w-12 h-12 text-red-500" />}
                    </div>
                    <h2 className="text-3xl font-bold text-neutral-dark">Assessment Complete</h2>
                    <p className="text-lg text-gray-600 mt-2">Your score: <span className={`font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>{score}%</span></p>
                    {passed ? (
                        <p className="mt-4 max-w-md mx-auto">Congratulations! You've passed and earned the <span className="font-semibold">{assessment.title}</span> badge. It has been added to your profile.</p>
                    ) : (
                        <p className="mt-4 max-w-md mx-auto">You did not pass this time. A score of 70% or higher is required. Feel free to review the topic and try again later.</p>
                    )}
                </div>
            )}
        </div>
        
        {/* Footer */}
        {!isLoading && !error && (
            <div className="p-4 bg-gray-50 border-t flex justify-between items-center rounded-b-lg">
                {!isSubmitted ? (
                    <>
                        <p className="text-sm text-gray-500">Select an answer to continue.</p>
                        {currentQuestionIndex < questions.length - 1 ? (
                            <button onClick={handleNext} disabled={!selectedOption} className="px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400">Next</button>
                        ) : (
                             <button onClick={handleSubmit} disabled={!selectedOption} className="px-6 py-2 bg-accent text-white font-semibold rounded-md hover:bg-green-600 disabled:bg-gray-400">Submit</button>
                        )}
                    </>
                ) : (
                    <button onClick={onClose} className="w-full px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-blue-700">Close</button>
                )}
            </div>
        )}
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

export default AssessmentModal;
