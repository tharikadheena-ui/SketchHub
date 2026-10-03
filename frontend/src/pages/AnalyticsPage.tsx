import { useState } from 'react';
import { Activity, BarChart3, CalendarDays, UsersRound } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';

const PLATFORM_METRICS = ['Participants', 'Events', 'Registrations', 'Attendance', 'Certificates'];
const EVENT_METRICS = ['Registrations', 'Attendance', 'No-shows', 'Team registrations', 'Individual registrations', 'Participation rate'];

export function AnalyticsPage() {
  const [scope, setScope] = useState<'platform' | 'event'>('platform');

  return (
    <section className="flex flex-col gap-5" aria-labelledby="page-title">
      <PageHeader title="Analytics" description="Platform and event reporting based on connected registration, attendance, and certificate records." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Analytics scope" className="inline-flex w-fit rounded border border-neutral-200 bg-white p-1">
          {(['platform', 'event'] as const).map((option) => (
            <button key={option} type="button" role="tab" aria-selected={scope === option} onClick={() => setScope(option)} className={`rounded px-3 py-1.5 text-xs font-medium capitalize ${scope === option ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}>
              {option}-level
            </button>
          ))}
        </div>
        {scope === 'event' && (
          <label className="flex items-center gap-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">
            EVENT
            <select disabled className="rounded border border-neutral-200 bg-neutral-50 px-2.5 py-2 text-xs font-sans font-normal normal-case tracking-normal text-neutral-500"><option>No connected events</option></select>
          </label>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        {(scope === 'platform' ? PLATFORM_METRICS : EVENT_METRICS).map((label) => (
          <div key={label} className="rounded-md border border-neutral-200 bg-white p-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">{label}</div>
            <div className="mt-3 font-mono text-2xl font-bold text-neutral-400">—</div>
            <div className="mt-1 text-[10px] font-mono text-neutral-400">Not connected</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-md border border-neutral-200 bg-white" aria-labelledby="timeline-title">
          <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-3"><CalendarDays className="h-4 w-4 text-neutral-600" /><h2 id="timeline-title" className="text-xs font-semibold text-neutral-800">Registration timeline</h2></div>
          <EmptyState icon={BarChart3} title="No registration data available" description="The chart will render connected registration time series without placeholder values." compact />
        </section>
        <section className="rounded-md border border-neutral-200 bg-white" aria-labelledby="participation-title">
          <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-3"><UsersRound className="h-4 w-4 text-neutral-600" /><h2 id="participation-title" className="text-xs font-semibold text-neutral-800">Participation</h2></div>
          <EmptyState icon={Activity} title="No attendance data available" description="Attendance, no-shows, and team-versus-individual distribution require real event records." compact />
        </section>
      </div>
    </section>
  );
}