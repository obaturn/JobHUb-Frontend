
import React, { useState } from 'react';
import { CompanyReview } from '../../types';
import { StarIcon } from '../icons/StarIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { XMarkIcon } from '../icons/XMarkIcon';

interface CompanyReviewsProps {
  initialReviews: CompanyReview[];
  companyId: string;
}

const StarRating: React.FC<{ rating: number; onRate?: (rating: number) => void; interactive?: boolean }> = ({ rating, onRate, interactive = false }) => (
    <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
            <button
                key={star}
                type="button"
                onClick={interactive ? () => onRate && onRate(star) : undefined}
                className={`w-6 h-6 ${interactive ? 'cursor-pointer' : ''} ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                disabled={!interactive}
                aria-label={`${star} star`}
            >
                <StarIcon solid={rating >= star} />
            </button>
        ))}
    </div>
);


const ReviewCard: React.FC<{ review: CompanyReview }> = ({ review }) => (
    <div className="border-t py-6">
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-bold text-neutral-dark">{review.title}</h4>
                <p className="text-sm text-gray-500">{review.authorName} - {review.authorTitle}</p>
            </div>
            <StarRating rating={review.rating} />
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
                <h5 className="font-semibold text-green-600 mb-1">Pros</h5>
                <p className="text-gray-600">{review.pros}</p>
            </div>
            <div>
                <h5 className="font-semibold text-red-600 mb-1">Cons</h5>
                <p className="text-gray-600">{review.cons}</p>
            </div>
        </div>
        <p className="text-xs text-gray-400 text-right mt-4">{review.timestamp}</p>
    </div>
);


const CompanyReviews: React.FC<CompanyReviewsProps> = ({ initialReviews, companyId }) => {
    const [reviews, setReviews] = useState<CompanyReview[]>(initialReviews);
    const [showForm, setShowForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 0, title: '', pros: '', cons: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newReview.rating === 0 || !newReview.title || !newReview.pros || !newReview.cons) {
            // Show error message instead of alert
            return;
        }
        const submittedReview: CompanyReview = {
            ...newReview,
            id: `review-${Date.now()}`,
            companyId,
            authorName: 'Current Employee', // Mocked for simplicity
            authorTitle: 'Software Engineer', // Mocked
            timestamp: 'Just now',
        };
        setReviews([submittedReview, ...reviews]);
        setShowForm(false);
        setNewReview({ rating: 0, title: '', pros: '', cons: '' });
    };

    const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 'N/A';

    return (
        <div className="mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div>
                    <h2 className="text-xl font-bold text-neutral-dark flex items-center gap-2">
                        Company Reviews
                        {reviews.length > 0 && (
                            <div className="flex items-center gap-1 ml-2">
                                <StarIcon className="w-5 h-5 text-yellow-400" />
                                <span className="font-bold text-lg">{avgRating}</span>
                                <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
                            </div>
                        )}
                    </h2>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="mt-4 sm:mt-0 px-4 py-2 text-sm bg-primary text-white rounded-md font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Write a Review
                    </button>
                )}
            </div>
            
            {showForm && (
                <div className="bg-neutral-light p-6 rounded-lg mb-6 border border-gray-200 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Share Your Experience</h3>
                        <button onClick={() => setShowForm(false)} className="p-1 text-gray-400 hover:text-gray-600">
                             <XMarkIcon className="w-5 h-5"/>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Overall Rating</label>
                            <StarRating rating={newReview.rating} onRate={(r) => setNewReview(p => ({...p, rating: r}))} interactive />
                        </div>
                         <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Review Title</label>
                            <input type="text" id="title" value={newReview.title} onChange={(e) => setNewReview(p => ({...p, title: e.target.value}))} className="mt-1 w-full border-gray-300 rounded-md shadow-sm" required />
                        </div>
                         <div>
                            <label htmlFor="pros" className="block text-sm font-medium text-gray-700">Pros</label>
                            <textarea id="pros" rows={3} value={newReview.pros} onChange={(e) => setNewReview(p => ({...p, pros: e.target.value}))} className="mt-1 w-full border-gray-300 rounded-md shadow-sm" required />
                        </div>
                         <div>
                            <label htmlFor="cons" className="block text-sm font-medium text-gray-700">Cons</label>
                            <textarea id="cons" rows={3} value={newReview.cons} onChange={(e) => setNewReview(p => ({...p, cons: e.target.value}))} className="mt-1 w-full border-gray-300 rounded-md shadow-sm" required />
                        </div>
                        <div className="text-right">
                             <button type="submit" className="px-5 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-blue-700">Submit Review</button>
                        </div>
                    </form>
                </div>
            )}
            
            {reviews.length > 0 ? (
                <div>{reviews.map(review => <ReviewCard key={review.id} review={review} />)}</div>
            ) : (
                 <div className="text-center py-8 border-t">
                    <p className="text-gray-500">Be the first to review {companyId.replace(/-/g, ' ')}!</p>
                </div>
            )}
            <style>{`
                @keyframes fade-in {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default CompanyReviews;
