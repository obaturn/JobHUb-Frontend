/**
 * Enhanced Search Component
 * Auto-complete search with rich suggestions and animations
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'job' | 'company' | 'skill' | 'location';
  icon: string;
  count?: number;
  salary?: string;
}

interface EnhancedSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  onSearch,
  placeholder = "Job title, keywords, or company"
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock suggestions data
  const mockSuggestions: SearchSuggestion[] = [
    { id: '1', title: 'Software Engineer', type: 'job', icon: '💻', count: 1247, salary: '$95k-$150k' },
    { id: '2', title: 'Product Manager', type: 'job', icon: '📊', count: 523, salary: '$110k-$180k' },
    { id: '3', title: 'Data Scientist', type: 'job', icon: '📈', count: 892, salary: '$100k-$160k' },
    { id: '4', title: 'UX Designer', type: 'job', icon: '🎨', count: 445, salary: '$80k-$130k' },
    { id: '5', title: 'Google', type: 'company', icon: '🏢', count: 156 },
    { id: '6', title: 'Microsoft', type: 'company', icon: '🏢', count: 203 },
    { id: '7', title: 'React', type: 'skill', icon: '⚛️', count: 2341 },
    { id: '8', title: 'Python', type: 'skill', icon: '🐍', count: 1876 },
    { id: '9', title: 'San Francisco', type: 'location', icon: '📍', count: 3421 },
    { id: '10', title: 'New York', type: 'location', icon: '📍', count: 2987 },
  ];

  // Filter suggestions based on query
  useEffect(() => {
    if (query.length > 0) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.title.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6);
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
    setSelectedIndex(-1);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    setIsOpen(false);
    onSearch(suggestion.title);
  };

  const handleSearch = () => {
    setIsOpen(false);
    onSearch(query);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'job': return 'text-blue-600 bg-blue-50';
      case 'company': return 'text-green-600 bg-green-50';
      case 'skill': return 'text-purple-600 bg-purple-50';
      case 'location': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-4 pr-12 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white transition-all duration-300 placeholder-gray-500"
        />
        
        {/* Search Icon */}
        <motion.div 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </motion.div>

        {/* Loading indicator */}
        {query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute right-12 top-1/2 transform -translate-y-1/2"
          >
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-2xl border border-gray-100 mt-2 z-50 overflow-hidden"
          >
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`px-4 py-3 cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                    index === selectedIndex 
                      ? 'bg-blue-50 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{suggestion.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {suggestion.title}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(suggestion.type)}`}>
                          {suggestion.type}
                        </span>
                        {suggestion.count && (
                          <span className="text-xs text-gray-500">
                            {suggestion.count.toLocaleString()} jobs
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {suggestion.salary && (
                    <div className="text-sm font-semibold text-green-600">
                      {suggestion.salary}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="border-t border-gray-100 px-4 py-2 bg-gray-50">
              <div className="text-xs text-gray-500 flex items-center justify-between">
                <span>Press ↑↓ to navigate, Enter to select</span>
                <span>{suggestions.length} results</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedSearch;