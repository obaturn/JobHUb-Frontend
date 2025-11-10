import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { CareerPath } from '../../types';
import { SparklesIcon } from '../icons/SparklesIcon';
import { LightBulbIcon } from '../icons/LightBulbIcon';
import { ArrowTrendingUpIcon } from '../icons/ArrowTrendingUpIcon';

const CareerPathExplorer: React.FC = () => {
    const [jobTitle, setJobTitle] = useState('');
    const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleExplore = async () => {
        if (!jobTitle.trim()) {
            setError("Please enter a job title to explore.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const apiKey = process.env.API_KEY;
            if (!apiKey) throw new Error("API Key is missing.");

            const ai = new GoogleGenAI({ apiKey });

            const prompt = `You are a career development expert and AI assistant for JobHub. Your task is to generate potential career paths for a given job title. Based on the job title "${jobTitle}", provide 3 distinct and common career progression paths. For each path, provide a descriptive name (e.g., "Technical Leadership Path"). For each path, list 2 sequential job roles a person might take. For each role, provide a brief description and a list of key skills to acquire. You MUST output the response as a valid JSON object. Do not include any text, notes, or formatting outside of the JSON object.`;

            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    paths: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                path_name: { type: Type.STRING },
                                steps: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            title: { type: Type.STRING },
                                            description: { type: Type.STRING },
                                            skills_to_acquire: {
                                                type: Type.ARRAY,
                                                items: { type: Type.STRING }
                                            }
                                        },
                                        required: ['title', 'description', 'skills_to_acquire']
                                    }
                                }
                            },
                            required: ['path_name', 'steps']
                        }
                    }
                },
                required: ['paths']
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema,
                }
            });

            const parsedResponse = JSON.parse(response.text);
            setCareerPaths(parsedResponse.paths);

        } catch (e) {
            console.error("Failed to fetch career paths:", e);
            setError("Sorry, we couldn't generate career paths right now. The model might be busy. Please try again later.");
            setCareerPaths([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                        <ArrowTrendingUpIcon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-dark">Career Path Explorer</h1>
                        <p className="text-gray-500 mt-1">Discover potential career progressions for your current role.</p>
                    </div>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g., Junior Frontend Developer"
                        className="flex-grow w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        onClick={handleExplore}
                        disabled={isLoading}
                        className="w-full sm:w-auto px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoading ? 'Exploring...' : 'Explore Paths'}
                    </button>
                </div>
            </div>

            {isLoading && (
                <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Generating career paths with AI...</p>
                </div>
            )}

            {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">{error}</div>}

            {!isLoading && hasSearched && careerPaths.length > 0 && (
                <div className="space-y-8">
                    <h2 className="text-xl font-bold text-neutral-dark">Potential Paths for a {jobTitle}</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {careerPaths.map((path, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col">
                                <div className="p-4 bg-neutral-light border-b rounded-t-lg">
                                    <h3 className="font-bold text-lg text-primary text-center">{path.path_name}</h3>
                                </div>
                                <div className="p-4 space-y-4 flex-grow">
                                    {path.steps.map((step, stepIndex) => (
                                        <div key={stepIndex}>
                                            <h4 className="font-semibold text-neutral-dark">{step.title}</h4>
                                            <p className="text-sm text-gray-600 mt-1 mb-2">{step.description}</p>
                                            <h5 className="text-sm font-semibold text-gray-700">Skills to Acquire:</h5>
                                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                {step.skills_to_acquire.map(skill => (
                                                    <span key={skill} className="text-xs bg-blue-100 text-primary font-medium px-2 py-1 rounded-md">{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
             {!isLoading && hasSearched && careerPaths.length === 0 && !error && (
                 <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <h3 className="text-xl font-bold text-neutral-dark">No Paths Generated</h3>
                    <p className="text-gray-600 mt-2">The AI couldn't generate paths for "{jobTitle}". Please try a different or more common job title.</p>
                </div>
            )}

            {!hasSearched && !isLoading && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center border-2 border-dashed">
                    <LightBulbIcon className="w-12 h-12 mx-auto text-yellow-400" />
                    <h3 className="text-xl font-bold text-neutral-dark mt-4">Ready to Discover Your Future?</h3>
                    <p className="text-gray-600 mt-2 max-w-md mx-auto">Enter your current job title above to see where your career could take you. Get insights into next steps, promotions, and the skills you'll need to succeed.</p>
                </div>
            )}
        </div>
    );
};

export default CareerPathExplorer;
