import React, { useState, useEffect } from 'react';
import { Download, Plus, CalendarX, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import { EventStats } from '../components/events/EventStats';
import { EventToolbar } from '../components/events/EventToolbar';
import { EventCard } from '../components/events/EventCard';
import { EventPagination } from '../components/events/EventPagination';
import { Button } from '../components/ui/Button';
import type { EventItem, EventLifecycleAction } from '../types/event';
import { eventService } from '../services/eventService';

export const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    events,
    stats,
    total,
    totalPages,
    isBackendConnected,
    isLoading,
    error,
    filters,
    setSearch,
    setStatusTab,
    setCategory,
    setSortBy,
    setPage,
    resetFilters,
    refresh,
  } = useEvents();

  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Keyboard shortcut handler for 'N' to open Create Event and 'Esc' to clear search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        navigate('/events/new');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleActionClick = async (actionId: string, event: EventItem) => {
    if (actionId === 'registration-form') {
      navigate(`/events/${event.id}/registration-form`);
      return;
    }
    const lifecycleActions: EventLifecycleAction[] = ['edit', 'publish', 'unpublish', 'close', 'cancel', 'archive'];
    if (!lifecycleActions.includes(actionId as EventLifecycleAction)) {
      setActionNotice('This event action is not available. No change was made.');
      return;
    }
    const result = await eventService.performLifecycleAction(event.id, actionId as EventLifecycleAction);
    setActionNotice(result.error);
  };

  const handleBulkExport = () => {
    setActionNotice('The export service is not connected. No file was created.');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Action Notice Banner (when user triggers uncompleted backend operations) */}
      {actionNotice && (
        <div className="p-3 bg-neutral-900 text-white rounded-md flex items-center justify-between text-xs font-mono shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-neutral-400 hover:text-white px-2 py-0.5 rounded cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Page Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {/* Registry & Lifecycle Controller Tag */}
          <div className="flex items-center gap-2 text-[10px] font-mono font-semibold tracking-wider text-neutral-500 uppercase mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
            <span>REGISTRY & LIFECYCLE CONTROLLER</span>
          </div>

          {/* Main Title & Subtitle */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 font-sans">
            Events Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl font-normal leading-relaxed">
            Manage event details, registration settings, and event status. Records appear when the event service is connected.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="md"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={handleBulkExport}
          >
            Bulk Export
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-3.5 h-3.5" />}
            shortcut="N"
            onClick={() => navigate('/events/new')}
          >
            Create New Event
          </Button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <EventStats stats={stats} isLoading={isLoading} />

      {/* Search & Filter Toolbar */}
      <EventToolbar
        filters={filters}
        totalCounts={{
          all: total,
          open: events.filter((e) => e.status === 'registration_open').length,
          draft: events.filter((e) => e.status === 'draft').length,
          live: events.filter((e) => e.status === 'live_now').length,
        }}
        categories={[...new Set(events.map((event) => event.category).filter(Boolean))]}
        onSearchChange={setSearch}
        onStatusTabChange={setStatusTab}
        onCategoryChange={setCategory}
        onSortChange={setSortBy}
      />

      {/* Events List / Skeletons / Empty State */}
      <div className="flex flex-col gap-3 min-h-[300px]">
        {/* Loading Skeletons */}
        {isLoading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-neutral-200 rounded-md p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 bg-neutral-200 rounded shrink-0" />
                  <div className="flex flex-col gap-2 w-full max-w-md">
                    <div className="h-3 w-32 bg-neutral-200 rounded" />
                    <div className="h-5 w-64 bg-neutral-200 rounded" />
                    <div className="h-3 w-48 bg-neutral-200 rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-48 h-8 bg-neutral-200 rounded" />
                  <div className="w-24 h-8 bg-neutral-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-rose-50 border border-rose-200 rounded-md p-6 text-center flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8 text-rose-500" />
            <h3 className="text-sm font-semibold text-rose-900 font-sans">
              Failed to load events
            </h3>
            <p className="text-xs text-rose-700 font-mono">{error}</p>
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={refresh}
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Empty State (when no events exist or filter returns none) */}
        {!isLoading && !error && events.length === 0 && (
          <div className="bg-white border border-dashed border-neutral-300 rounded-lg p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
              <CalendarX className="w-6 h-6 stroke-1" />
            </div>
            <div className="flex flex-col gap-1 max-w-sm">
              <h3 className="text-sm font-semibold text-neutral-800 font-sans">
                {filters.search || filters.statusTab !== 'all' || filters.category !== 'All Categories'
                  ? 'No matching events found'
                  : isBackendConnected ? 'No events registered yet' : 'Event service not connected'}
              </h3>
              <p className="text-xs text-neutral-500 font-mono">
                {filters.search || filters.statusTab !== 'all' || filters.category !== 'All Categories'
                  ? 'Try modifying your search query or reset the active filter tabs.'
                  : isBackendConnected
                    ? 'Create an event to begin managing registrations.'
                    : 'Connect an event service to load or create event records. No sample events are shown.'}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {(filters.search || filters.statusTab !== 'all' || filters.category !== 'All Categories') && (
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Clear Filters
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => navigate('/events/new')}
              >
                Create New Event
              </Button>
            </div>
          </div>
        )}

        {/* Populated Events List */}
        {!isLoading && !error && events.length > 0 && (
          <div className="flex flex-col gap-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} onActionClick={handleActionClick} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination & Status Footer */}
      <EventPagination
        currentPage={filters.page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={filters.pageSize}
        onPageChange={setPage}
        filterModeDescription={
          filters.statusTab === 'all'
            ? 'All active records'
            : `Filtered by ${filters.statusTab}`
        }
        isBackendConnected={isBackendConnected}
      />

    </div>
  );
};
