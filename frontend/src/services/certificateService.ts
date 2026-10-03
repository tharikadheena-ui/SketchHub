import type { CertificateRecord, CertificateTemplate } from '../types/domain';
import { notConnected } from './serviceResult';

export const certificateService = {
  async listTemplates() {
    return notConnected<CertificateTemplate[]>('Certificate');
  },
  async uploadTemplate(_file: File) {
    return notConnected<CertificateTemplate>('Certificate template');
  },
  async updateTemplate(_templateId: string, _changes: Partial<CertificateTemplate>) {
    return notConnected<CertificateTemplate>('Certificate template');
  },
  async listRecords(_eventId?: string) {
    return notConnected<CertificateRecord[]>('Certificate');
  },
  async generate(_eventId: string) {
    return notConnected<CertificateRecord[]>('Certificate generation');
  },
  async distribute(_recordIds: string[]) {
    return notConnected<CertificateRecord[]>('Certificate distribution');
  },
  async retry(_recordId: string) {
    return notConnected<CertificateRecord>('Certificate retry');
  },
};