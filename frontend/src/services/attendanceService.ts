import type { AttendanceRecord, QRValidationResult } from '../types/domain';
import { notConnected } from './serviceResult';

export const attendanceService = {
  async listAttendance(_eventId?: string) {
    return notConnected<AttendanceRecord[]>('Attendance');
  },
  async validateQr(_payload: string, _eventId: string) {
    return notConnected<QRValidationResult>('QR validation');
  },
  async confirmCheckIn(_qrId: string) {
    return notConnected<AttendanceRecord>('Check-in');
  },
};