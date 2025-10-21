"use client";

import { useState } from 'react';
import Header from '@/components/Header';
import SearchFilter from '@/components/homePage/SearchFilter';
import DAOGrid from '@/components/homePage/DAOGrid';

export default function DAOsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleStatusChange = (statuses: string[]) => {
    setSelectedStatus(statuses);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus([]);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover DAOs
          </h1>
          <p className="text-lg text-gray-600">
            Explore decentralized autonomous organizations and join communities that align with your interests.
          </p>
        </div>

        <div className="mb-8">
          <SearchFilter 
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
            onStatusChange={handleStatusChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        <div className="mb-12">
          <DAOGrid 
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
          />
        </div>
      </main>
    </div>
  );
}