"use client";

import { Search, Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';

type FilterOption = {
  id: string;
  label: string;
  count?: number;
};

const categoryOptions: FilterOption[] = [
  { id: 'all', label: 'All DAOs', count: 124 },
  { id: 'defi', label: 'DeFi', count: 42 },
  { id: 'nft', label: 'NFT', count: 36 },
  { id: 'gaming', label: 'Gaming', count: 28 },
  { id: 'social', label: 'Social', count: 18 },
];

const statusOptions = [
  { id: 'active', label: 'Active', color: 'bg-green-500' },
  { id: 'new', label: 'New', color: 'bg-blue-500' },
  { id: 'trending', label: 'Trending', color: 'bg-purple-500' },
];

interface SearchFilterProps {
  searchQuery: string;
  selectedCategory: string;
  selectedStatus: string[];
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onStatusChange: (statuses: string[]) => void;
  onClearFilters: () => void;
}

export default function SearchFilter({
  searchQuery,
  selectedCategory,
  selectedStatus,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onClearFilters,
}: SearchFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debounce search input
  useEffect(() => {
    if (typeof onSearchChange !== 'function') return;
    
    const timer = setTimeout(() => {
      onSearchChange(localSearchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchQuery, onSearchChange]);

  const toggleStatus = (statusId: string) => {
    const newStatuses = selectedStatus.includes(statusId)
      ? selectedStatus.filter(id => id !== statusId)
      : [...selectedStatus, statusId];
    onStatusChange(newStatuses);
  };

  const handleCategorySelect = (categoryId: string) => {
    onCategoryChange(categoryId);
  };

  const hasActiveFilters = localSearchQuery || selectedCategory !== 'all' || selectedStatus.length > 0;

  return (
    <div className="mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 sm:text-sm"
            placeholder="Search DAOs..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            aria-label="Search DAOs"
          />
        </div>

        {/* Filter Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {(selectedStatus?.length || 0) + (selectedCategory !== 'all' ? 1 : 0) + (localSearchQuery ? 1 : 0)}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClearFilters}
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategorySelect(category.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                    {category.count && (
                      <span className="ml-1.5 text-xs bg-white/50 rounded-full px-1.5 py-0.5">
                        {category.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Status</h3>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status.id}
                    type="button"
                    onClick={() => toggleStatus(status.id)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${
                      selectedStatus.includes(status.id)
                        ? `${status.color.replace('bg-', 'bg-')} text-white border-transparent`
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full mr-2 ${status.color}`}></span>
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Active Filters</h3>
                <button
                  type="button"
                  onClick={onClearFilters}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    {categoryOptions.find(c => c.id === selectedCategory)?.label || selectedCategory}
                    <button
                      type="button"
                      onClick={() => onCategoryChange('all')}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-200 text-blue-800 hover:bg-blue-300"
                      aria-label={`Remove ${selectedCategory} filter`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedStatus.map((statusId) => {
                  const status = statusOptions.find(s => s.id === statusId);
                  return status ? (
                    <span 
                      key={statusId}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                    >
                      <span className={`w-2 h-2 rounded-full mr-1.5 ${status.color}`}></span>
                      {status.label}
                      <button
                        type="button"
                        onClick={() => toggleStatus(statusId)}
                        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-200 text-blue-800 hover:bg-blue-300"
                        aria-label={`Remove ${status.label} filter`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null;
                })}
                {localSearchQuery && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    Search: {localSearchQuery}
                    <button
                      type="button"
                      onClick={() => setLocalSearchQuery('')}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-200 text-blue-800 hover:bg-blue-300"
                      aria-label="Clear search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
