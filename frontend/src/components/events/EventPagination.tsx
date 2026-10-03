import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/formatters';

interface EventPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  filterModeDescription?: string;
  isBackendConnected?: boolean;
}

export const EventPagination: React.FC<EventPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  filterModeDescription = 'All active records',
  isBackendConnected = false,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to show
  const pageNumbers: number[] = [];
  const maxVisiblePages = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-xs font-mono text-neutral-500 border-t border-neutral-200 mt-2 select-none">
      {/* Left: Item Counts & Filter Mode */}
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
        {isBackendConnected ? (
          <>
            <span className="text-neutral-700">
              Showing <span className="font-semibold">{startItem}-{endItem}</span> of{' '}
              <span className="font-semibold">{totalItems}</span> events
            </span>
            <span className="text-neutral-300">|</span>
            <span className="text-neutral-500">Filter mode: {filterModeDescription}</span>
          </>
        ) : (
          <span className="text-neutral-500">Event records unavailable</span>
        )}
      </div>

      {/* Center: Pagination Buttons */}
      <div className="flex items-center gap-1.5">
        {isBackendConnected && (
          <>
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-neutral-200 rounded hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-700 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        {pageNumbers.length > 0 ? (
          pageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={cn(
                'min-w-7 h-7 flex items-center justify-center text-xs rounded font-mono font-medium transition-colors',
                currentPage === page
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              )}
            >
              {page}
            </button>
          ))
        ) : (
          <span className="min-w-7 h-7 flex items-center justify-center text-xs bg-neutral-900 text-white rounded font-mono">
            1
          </span>
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || totalPages === 0}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-neutral-200 rounded hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-700 transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
          </>
        )}
      </div>

      {/* Right: DB Status & Shortcuts */}
      <div className="flex items-center gap-3">
        <div className="text-[10px] font-mono tracking-wider font-semibold text-neutral-600 uppercase">
          BACKEND: {isBackendConnected ? 'CONNECTED' : 'NOT CONNECTED'}
        </div>
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-neutral-500 bg-neutral-100 border border-neutral-200 rounded">
          Esc: Clear Focus
        </kbd>
      </div>
    </div>
  );
};
