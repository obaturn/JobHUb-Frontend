import React from 'react';
import { FeedItem, Job } from '../../types';
import JobCard from '../JobCard';
import { BuildingOfficeIcon } from '../icons/BuildingOfficeIcon';
import { NewspaperIcon } from '../icons/NewspaperIcon';
import { BriefcaseIcon } from '../../constants';

interface FeedItemCardProps {
    item: FeedItem;
    onViewJobDetails: (job: Job) => void;
    onViewCompanyProfile: (companyId: string) => void;
}

const FeedItemCard: React.FC<FeedItemCardProps> = ({ item, onViewJobDetails, onViewCompanyProfile }) => {
    
    const renderHeader = (icon: React.ReactNode, title: string) => (
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <div className="w-8 h-8 flex items-center justify-center bg-neutral-light rounded-full text-primary">
                {icon}
            </div>
            <div>
                <h3 className="font-semibold text-neutral-dark">{title}</h3>
                <p className="text-xs text-gray-500">{item.timestamp}</p>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (item.type) {
            case 'job_recommendation':
                if (!item.job) return null;
                return (
                    <>
                        {renderHeader(<BriefcaseIcon className="w-5 h-5" />, "Recommended Job For You")}
                        <div className="p-4">
                            <JobCard job={item.job} onViewJobDetails={onViewJobDetails} onViewCompanyProfile={onViewCompanyProfile} />
                        </div>
                    </>
                );
            case 'company_update':
                 if (!item.company) return null;
                return (
                     <>
                        {renderHeader(<BuildingOfficeIcon className="w-5 h-5" />, `${item.company.name} posted an update`)}
                        <div className="p-4 flex gap-4">
                           <img src={item.company.logo} alt={item.company.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                           <div>
                               <button onClick={() => onViewCompanyProfile(item.company!.id)} className="font-bold text-neutral-dark hover:underline">{item.company.name}</button>
                               <p className="text-sm text-gray-600 mt-2">{item.updateText}</p>
                           </div>
                        </div>
                    </>
                );
            case 'article':
                if (!item.article) return null;
                return (
                    <>
                        {renderHeader(<NewspaperIcon className="w-5 h-5" />, "Career Advice")}
                        <div className="p-4">
                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                <img src={item.article.image} alt={item.article.title} className="w-full md:w-48 h-40 object-cover rounded-lg flex-shrink-0" />
                                <div className="flex flex-col self-stretch">
                                    <h4 className="font-bold text-lg text-neutral-dark">{item.article.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1 flex-grow">{item.article.snippet}</p>
                                    <button className="text-sm text-primary font-semibold mt-3 hover:underline self-start">Read More &rarr;</button>
                                </div>
                            </div>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="bg-white rounded-lg shadow-md">
            {renderContent()}
        </div>
    );
};

export default FeedItemCard;