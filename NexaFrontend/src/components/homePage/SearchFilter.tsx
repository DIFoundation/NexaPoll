"use client";

import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

type FilterOption = {
  id: string;
  label: string;
  count: number;
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

export default function SearchFilter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleStatus = (statusId: string) => {
    setSelectedStatus(prev => 
      prev.includes(statusId)
        ? prev.filter(id => id !== statusId)
        : [...prev, statusId]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus([]);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedStatus.length > 0;

  return (
    <div className="mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-2xl flex-row">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            placeholder="Search DAOs by name, description, or category"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`inline-flex items-center px-4 py-3 border rounded-xl text-sm font-medium transition-colors ${
            isFilterOpen || hasActiveFilters
              ? 'bg-blue-600 text-white border-transparent hover:bg-blue-700'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-4 w-4 mr-2" />
          {hasActiveFilters ? (
            <span className="flex items-center">
              Filters
              <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800">
                {selectedStatus.length + (selectedCategory !== 'all' ? 1 : 0) + (searchQuery ? 1 : 0)}
              </span>
            </span>
          ) : (
            'Filters'
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {(isFilterOpen || hasActiveFilters) && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            <div className="flex items-center space-x-3">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                    <span className="ml-1 text-xs opacity-80">
                      ({category.count})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Status</h4>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => toggleStatus(status.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center ${
                      selectedStatus.includes(status.id)
                        ? `${status.color} text-white`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full mr-2 ${selectedStatus.includes(status.id) ? 'bg-white' : status.color}`}></span>
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Active Filters</h4>
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <div className="inline-flex items-center bg-blue-50 text-blue-700 text-sm px-3 py-1.5 rounded-lg">
                    Search: {searchQuery}
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                {selectedCategory !== 'all' && (
                  <div className="inline-flex items-center bg-blue-50 text-blue-700 text-sm px-3 py-1.5 rounded-lg">
                    {categoryOptions.find(c => c.id === selectedCategory)?.label}
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                {selectedStatus.map(statusId => {
                  const status = statusOptions.find(s => s.id === statusId);
                  return status ? (
                    <div 
                      key={statusId}
                      className="inline-flex items-center text-white text-sm px-3 py-1.5 rounded-lg"
                      style={{ backgroundColor: status.color.replace('bg-', '').replace('-500', '-600') }}
                    >
                      {status.label}
                      <button
                        onClick={() => toggleStatus(statusId)}
                        className="ml-2 text-white/80 hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
