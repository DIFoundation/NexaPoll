"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { dummyDAOs, filterDAOs } from '@/lib/daoData';
import { getActiveProposals } from '@/lib/proposalData';
import { Search, ArrowUpRight, Users, FileText, Clock, TrendingUp, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface DAOGridProps {
  searchQuery?: string;
  selectedCategory?: string;
  selectedStatus?: string[];
}

// Memoize the DAO card component to prevent unnecessary re-renders
const DAOCard = React.memo(({ dao }: { dao: typeof dummyDAOs[0] }) => {
  const statusBadge = useMemo(() => {
    switch (dao.status) {
      case 'trending':
        return {
          icon: <TrendingUp className="w-3.5 h-3.5 mr-1" />,
          bg: 'bg-purple-100 text-purple-800',
          border: 'border-purple-200',
          label: 'Trending'
        };
      case 'new':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 mr-1" />,
          bg: 'bg-blue-100 text-blue-800',
          border: 'border-blue-200',
          label: 'New'
        };
      default:
        return {
          icon: <Zap className="w-3.5 h-3.5 mr-1" />,
          bg: 'bg-green-100 text-green-800',
          border: 'border-green-200',
          label: 'Active'
        };
    }
  }, [dao.status]);

  const activeProposals = useMemo(() => getActiveProposals(dao.id), [dao.id]);
  
  const getCategoryColor = useCallback((category: string) => {
    const colors: Record<string, string> = {
      defi: 'bg-blue-100 text-blue-800',
      nft: 'bg-purple-100 text-purple-800',
      gaming: 'bg-green-100 text-green-800',
      social: 'bg-pink-100 text-pink-800',
      governance: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.other;
  }, []);

  const formatNumber = useCallback((num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }, []);

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="absolute -bottom-6 left-6 w-16 h-16 rounded-xl bg-white border-4 border-white shadow-sm overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-2xl font-bold text-blue-600">
            {dao.name.charAt(0)}
          </div>
        </div>
        
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${statusBadge.bg} ${statusBadge.border} border`}>
          {statusBadge.icon}
          {statusBadge.label}
        </div>
      </div>
      
      <div className="pt-8 px-6 pb-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {dao.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {dao.description}
            </p>
          </div>
          <Link 
            href={`/dao/${dao.id}`}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            aria-label={`View ${dao.name} details`}
          >
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getCategoryColor(dao.category)}`}>
            {dao.category.charAt(0).toUpperCase() + dao.category.slice(1)}
          </span>
          {dao.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
              {tag}
            </span>
          ))}
          {dao.tags.length > 2 && (
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
              +{dao.tags.length - 2}
            </span>
          )}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-500 flex items-center justify-center">
              <Users className="w-4 h-4 mr-1" />
              Members
            </div>
            <div className="mt-1 font-semibold">{formatNumber(dao.members)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 flex items-center justify-center">
              <FileText className="w-4 h-4 mr-1" />
              Proposals
            </div>
            <div className="mt-1 font-semibold">{formatNumber(dao.proposals)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 flex items-center justify-center">
              <Clock className="w-4 h-4 mr-1" />
              Active
            </div>
            <div className="mt-1 font-semibold">{activeProposals.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

DAOCard.displayName = 'DAOCard';

// Loading skeleton component
const DAOCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
      <div className="flex justify-between">
        <div className="h-8 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  </div>
);

const DAOGrid: React.FC<DAOGridProps> = ({
  searchQuery = '',
  selectedCategory = 'all',
  selectedStatus = [],
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredDAOs, setFilteredDAOs] = useState<typeof dummyDAOs>([]);

  // Memoize filtered DAOs to prevent unnecessary recalculations
  const memoizedFilteredDAOs = useMemo(() => {
    return filterDAOs({
      category: selectedCategory,
      status: selectedStatus,
      searchQuery: searchQuery.trim(),
    });
  }, [searchQuery, selectedCategory, selectedStatus]);

  // Use a single effect to handle loading state and data updates
  useEffect(() => {
    let isMounted = true;
    
    const timer = setTimeout(() => {
      if (isMounted) {
        setFilteredDAOs(memoizedFilteredDAOs);
        setIsLoading(false);
      }
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [memoizedFilteredDAOs]);

  // No results state
  if (!isLoading && filteredDAOs.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <Search className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No DAOs found</h3>
        <p className="mt-2 text-gray-500">
          Try adjusting your search or filter criteria to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading ? (
        // Show skeleton loaders
        Array.from({ length: 6 }).map((_, i) => (
          <DAOCardSkeleton key={`skeleton-${i}`} />
        ))
      ) : (
        // Show actual DAO cards
        filteredDAOs.map((dao) => (
          <DAOCard key={dao.id} dao={dao} />
        ))
      )}
    </div>
  );
};

export default React.memo(DAOGrid);
