import { useState } from 'react';
import { Camera, Check, Clock3, QrCode, ScanLine, ShieldAlert, UserRound } from 'lucide-react';
import { attendanceService } from '../services/attendanceService';
import type { QRValidationResult } from '../types/domain';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';

type ScanState =
  | { status: 'idle' }
  | { status: 'not_connected'; message: string }
  | { status: 'validated'; result: QRValidationResult };

export function AttendancePage() {
  const [eventId, setEventId] = useState('');
  const [payload, setPayload] = useState('');
  const [scanState, setScanState] = useState<ScanState>({ status: 'idle' });

  async function validateCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!eventId || !payload.trim()) return;
    const result = await attendanceService.validateQr(payload.trim(), eventId);
    if (result.status === 'not_connected') {
      setScanState({ status: 'not_connected', message: result.error });
      return;
    }
    if (result.status === 'error') {
      setScanState({ status: 'not_connected', message: result.error });
      return;
    }
    setScanState({ status: 'validated', result: result.data });
  }

  const validation = scanState.status === 'validated' ? scanState.result : null;

  return (
    <section className="flex flex-col gap-5" aria-labelledby="page-title">
      <PageHeader title="Attendance" description="Validate a participant QR against the selected event before recording check-in." />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <section className="rounded-md border border-neutral-200 bg-white p-4 sm:p-5" aria-labelledby="scanner-title">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 id="scanner-title" className="text-sm font-semibold text-neutral-900">QR check-in</h2>
              <p className="mt-1 text-xs text-neutral-500">The service validates registration, event, eligibility, and check-in window.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded border border-neutral-200 bg-neutral-50 px-2 py-1 text-[10px] font-mono uppercase text-neutral-600">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
              Not connected
            </span>
          </div>

          <div className="mt-4 flex aspect-[4/3] max-h-80 items-center justify-center overflow-hidden rounded border border-dashed border-neutral-300 bg-neutral-50">
            <div className="flex flex-col items-center gap-3 px-5 text-center">
              <div className="relative flex h-24 w-24 items-center justify-center text-neutral-300">
                <QrCode className="h-20 w-20 stroke-[1]" aria-hidden="true" />
                <ScanLine className="absolute h-7 w-7 text-neutral-500" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-700">Camera scanner unavailable</p>
                <p className="mt-1 text-[11px] text-neutral-500">Connect the attendance service to validate QR codes.</p>
              </div>
              <button type="button" disabled title="QR scanning requires the attendance service" className="inline-flex items-center gap-2 rounded border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-400 disabled:cursor-not-allowed">
                <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                Start camera
              </button>
            </div>
          </div>

          <form className="mt-4 grid gap-3 sm:grid-cols-[1fr_1.4fr_auto] sm:items-end" onSubmit={validateCode}>
            <label className="flex flex-col gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">
              Event
              <select value={eventId} onChange={(event) => setEventId(event.target.value)} className="rounded border border-neutral-200 bg-white px-2.5 py-2 text-xs font-sans font-normal normal-case tracking-normal text-neutral-700">
                <option value="">Select connected event</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">
              QR payload
              <input value={payload} onChange={(event) => setPayload(event.target.value)} autoComplete="off" placeholder="Scan or enter QR payload" className="rounded border border-neutral-200 px-2.5 py-2 text-xs font-sans font-normal normal-case tracking-normal text-neutral-800 outline-none focus:border-neutral-800" />
            </label>
            <button type="submit" disabled={!eventId || !payload.trim()} className="inline-flex items-center justify-center gap-2 rounded bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300">
              <ScanLine className="h-3.5 w-3.5" aria-hidden="true" />
              Validate
            </button>
          </form>
          {scanState.status === 'not_connected' && (
            <p role="status" className="mt-3 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">{scanState.message}</p>
          )}
        </section>

        <section className="rounded-md border border-neutral-200 bg-white" aria-labelledby="validation-title">
          <div className="border-b border-neutral-100 px-4 py-3">
            <h2 id="validation-title" className="text-xs font-semibold text-neutral-800">Validation result</h2>
          </div>
          {!validation ? (
            <EmptyState icon={ShieldAlert} title="No QR validated" description="Participant details and check-in confirmation will appear after a real service response." compact />
          ) : validation.status !== 'valid' ? (
            <div role="alert" className="flex items-start gap-3 p-4 text-rose-700">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <div><h3 className="text-xs font-semibold">{validation.status.replaceAll('_', ' ')}</h3><p className="mt-1 text-xs">{validation.message}</p></div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700"><Check className="h-4 w-4" /> Valid registration</div>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs">
                <dt className="text-neutral-500">Participant</dt><dd className="text-neutral-800">{validation.participant.name}</dd>
                <dt className="text-neutral-500">Email</dt><dd className="break-all text-neutral-800">{validation.participant.email}</dd>
                <dt className="text-neutral-500">Registration ID</dt><dd className="break-all font-mono text-neutral-800">{validation.registrationId}</dd>
                <dt className="text-neutral-500">Team</dt><dd className="text-neutral-800">{validation.team?.name ?? 'Individual registration'}</dd>
                <dt className="text-neutral-500">QR ID</dt><dd className="break-all font-mono text-neutral-800">{validation.qrId}</dd>
              </dl>
              <button type="button" disabled className="inline-flex items-center justify-center gap-2 rounded bg-neutral-900 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-neutral-300" title="Check-in confirmation requires a connected attendance service">
                <Check className="h-3.5 w-3.5" aria-hidden="true" /> Confirm check-in
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 border-t border-neutral-100 px-4 py-3 text-[10px] font-mono text-neutral-500">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            Check-in window and duplicate status are service-validated.
            <UserRound className="ml-auto h-3.5 w-3.5" aria-hidden="true" />
          </div>
        </section>
      </div>
    </section>
  );
}