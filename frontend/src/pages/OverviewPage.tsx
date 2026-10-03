import {
  Activity,
  Award,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardList,
  QrCode,
  UsersRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';

const METRICS = [
  { label: 'Participants', icon: UsersRound },
  { label: 'Upcoming events', icon: CalendarDays },
  { label: 'Registrations', icon: ClipboardList },
  { label: 'Attendance', icon: QrCode },
  { label: 'Certificates', icon: Award },
];

const QUICK_LINKS = [
  { to: '/events/new', label: 'Create event', icon: CalendarDays },
  { to: '/participants', label: 'Participants', icon: UsersRound },
  { to: '/attendance', label: 'Check-in', icon: QrCode },
  { to: '/audit', label: 'Audit & records', icon: Activity },
];

export function OverviewPage() {
  return (
    <section className="flex flex-col gap-6" aria-labelledby="page-title">
      <PageHeader
        title="Overview"
        description="Event operations, registrations, attendance, and certificates from connected platform data."
        action={(
          <Link to="/events/new" className="rounded bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-700">
            Create event
          </Link>
        )}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {METRICS.map(({ label, icon: Icon }) => (
          <div key={label} className="relative flex min-h-28 flex-col justify-between overflow-hidden rounded-md border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-neutral-500">
              <span>{label}</span>
              <Icon className="h-4 w-4 text-neutral-700" aria-hidden="true" />
            </div>
            <span className="font-mono text-2xl font-bold text-neutral-400" aria-label={`${label}: not available`}>
              —
            </span>
            <span className="text-[10px] font-mono text-neutral-400">Not connected</span>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-200" />
          </div>
        ))}
      </div>

      <section className="grid gap-4 xl:grid-cols-2" aria-label="Operational summaries">
        <div className="rounded-md border border-neutral-200 bg-white">
          <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-3">
            <ChartNoAxesCombined className="h-4 w-4 text-neutral-600" aria-hidden="true" />
            <h2 className="text-xs font-semibold text-neutral-800">Registration trends</h2>
          </div>
          <EmptyState icon={ChartNoAxesCombined} title="No trend data available" description="Registration trends will appear when event registration data is connected." compact />
        </div>
        <div className="rounded-md border border-neutral-200 bg-white">
          <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-3">
            <Activity className="h-4 w-4 text-neutral-600" aria-hidden="true" />
            <h2 className="text-xs font-semibold text-neutral-800">Recent activity</h2>
          </div>
          <EmptyState icon={Activity} title="No activity available" description="Administrative activity will appear here when the audit service is connected." compact />
        </div>
      </section>

      <section className="rounded-md border border-neutral-200 bg-white p-4">
        <h2 className="text-xs font-semibold text-neutral-800">Quick actions</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_LINKS.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className="inline-flex items-center gap-2 rounded border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50">
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}