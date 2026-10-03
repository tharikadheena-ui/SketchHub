import { useState } from 'react';
import { Download } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { exportService, type ExportCategory } from '../services/exportService';

const CATEGORIES: Array<{ value: ExportCategory; label: string }> = [
  { value: 'registrations', label: 'Registrations' },
  { value: 'participants', label: 'Participants' },
  { value: 'attendance', label: 'Attendance' },
  { value: 'certificates', label: 'Certificates' },
  { value: 'audit', label: 'Audit records' },
];

export function ExportsPage() {
  const [category, setCategory] = useState<ExportCategory>('registrations');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  async function requestExport() {
    const result = await exportService.createExport({ category, from: from || undefined, to: to || undefined });
    setMessage(result.status === 'success' ? 'Export ready.' : result.error);
  }

  return (
    <section className="flex flex-col gap-5" aria-labelledby="page-title">
      <PageHeader title="Exports" description="Prepare filtered exports from connected SketchHUB records." />

      <section className="rounded-md border border-neutral-200 bg-white" aria-labelledby="export-config-title">
        <div className="border-b border-neutral-100 px-4 py-3"><h2 id="export-config-title" className="text-sm font-semibold text-neutral-900">Export configuration</h2></div>
        <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="flex flex-col gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">
            Record type
            <select value={category} onChange={(event) => setCategory(event.target.value as ExportCategory)} className="rounded border border-neutral-200 bg-white px-2.5 py-2 text-xs font-sans font-normal normal-case tracking-normal text-neutral-700">
              {CATEGORIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">
            Event
            <select disabled className="rounded border border-neutral-200 bg-neutral-50 px-2.5 py-2 text-xs font-sans font-normal normal-case tracking-normal text-neutral-500"><option>No connected events</option></select>
          </label>
          <label className="flex flex-col gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">
            From
            <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="rounded border border-neutral-200 px-2.5 py-2 text-xs font-sans font-normal normal-case tracking-normal text-neutral-700" />
          </label>
          <label className="flex flex-col gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">
            To
            <input type="date" value={to} onChange={(event) => setTo(event.target.value)} min={from || undefined} className="rounded border border-neutral-200 px-2.5 py-2 text-xs font-sans font-normal normal-case tracking-normal text-neutral-700" />
          </label>
          <div className="flex items-end md:col-span-2 xl:col-span-4">
            <button type="button" onClick={requestExport} className="inline-flex items-center gap-2 rounded bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-700">
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Request export
            </button>
          </div>
        </div>
      </section>

      {message ? (
        <div role="status" className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">{message}</div>
      ) : (
        <div className="rounded-md border border-dashed border-neutral-300 bg-white">
          <EmptyState icon={Download} title="No export requested" description="Requests will appear here after the export service is connected. No file is created by this frontend." />
        </div>
      )}
    </section>
  );
}