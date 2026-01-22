import React from 'react';
import { SavedSearch } from '../../types';
import { TrashIcon } from '../icons/TrashIcon';
import { BellIcon } from '../icons/BellIcon';

interface SavedSearchesProps {
  savedSearches: SavedSearch[];
  onDelete: (searchId: string) => void;
  onNavigate: (page: 'job_search') => void;
}

const SavedSearches: React.FC<SavedSearchesProps> = ({ savedSearches, onDelete, onNavigate }) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-neutral-dark">Saved Searches</h1>
        <p className="text-gray-500 mt-1">Manage your job alerts and get notified about new opportunities.</p>
      </div>
      <div className="divide-y divide-gray-200">
        {savedSearches.length > 0 ? (
          savedSearches.map(search => (
            <div key={search.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50">
              <div className="flex-grow">
                <h3 className="font-bold text-lg text-neutral-dark">{search.query}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {search.filters.type.map(f => <span key={f} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{f}</span>)}
                  {search.filters.experience.map(f => <span key={f} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{f}</span>)}
                </div>
                <p className="text-xs text-gray-400 mt-2">Saved on: {new Date(search.timestamp).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => onNavigate('job_search')} className="px-4 py-2 text-sm bg-primary text-white rounded-md font-semibold hover:bg-blue-700 transition-colors">
                  View Jobs
                </button>
                <button onClick={() => onDelete(search.id)} className="p-2 text-gray-500 hover:text-alert hover:bg-red-50 rounded-md transition-colors">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <BellIcon className="w-12 h-12 mx-auto text-gray-300" />
            <p className="mt-4 font-semibold">You have no saved searches.</p>
            <p className="mt-1">Click the "Save Search" button on the job search page to create a job alert.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSearches;
