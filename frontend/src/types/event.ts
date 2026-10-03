export type EventStatus =
  | 'registration_open'
  | 'registration_closed'
  | 'live_now'
  | 'draft'
  | 'completed'
  | 'cancelled'
  | 'archived';

export type EventLifecycleAction = 'edit' | 'publish' | 'unpublish' | 'close' | 'cancel' | 'archive';

export type EventStatusTab = 'all' | 'open' | 'draft' | 'live';

export type GaugeType = 'capacity' | 'check_in' | 'setup' | 'attendance';

export interface EventGauge {
  type: GaugeType;
  label: string;
  current: number;
  total: number;
  percentage: number;
  subtext: string;
}

export interface EventAction {
  id: string;
  label: string;
  icon?: string;
  variant?: 'primary' | 'outline' | 'danger';
  count?: number;
  disabled?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  status: EventStatus;
  category: string;
  teamFormat: string;
  dateDisplay: string;
  venue?: string;
  subBadge?: string;
  gauge?: EventGauge;
  thumbnailType?: 'code' | 'text' | 'rust' | 'draft' | 'completed' | 'archived';
  thumbnailLabel?: string;
  isFeatured?: boolean; // shows active dark left indicator border
  actions?: EventAction[];
}

export interface EventStatsSummary {
  activeEvents: number;
  liveToday: number;
  totalRegistrants: number;
  wowGrowth: number;
  publishedRegistrationForms: number;
  totalRegistrationForms: number;
  certificatesIssued: number;
}

export interface EventFilters {
  search: string;
  statusTab: EventStatusTab;
  category: string;
  sortBy: 'nearest' | 'newest' | 'capacity' | 'name';
  page: number;
  pageSize: number;
}

export interface PaginatedEventsResult {
  data: EventItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  isConnected: boolean;
}
