import { useEffect, useState } from 'react';
import { Award, FileUp, Mail, RefreshCw } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';

const COLUMNS = ['Participant', 'Event', 'Eligibility', 'Certificate status', 'Sent at'];

export function CertificatesPage() {
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <section className="flex flex-col gap-5" aria-labelledby="page-title">
      <PageHeader title="Certificates" description="Configure templates, review eligibility, and manage certificate delivery records." />

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-md border border-neutral-200 bg-white p-4" aria-labelledby="template-title">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-neutral-600" aria-hidden="true" />
            <h2 id="template-title" className="text-sm font-semibold text-neutral-900">Certificate template</h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500">Choose a local image or PDF to preview. It will not be uploaded.</p>
          <label className="mt-4 flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded border border-dashed border-neutral-300 bg-neutral-50 px-4 py-5 text-center hover:border-neutral-400">
            <FileUp className="h-5 w-5 text-neutral-500" aria-hidden="true" />
            <span className="text-xs font-medium text-neutral-700">Select template file</span>
            <span className="text-[10px] text-neutral-500">Image or PDF</span>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setTemplateFile(file);
                setPreviewUrl(file ? URL.createObjectURL(file) : null);
              }}
              className="sr-only"
            />
          </label>
          {templateFile && <p className="mt-2 break-all text-xs text-neutral-600">Selected locally: {templateFile.name}</p>}
          {templateFile && (
            <div className="mt-3 flex min-h-36 items-center justify-center overflow-hidden rounded border border-neutral-200 bg-neutral-50 p-2">
              {previewUrl && templateFile.type.startsWith('image/') ? (
                <img src={previewUrl} alt="Selected certificate template preview" className="max-h-64 max-w-full object-contain" />
              ) : previewUrl ? (
                <iframe title="Selected certificate template preview" src={previewUrl} className="h-64 w-full" />
              ) : null}
            </div>
          )}
          <p className="mt-3 text-[10px] font-mono text-neutral-500">Template storage and participant-name placement require a connected certificate service.</p>
        </section>

        <section className="flex flex-col rounded-md border border-neutral-200 bg-white" aria-labelledby="processing-title">
          <div className="border-b border-neutral-100 px-4 py-3">
            <h2 id="processing-title" className="text-sm font-semibold text-neutral-900">Eligibility and processing</h2>
          </div>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <label className="flex flex-col gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">
              Event
              <select disabled className="rounded border border-neutral-200 bg-neutral-50 px-2.5 py-2 text-xs font-sans font-normal normal-case tracking-normal text-neutral-500">
                <option>No connected events</option>
              </select>
            </label>
            <div className="rounded border border-neutral-200 bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-600">
              Eligibility will be calculated from registration and attendance records. No certificate records are currently available.
            </div>
            <div className="mt-auto flex flex-wrap gap-2">
              <button type="button" disabled title="Certificate generation requires connected participant and attendance records" className="inline-flex items-center gap-2 rounded bg-neutral-900 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-neutral-300">Generate certificates</button>
              <button type="button" disabled title="Email delivery requires the certificate service" className="inline-flex items-center gap-2 rounded border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-400 disabled:cursor-not-allowed"><Mail className="h-3.5 w-3.5" /> Distribute by email</button>
              <button type="button" disabled title="Retry requires certificate records" className="inline-flex items-center gap-2 rounded border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-400 disabled:cursor-not-allowed"><RefreshCw className="h-3.5 w-3.5" /> Retry failed</button>
            </div>
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-md border border-neutral-200 bg-white" aria-labelledby="records-title">
        <div className="border-b border-neutral-100 px-4 py-3"><h2 id="records-title" className="text-xs font-semibold text-neutral-800">Certificate records</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead className="bg-neutral-50"><tr>{COLUMNS.map((column) => <th key={column} scope="col" className="border-b border-neutral-200 px-3 py-2.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">{column}</th>)}</tr></thead>
            <tbody><tr><td colSpan={COLUMNS.length}><EmptyState icon={Award} title="No certificate records available" description="Generated, sent, failed, and retry states will appear here after the certificate service is connected." compact /></td></tr></tbody>
          </table>
        </div>
      </section>
    </section>
  );
}