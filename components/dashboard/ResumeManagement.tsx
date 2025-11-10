import React, { useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Resume } from '../../types';
import { MOCK_RESUME_TEXT } from '../../constants';
import { PlusIcon } from '../icons/PlusIcon';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';
import { CheckBadgeIcon } from '../icons/CheckBadgeIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { DocumentDuplicateIcon } from '../icons/DocumentDuplicateIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import ResumeAnalysisModal from '../modals/ResumeAnalysisModal';

interface ResumeManagementProps {
  resumes: Resume[];
  onUpload: (fileName: string, fileContent: string) => void;
  onDelete: (resumeId: string) => void;
  onSetPrimary: (resumeId: string) => void;
}

const ResumeManagement: React.FC<ResumeManagementProps> = ({ resumes, onUpload, onDelete, onSetPrimary }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            let fileContent = text;
            
            // For this demo, we can only read .txt files. For others, use mock text.
            if (file.type !== 'text/plain') {
                alert(`Note: We can't read content from '${file.type}' files directly in this demo. The AI will analyze your resume using standard placeholder text, but we've saved your file name "${file.name}".`);
                fileContent = MOCK_RESUME_TEXT; // Use mock text for non-txt files
            }
            onUpload(file.name, fileContent);
        };
        reader.onerror = () => {
            alert('Failed to read file.');
        };
        // Read any file as text. If it's binary (like PDF), it will be gibberish,
        // but the type check above will catch it and substitute mock text.
        reader.readAsText(file);
    }
    // Reset file input to allow re-uploading the same file
    if(event.target) {
        event.target.value = '';
    }
  };

  const handleAnalyzeResume = async (resume: Resume) => {
    setSelectedResume(resume);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API Key is missing. Cannot perform analysis.");
      }
      const ai = new GoogleGenAI({ apiKey });

      const resumeTextToAnalyze = resume.textContent || MOCK_RESUME_TEXT;

      const prompt = `
        You are an expert career coach and resume writer reviewing a resume for a software developer. 
        Analyze the following resume text and provide feedback. The feedback should be concise, helpful, and encouraging.
        Structure your response in three sections using Markdown:

        **Strengths:**
        * List 2-3 key strengths of the resume.

        **Areas for Improvement:**
        * List 2-3 specific areas that could be improved to better pass through an Applicant Tracking System (ATS) and appeal to recruiters.

        **Actionable Suggestions:**
        * Provide 3-5 concrete, actionable suggestions for improvement. For example, 'Quantify your achievements in the 'Experience' section with metrics (e.g., 'improved performance by 15%')' or 'Add a professional summary at the top to highlight your key qualifications'.

        Here is the resume:
        ---
        ${resumeTextToAnalyze}
      `;

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
      });

      setAnalysisResult(response.text);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during analysis.";
      setAnalysisError(`Sorry, I couldn't analyze the resume. ${errorMessage}`);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const closeModal = () => {
    setSelectedResume(null);
    setAnalysisResult(null);
    setAnalysisError(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-dark">Resume Management</h1>
            <p className="text-gray-500 mt-1">Manage your uploaded resumes and select a primary one for applications.</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".txt,.pdf,.docx"
          />
          <button 
            onClick={handleUploadClick}
            className="w-full sm:w-auto px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <PlusIcon className="w-5 h-5" />
            Upload New Resume
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {resumes.length > 0 ? (
            resumes.map(resume => (
              <div key={resume.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50">
                <div className="flex items-center gap-4 flex-grow">
                  <DocumentTextIcon className="w-8 h-8 text-primary flex-shrink-0" />
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-neutral-dark truncate" title={resume.fileName}>{resume.fileName}</p>
                    <p className="text-sm text-gray-500">Uploaded on {new Date(resume.uploadDate).toLocaleDateString()}</p>
                  </div>
                  {resume.isPrimary && (
                    <span className="flex-shrink-0 flex items-center gap-1 text-sm bg-green-100 text-green-800 font-semibold px-3 py-1 rounded-full">
                      <CheckBadgeIcon className="w-4 h-4" />
                      Primary
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <button
                    onClick={() => handleAnalyzeResume(resume)}
                    className="px-3 py-1.5 text-sm border border-secondary text-secondary rounded-md hover:bg-teal-50 transition-colors flex items-center gap-1.5"
                  >
                    <SparklesIcon className="w-4 h-4"/>
                    Analyze with AI
                  </button>
                  {!resume.isPrimary && (
                    <button 
                      onClick={() => onSetPrimary(resume.id)}
                      className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      Set as Primary
                    </button>
                  )}
                  <button 
                      onClick={() => onDelete(resume.id)}
                      className="p-2 text-gray-500 hover:text-alert hover:bg-red-50 rounded-md transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                    <span className="sr-only">Delete</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <DocumentDuplicateIcon className="w-12 h-12 mx-auto text-gray-300" />
              <p className="mt-4 font-semibold">No resumes uploaded yet.</p>
              <p className="mt-1">Upload your resume to start applying for jobs quickly.</p>
            </div>
          )}
        </div>
      </div>

      {selectedResume && (
        <ResumeAnalysisModal 
            isOpen={!!selectedResume}
            onClose={closeModal}
            resumeFileName={selectedResume.fileName}
            analysisResult={analysisResult}
            isLoading={isAnalyzing}
            error={analysisError}
        />
      )}
    </>
  );
};

export default ResumeManagement;