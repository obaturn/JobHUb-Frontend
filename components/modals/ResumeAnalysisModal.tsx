import React from 'react';
import { XMarkIcon } from '../icons/XMarkIcon';
import { SparklesIcon } from '../icons/SparklesIcon';

interface ResumeAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeFileName: string;
  analysisResult: string | null;
  isLoading: boolean;
  error: string | null;
}

const FormattedAnalysis: React.FC<{ text: string }> = ({ text }) => {
    // Split by sections, keeping the titles
    const sections = text.split(/(\*\*[\w\s]+:\*\*)/).filter(Boolean);
    const content = [];

    for (let i = 0; i < sections.length; i += 2) {
        const title = sections[i];
        const listItems = sections[i + 1];
        if (title && listItems) {
            content.push({
                title: title.replace(/\*\*/g, ''),
                items: listItems.split('*').map(item => item.trim()).filter(Boolean)
            });
        }
    }

    if (content.length === 0) {
        return <p>{text}</p>;
    }

    return (
        <div className="space-y-4">
            {content.map((section, index) => (
                <div key={index}>
                    <h4 className="font-bold text-neutral-dark mb-2">{section.title}</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        {section.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
                    </ul>
                </div>
            ))}
        </div>
    );
};


const ResumeAnalysisModal: React.FC<ResumeAnalysisModalProps> = ({
  isOpen,
  onClose,
  resumeFileName,
  analysisResult,
  isLoading,
  error,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl relative transform transition-all animate-slide-up flex flex-col max-h-[80vh]">
        <div className="p-6 border-b flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-neutral-dark flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-primary"/>
                    AI Resume Analysis
                </h2>
                <p className="text-sm text-gray-500 mt-1">Feedback for: {resumeFileName}</p>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-6 h-6" />
            </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
            {isLoading && (
                <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Analyzing your resume...</p>
                    <p className="text-sm text-gray-400">This may take a moment.</p>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    <h4 className="font-bold">Analysis Failed</h4>
                    <p className="text-sm">{error}</p>
                </div>
            )}
            
            {!isLoading && analysisResult && (
                <div className="prose prose-sm max-w-none">
                    <FormattedAnalysis text={analysisResult} />
                </div>
            )}
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

export default ResumeAnalysisModal;