import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { EventFilters, EventStatusTab } from '../../types/event';
import { cn } from '../../utils/formatters';

interface EventToolbarProps {
  filters: EventFilters;
  totalCounts?: {
    all: number;
    open: number;
    draft: number;
    live: number;
  };
  categories?: string[];
  onSearchChange: (search: string) => void;
  onStatusTabChange: (tab: EventStatusTab) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: 'nearest' | 'newest' | 'capacity' | 'name') => void;
}

const SORT_OPTIONS = [
  { label: 'Date (Nearest)', value: 'nearest' },
  { label: 'Date (Newest)', value: 'newest' },
  { label: 'Capacity', value: 'capacity' },
  { label: 'Name (A-Z)', value: 'name' },
];

export const EventToolbar: React.FC<EventToolbarProps> = ({
  filters,
  totalCounts = { all: 0, open: 0, draft: 0, live: 0 },
  categories = [],
  onSearchChange,
  onStatusTabChange,
  onCategoryChange,
  onSortChange,
}) => {
  const categoryOptions = ['All Categories', ...categories.filter((category) => category !== 'All Categories')];

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-2.5 border border-neutral-200 rounded-md shadow-2xs">
      {/* Left: Search Bar & Status Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search events by title, tag, or venue..."
            className="w-full bg-neutral-50/50 hover:bg-white text-neutral-800 placeholder:text-neutral-400 text-xs border border-neutral-200 rounded px-2.5 py-1.5 pl-8 focus:outline-hidden focus:border-neutral-800 focus:bg-white transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs p-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 border-l border-neutral-200 pl-3">
          <button
            onClick={() => onStatusTabChange('all')}
            className={cn(
              'px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors cursor-pointer select-none',
              filters.statusTab === 'all'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            )}
          >
            All {totalCounts.all > 0 ? `(${totalCounts.all})` : ''}
          </button>
          <button
            onClick={() => onStatusTabChange('open')}
            className={cn(
              'px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors cursor-pointer select-none',
              filters.statusTab === 'open'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            )}
          >
            Open {totalCounts.open > 0 ? `(${totalCounts.open})` : ''}
          </button>
          <button
            onClick={() => onStatusTabChange('draft')}
            className={cn(
              'px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors cursor-pointer select-none',
              filters.statusTab === 'draft'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            )}
          >
            Draft {totalCounts.draft > 0 ? `(${totalCounts.draft})` : ''}
          </button>
          <button
            onClick={() => onStatusTabChange('live')}
            className={cn(
              'px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors cursor-pointer select-none flex items-center gap-1.5',
              filters.statusTab === 'live'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Live {totalCounts.live > 0 ? `(${totalCounts.live})` : ''}
          </button>
        </div>
      </div>

      {/* Right: Category & Sort Dropdowns */}
      <div className="flex items-center gap-2">
        {/* Category Select */}
        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="appearance-none bg-white text-neutral-700 text-[11px] font-mono border border-neutral-200 rounded px-2.5 py-1.5 pr-6 cursor-pointer hover:border-neutral-400 focus:outline-hidden focus:border-neutral-800 transition-colors"
          >
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                CATEGORY: {cat}
              </option>
            ))}
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-[10px]">
            ▼
          </span>
        </div>

        {/* Sort Select */}
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onSortChange(e.target.value as 'nearest' | 'newest' | 'capacity' | 'name')
            }
            className="appearance-none bg-white text-neutral-700 text-[11px] font-mono border border-neutral-200 rounded px-2.5 py-1.5 pr-7 cursor-pointer hover:border-neutral-400 focus:outline-hidden focus:border-neutral-800 transition-colors"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                SORT: {opt.label}
              </option>
            ))}
          </select>
          <SlidersHorizontal className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400" />
        </div>
      </div>
    </div>
  );
};
