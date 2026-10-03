import { useState } from 'react';
import { ClipboardList, Search } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';

const RECORD_TYPES = ['All records', 'Registrations', 'Attendance', 'Certificates', 'Events', 'Administrative activity'];
const COLUMNS = ['Record ID', 'Participant', 'Event', 'Record type', 'Changed by', 'Date'];

export function AuditPage() {
  const [recordType, setRecordType] = useState(RECORD_TYPES[0]);
  const [search, setSearch] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  return (
    <section className="flex flex-col gap-5" aria-labelledby="page-title">
      <PageHeader title="Audit & Records" description="Trace registration, attendance, certificate, event, and administrative history." />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <section className="rounded-md border border-neutral-200 bg-white" aria-labelledby="lifecycle-title">
          <div className="border-b border-neutral-100 px-4 py-3"><h2 id="lifecycle-title" className="text-xs font-semibold text-neutral-800">Participant lifecycle</h2></div>
          <div className="flex flex-wrap items-center gap-2 p-4 text-xs font-medium text-neutral-600">
            {['Registration', 'Participant', 'Attendance', 'Certificate'].map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded border border-neutral-200 bg-neutral-50 px-3 py-2">{step}</span>
                {index < 3 && <span aria-hidden="true" className="text-neutral-300">→</span>}
              </div>
            ))}
          </div>
        </section>
        <div className="flex items-center rounded-md border border-neutral-200 bg-white p-4 text-xs leading-relaxed text-neutral-600">
          Actor, change details, and timestamps are supplied by the audit service. No historical records are available while disconnected.
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-neutral-200 bg-white p-3 lg:flex-row lg:items-center">
        <label className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search records" className="w-full rounded border border-neutral-200 bg-neutral-50 py-2 pl-8 pr-3 text-xs outline-none focus:border-neutral-800" />
        </label>
        <select value={recordType} onChange={(event) => setRecordType(event.target.value)} aria-label="Record type" className="rounded border border-neutral-200 bg-white px-2.5 py-2 text-xs text-neutral-700">
          {RECORD_TYPES.map((type) => <option key={type}>{type}</option>)}
        </select>
        <select disabled aria-label="Event filter" className="rounded border border-neutral-200 bg-neutral-50 px-2.5 py-2 text-xs text-neutral-500"><option>No connected events</option></select>
        <label className="flex items-center gap-2 text-[10px] font-mono text-neutral-500">FROM<input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="rounded border border-neutral-200 px-2 py-2 text-xs text-neutral-700" /></label>
        <label className="flex items-center gap-2 text-[10px] font-mono text-neutral-500">TO<input type="date" min={from || undefined} value={to} onChange={(event) => setTo(event.target.value)} className="rounded border border-neutral-200 px-2 py-2 text-xs text-neutral-700" /></label>
      </div>

      <section className="overflow-hidden rounded-md border border-neutral-200 bg-white" aria-label="Historical records">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[740px] border-collapse text-left">
            <thead className="bg-neutral-50"><tr>{COLUMNS.map((column) => <th key={column} scope="col" className="border-b border-neutral-200 px-3 py-2.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">{column}</th>)}</tr></thead>
            <tbody><tr><td colSpan={COLUMNS.length}><EmptyState icon={ClipboardList} title="No records available" description="Registration, check-in, certificate, event archive, and audit records will appear here from connected services." compact /></td></tr></tbody>
          </table>
        </div>
      </section>
    </section>
  );
}