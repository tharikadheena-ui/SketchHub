import type { Activity, AuditRecord } from '../types/domain';
import { notConnected } from './serviceResult';

export const auditService = {
  async listRecords(_filters?: { eventId?: string; from?: string; to?: string }) {
    return notConnected<AuditRecord[]>('Audit and records');
  },
  async listActivity() {
    return notConnected<Activity[]>('Activity');
  },
};