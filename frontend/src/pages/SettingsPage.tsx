import { Cable, Settings2 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';

export function SettingsPage() {
  return (
    <section className="flex flex-col gap-5" aria-labelledby="page-title">
      <PageHeader title="Settings" description="Platform configuration becomes available through the connected organization services." />

      <section className="max-w-3xl rounded-md border border-neutral-200 bg-white" aria-labelledby="connection-title">
        <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-3">
          <Cable className="h-4 w-4 text-neutral-600" aria-hidden="true" />
          <h2 id="connection-title" className="text-sm font-semibold text-neutral-900">Platform connection</h2>
        </div>
        <div className="flex items-start gap-3 p-4">
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-neutral-400" />
          <div>
            <p className="text-xs font-semibold text-neutral-800">Backend not connected</p>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-neutral-500">
              Organization, registration, attendance, and certificate settings will be loaded from their services. No settings are saved locally by this screen.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-3xl rounded-md border border-dashed border-neutral-300 bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-neutral-100 text-neutral-500"><Settings2 className="h-4 w-4" aria-hidden="true" /></div>
          <div>
            <h2 className="text-xs font-semibold text-neutral-800">No configuration available</h2>
            <p className="mt-1 text-xs text-neutral-500">Settings will appear when an organization is connected.</p>
          </div>
        </div>
      </section>
    </section>
  );
}