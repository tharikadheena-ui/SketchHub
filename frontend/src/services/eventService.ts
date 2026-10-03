import type { EventFilters, EventLifecycleAction, EventStatsSummary, PaginatedEventsResult } from '../types/event';
import type { EventRecord } from '../types/domain';
import { notConnected } from './serviceResult';

const NOT_CONNECTED = 'The event service is not connected.';

export const eventService = {
  async fetchEvents(filters?: EventFilters): Promise<PaginatedEventsResult> {
    return {
      data: [],
      total: 0,
      page: filters?.page ?? 1,
      pageSize: filters?.pageSize ?? 6,
      totalPages: 0,
      isConnected: false,
    };
  },

  async fetchEventStats(): Promise<EventStatsSummary | null> {
    return null;
  },

  async getEvent(_id: string) {
    return notConnected<EventRecord>('Event');
  },

  async createEvent(_payload: Partial<EventRecord>): Promise<{ success: false; error: string }> {
    return { success: false, error: NOT_CONNECTED };
  },

  async updateEvent(_id: string, _payload: Partial<EventRecord>): Promise<{ success: false; error: string }> {
    return { success: false, error: NOT_CONNECTED };
  },

  async deleteEvent(_id: string): Promise<{ success: false; error: string }> {
    return { success: false, error: NOT_CONNECTED };
  },

  async performLifecycleAction(_id: string, _action: EventLifecycleAction): Promise<{ success: false; error: string }> {
    return { success: false, error: NOT_CONNECTED };
  },

  async exportEventsData(): Promise<{ success: boolean; message: string }> {
    return { success: false, message: NOT_CONNECTED };
  },
};
