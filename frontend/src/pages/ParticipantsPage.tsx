import { useState } from 'react';
import { Search, UsersRound } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { participantService } from '../services/participantService';

const COLUMNS = ['Participant', 'Registration ID', 'Email', 'Phone', 'Type', 'Team', 'Status'];

export function ParticipantsPage() {
  const [search, setSearch] = useState('');
  const [registrationType, setRegistrationType] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [teamMode, setTeamMode] = useState<'create' | 'join'>('create');
  const [teamName, setTeamName] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [teamMessage, setTeamMessage] = useState<string | null>(null);

  async function joinTeam() {
    const result = await participantService.joinTeam(teamCode.trim());
    setTeamMessage(result.status === 'success' ? 'Team joined.' : result.error);
  }

  return (
    <section className="flex flex-col gap-5" aria-labelledby="page-title">
      <PageHeader title="Participants" description="Search participant profiles, registrations, and team membership." />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {['Total participants', 'Team participants', 'Individual participants', 'Registration status'].map((label) => (
          <div key={label} className="rounded-md border border-neutral-200 bg-white p-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">{label}</div>
            <div className="mt-3 font-mono text-2xl font-bold text-neutral-400">—</div>
            <div className="mt-1 text-[10px] font-mono text-neutral-400">Not connected</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-neutral-200 bg-white p-3 lg:flex-row lg:items-center">
        <label className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search participants"
            className="w-full rounded border border-neutral-200 bg-neutral-50 py-2 pl-8 pr-3 text-xs outline-none focus:border-neutral-800"
          />
        </label>
        <label className="flex items-center gap-2 text-[10px] font-mono text-neutral-500">
          TYPE
          <select value={registrationType} onChange={(event) => setRegistrationType(event.target.value)} className="rounded border border-neutral-200 bg-white px-2 py-2 text-xs text-neutral-700">
            <option value="all">All types</option>
            <option value="individual">Individual</option>
            <option value="team">Team</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-[10px] font-mono text-neutral-500">
          STATUS
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded border border-neutral-200 bg-white px-2 py-2 text-xs text-neutral-700">
            <option value="all">All statuses</option>
            <option value="registered">Registered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-[10px] font-mono text-neutral-500">
          SORT
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded border border-neutral-200 bg-white px-2 py-2 text-xs text-neutral-700">
            <option value="name">Name</option>
            <option value="registration">Registration date</option>
            <option value="status">Status</option>
          </select>
        </label>
      </div>

      <div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] border-collapse text-left">
            <thead className="bg-neutral-50">
              <tr>{COLUMNS.map((column) => <th key={column} scope="col" className="border-b border-neutral-200 px-3 py-2.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">{column}</th>)}</tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={COLUMNS.length}>
                  <EmptyState icon={UsersRound} title="No participant data available" description="Participant records will appear here when registration data is connected. Team details are shown with their members." compact />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <section className="rounded-md border border-neutral-200 bg-white" aria-labelledby="team-management-title">
        <div className="flex flex-col gap-3 border-b border-neutral-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="team-management-title" className="text-xs font-semibold text-neutral-800">Team registration</h2>
            <p className="mt-1 text-[10px] text-neutral-500">Teams are managed within event registration and participant records.</p>
          </div>
          <div role="tablist" aria-label="Team action" className="inline-flex w-fit rounded border border-neutral-200 p-1">
            {(['create', 'join'] as const).map((mode) => <button key={mode} type="button" role="tab" aria-selected={teamMode === mode} onClick={() => setTeamMode(mode)} className={`rounded px-3 py-1.5 text-xs capitalize ${teamMode === mode ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}>{mode} team</button>)}
          </div>
        </div>
        <div className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)]">
          <div className="grid gap-3 sm:grid-cols-2">
            {teamMode === 'create' ? (
              <>
                <label className="flex flex-col gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">Team name<input value={teamName} onChange={(event) => setTeamName(event.target.value)} className="rounded border border-neutral-200 px-2.5 py-2 text-xs font-sans font-normal normal-case tracking-normal text-neutral-800" /></label>
                <label className="flex flex-col gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">Event<select disabled className="rounded border border-neutral-200 bg-neutral-50 px-2.5 py-2 text-xs font-sans font-normal normal-case tracking-normal text-neutral-500"><option>No connected events</option></select></label>
                <button type="button" disabled title="Team creation requires a connected event and participant service" className="w-fit rounded bg-neutral-900 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-neutral-300">Create team</button>
                <button type="button" disabled title="An invite link is available after a team is created" className="w-fit rounded border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-400 disabled:cursor-not-allowed">Create invite link</button>
              </>
            ) : (
              <>
                <label className="flex flex-col gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">Team code<input value={teamCode} onChange={(event) => setTeamCode(event.target.value)} className="rounded border border-neutral-200 px-2.5 py-2 text-xs font-sans font-normal normal-case tracking-normal text-neutral-800" /></label>
                <div className="flex items-end"><button type="button" disabled={!teamCode.trim()} onClick={joinTeam} title="Joining a team requires a connected participant service" className="rounded bg-neutral-900 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-neutral-300">Join team</button></div>
              </>
            )}
          </div>
          <div className="rounded border border-dashed border-neutral-300 bg-neutral-50">
            <EmptyState icon={UsersRound} title="No team data available" description="Team members, capacity, codes, and invitations will appear when participant services are connected." compact />
          </div>
          {teamMessage && <p role="status" className="mx-4 mb-4 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">{teamMessage}</p>}
        </div>
      </section>
    </section>
  );
}