import { useState, useEffect, useCallback } from 'react';
import type { EventFilters, EventItem, EventStatsSummary, EventStatusTab } from '../types/event';
import { eventService } from '../services/eventService';

const initialFilters: EventFilters = {
  search: '',
  statusTab: 'all',
  category: 'All Categories',
  sortBy: 'nearest',
  page: 1,
  pageSize: 6,
};

export function useEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [stats, setStats] = useState<EventStatsSummary | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFilters>(initialFilters);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    async function executeFetch() {
      setIsLoading(true);
      setError(null);

      try {
        const [eventsRes, statsRes] = await Promise.all([
          eventService.fetchEvents(filters),
          eventService.fetchEventStats(),
        ]);

        if (!isCancelled) {
          setEvents(eventsRes.data);
          setTotal(eventsRes.total);
          setTotalPages(eventsRes.totalPages);
          setIsBackendConnected(eventsRes.isConnected);
          setStats(statsRes);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const msg = err instanceof Error ? err.message : 'Failed to load events';
          setError(msg);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void executeFetch();

    return () => {
      isCancelled = true;
    };
  }, [filters, refreshTrigger]);

  const refresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const setStatusTab = useCallback((statusTab: EventStatusTab) => {
    setFilters((prev) => ({ ...prev, statusTab, page: 1 }));
  }, []);

  const setCategory = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category, page: 1 }));
  }, []);

  const setSortBy = useCallback((sortBy: 'nearest' | 'newest' | 'capacity' | 'name') => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  return {
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
  };
}
