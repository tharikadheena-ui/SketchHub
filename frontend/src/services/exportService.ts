import { notConnected } from './serviceResult';

export type ExportCategory = 'registrations' | 'participants' | 'attendance' | 'certificates' | 'audit';

export interface ExportRequest {
  category: ExportCategory;
  eventId?: string;
  from?: string;
  to?: string;
}

export const exportService = {
  async createExport(_request: ExportRequest) {
    return notConnected<Blob>('Export');
  },
};