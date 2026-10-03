export type RegistrationQuestionType =
  | 'short_answer'
  | 'long_answer'
  | 'dropdown'
  | 'multiple_choice'
  | 'checkbox'
  | 'file_upload';

interface RegistrationQuestionBase {
  id: string;
  prompt: string;
  type: RegistrationQuestionType;
  required: boolean;
}

export type RegistrationQuestion = RegistrationQuestionBase & {
  options?: string[];
  acceptedFileTypes?: string[];
  maxLength?: number;
};

export interface RegistrationForm {
  eventId: string | null;
  registrationType: 'individual' | 'team' | 'both';
  questions: RegistrationQuestion[];
  isPublished: boolean;
  teamMinimumSize: number | null;
  teamMaximumSize: number | null;
}

import type { EventStatus } from './event';

export interface EventRecord {
  id: string;
  name: string;
  description: string;
  category: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  posterUrl: string | null;
  registrationOpensAt: string | null;
  registrationDeadline: string | null;
  eventDate: string | null;
  startTime: string | null;
  endTime: string | null;
  locationType: 'physical' | 'online' | 'hybrid';
  venue: string | null;
  block: string | null;
  room: string | null;
  eligibility: string;
  registrationType: 'individual' | 'team' | 'both';
  participantCapacity: number | null;
  teamCapacity: number | null;
  teamMinimumSize: number | null;
  teamMaximumSize: number | null;
  status: EventStatus;
}

export interface Participant {
  id: string;
  registrationId: string;
  name: string;
  email: string;
  phone: string | null;
  registrationType: 'individual' | 'team';
  teamId: string | null;
  registrationStatus: string;
}

export interface Team {
  id: string;
  eventId: string;
  name: string;
  code: string;
  inviteUrl: string | null;
  minimumSize: number;
  maximumSize: number;
  memberIds: string[];
}

export interface Registration {
  id: string;
  eventId: string;
  participantIds: string[];
  teamId: string | null;
  type: 'individual' | 'team';
  status: string;
  registeredAt: string;
  answers: Record<string, unknown>;
}

export interface RegistrationSubmission {
  name: string;
  email: string;
  phone: string | null;
  registrationType: 'individual' | 'team';
  teamName: string | null;
  teamCode: string | null;
  answers: Record<string, unknown>;
}

export interface AttendanceRecord {
  id: string;
  eventId: string;
  participantId: string;
  checkedInAt: string;
  checkedInBy: string;
}

export interface QRRegistration {
  id: string;
  registrationId: string;
  participantId: string;
  eventId: string;
  token: string;
  expiresAt: string | null;
}

export type QRValidationResult =
  | {
      status: 'valid';
      qrId: string;
      registrationId: string;
      participant: Participant;
      team: Team | null;
    }
  | {
      status: 'invalid' | 'unregistered' | 'wrong_event' | 'outside_window' | 'already_checked_in';
      message: string;
    };

export interface CertificateTemplate {
  id: string;
  name: string;
  assetUrl: string;
  participantNamePosition: { x: number; y: number };
}

export type CertificateStatus = 'sent' | 'not_sent' | 'failed' | 'retry';

export interface CertificateRecord {
  id: string;
  eventId: string;
  participantId: string;
  status: CertificateStatus;
  generatedAt: string | null;
  sentAt: string | null;
}

export interface AuditRecord {
  id: string;
  eventId: string | null;
  participantId: string | null;
  recordType: 'registration' | 'attendance' | 'certificate' | 'event' | 'administrative';
  actorId: string;
  action: string;
  changedAt: string;
  details: Record<string, unknown>;
}

export interface Activity {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  occurredAt: string;
}

export interface OverviewData {
  participantCount: number;
  upcomingEventCount: number;
  registrationCount: number;
  attendanceCount: number;
  certificateCount: number;
  registrationTrend: Array<{ date: string; count: number }>;
  recentActivity: Activity[];
}

export interface AnalyticsData {
  registrations: Array<{ date: string; count: number }>;
  attendanceCount: number;
  noShowCount: number;
  teamRegistrationCount: number;
  individualRegistrationCount: number;
  participationRate: number | null;
}