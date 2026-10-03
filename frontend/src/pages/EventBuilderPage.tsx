import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ImagePlus } from 'lucide-react';
import { eventService } from '../services/eventService';
import type { EventRecord } from '../types/domain';
import { PageHeader } from '../components/ui/PageHeader';

interface EventFormValues {
  name: string;
  description: string;
  category: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  registrationOpensAt: string;
  registrationDeadline: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  locationType: EventRecord['locationType'];
  venue: string;
  block: string;
  room: string;
  eligibility: string;
  registrationType: EventRecord['registrationType'];
  participantCapacity: string;
  teamCapacity: string;
  teamMinimumSize: string;
  teamMaximumSize: string;
}

const INITIAL_FORM: EventFormValues = {
  name: '', description: '', category: '', organizerName: '', organizerEmail: '', organizerPhone: '',
  registrationOpensAt: '', registrationDeadline: '', eventDate: '', startTime: '', endTime: '',
  locationType: 'physical', venue: '', block: '', room: '', eligibility: '',
  registrationType: 'individual', participantCapacity: '', teamCapacity: '',
  teamMinimumSize: '', teamMaximumSize: '',
};

const FIELD_CLASS = 'w-full rounded border border-neutral-200 px-2.5 py-2 text-xs text-neutral-800 outline-none focus:border-neutral-800';
const LABEL_CLASS = 'flex flex-col gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500';

function nullableNumber(value: string) {
  return value.trim() ? Number(value) : null;
}

export function EventBuilderPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [posterName, setPosterName] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [serviceMessage, setServiceMessage] = useState<string | null>(null);

  function update<K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submitEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationMessage(null);
    setServiceMessage(null);

    if (!form.name.trim()) {
      setValidationMessage('Enter an event name before saving.');
      return;
    }
    for (const [label, value] of [
      ['Participant capacity', form.participantCapacity],
      ['Team capacity', form.teamCapacity],
      ['Minimum team size', form.teamMinimumSize],
      ['Maximum team size', form.teamMaximumSize],
    ]) {
      if (value && (!Number.isInteger(Number(value)) || Number(value) < 1)) {
        setValidationMessage(`${label} must be a whole number greater than zero.`);
        return;
      }
    }
    if (form.teamMinimumSize && form.teamMaximumSize && Number(form.teamMinimumSize) > Number(form.teamMaximumSize)) {
      setValidationMessage('Minimum team size cannot exceed maximum team size.');
      return;
    }

    const result = await eventService.createEvent({
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      organizerName: form.organizerName.trim(),
      organizerEmail: form.organizerEmail.trim(),
      organizerPhone: form.organizerPhone.trim(),
      posterUrl: null,
      registrationOpensAt: form.registrationOpensAt || null,
      registrationDeadline: form.registrationDeadline || null,
      eventDate: form.eventDate || null,
      startTime: form.startTime || null,
      endTime: form.endTime || null,
      locationType: form.locationType,
      venue: form.venue.trim() || null,
      block: form.block.trim() || null,
      room: form.room.trim() || null,
      eligibility: form.eligibility.trim(),
      registrationType: form.registrationType,
      participantCapacity: nullableNumber(form.participantCapacity),
      teamCapacity: nullableNumber(form.teamCapacity),
      teamMinimumSize: nullableNumber(form.teamMinimumSize),
      teamMaximumSize: nullableNumber(form.teamMaximumSize),
    });
    setServiceMessage(result.error);
  }

  return (
    <section className="flex flex-col gap-5" aria-labelledby="page-title">
      <PageHeader
        eyebrow="EVENTS / BUILDER"
        title="Create event"
        description="Configure event details and registration constraints. Saving requires the event service."
        action={<Link to="/events" className="inline-flex items-center gap-2 rounded border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"><ArrowLeft className="h-3.5 w-3.5" /> Events</Link>}
      />

      <form onSubmit={submitEvent} className="flex flex-col gap-4">
        <fieldset className="grid gap-4 rounded-md border border-neutral-200 bg-white p-4 sm:grid-cols-2">
          <legend className="px-1 text-xs font-semibold text-neutral-800">Basic information</legend>
          <label className={`${LABEL_CLASS} sm:col-span-2`}>Event name *<input required value={form.name} onChange={(event) => update('name', event.target.value)} className={FIELD_CLASS} /></label>
          <label className={`${LABEL_CLASS} sm:col-span-2`}>Description<textarea value={form.description} onChange={(event) => update('description', event.target.value)} rows={3} className={FIELD_CLASS} /></label>
          <label className={LABEL_CLASS}>Category<input value={form.category} onChange={(event) => update('category', event.target.value)} className={FIELD_CLASS} /></label>
          <label className={LABEL_CLASS}>Organizer / contact name<input value={form.organizerName} onChange={(event) => update('organizerName', event.target.value)} className={FIELD_CLASS} /></label>
          <label className={LABEL_CLASS}>Contact email<input type="email" value={form.organizerEmail} onChange={(event) => update('organizerEmail', event.target.value)} className={FIELD_CLASS} /></label>
          <label className={LABEL_CLASS}>Contact phone<input type="tel" value={form.organizerPhone} onChange={(event) => update('organizerPhone', event.target.value)} className={FIELD_CLASS} /></label>
          <label className={`${LABEL_CLASS} sm:col-span-2`}>
            Poster / thumbnail
            <span className="flex items-center gap-2 rounded border border-neutral-200 px-2.5 py-2 text-xs font-sans font-normal normal-case tracking-normal text-neutral-500"><ImagePlus className="h-4 w-4" />{posterName || 'Choose a local image'}</span>
            <input type="file" accept="image/*" onChange={(event) => setPosterName(event.target.files?.[0]?.name ?? '')} className="sr-only" />
            <span className="font-sans text-[10px] font-normal normal-case tracking-normal">Selected file is local only and will not be uploaded.</span>
          </label>
        </fieldset>

        <fieldset className="grid gap-4 rounded-md border border-neutral-200 bg-white p-4 sm:grid-cols-2 xl:grid-cols-3">
          <legend className="px-1 text-xs font-semibold text-neutral-800">Schedule</legend>
          <label className={LABEL_CLASS}>Registration opens<input type="datetime-local" value={form.registrationOpensAt} onChange={(event) => update('registrationOpensAt', event.target.value)} className={FIELD_CLASS} /></label>
          <label className={LABEL_CLASS}>Registration deadline<input type="datetime-local" value={form.registrationDeadline} onChange={(event) => update('registrationDeadline', event.target.value)} className={FIELD_CLASS} /></label>
          <label className={LABEL_CLASS}>Event date<input type="date" value={form.eventDate} onChange={(event) => update('eventDate', event.target.value)} className={FIELD_CLASS} /></label>
          <label className={LABEL_CLASS}>Start time<input type="time" value={form.startTime} onChange={(event) => update('startTime', event.target.value)} className={FIELD_CLASS} /></label>
          <label className={LABEL_CLASS}>End time<input type="time" value={form.endTime} onChange={(event) => update('endTime', event.target.value)} className={FIELD_CLASS} /></label>
        </fieldset>

        <fieldset className="grid gap-4 rounded-md border border-neutral-200 bg-white p-4 sm:grid-cols-2 xl:grid-cols-4">
          <legend className="px-1 text-xs font-semibold text-neutral-800">Location</legend>
          <label className={LABEL_CLASS}>Format<select value={form.locationType} onChange={(event) => update('locationType', event.target.value as EventFormValues['locationType'])} className={FIELD_CLASS}><option value="physical">Physical</option><option value="online">Online</option><option value="hybrid">Hybrid</option></select></label>
          <label className={LABEL_CLASS}>Venue<input value={form.venue} onChange={(event) => update('venue', event.target.value)} className={FIELD_CLASS} /></label>
          <label className={LABEL_CLASS}>Block<input value={form.block} onChange={(event) => update('block', event.target.value)} className={FIELD_CLASS} /></label>
          <label className={LABEL_CLASS}>Room<input value={form.room} onChange={(event) => update('room', event.target.value)} className={FIELD_CLASS} /></label>
        </fieldset>

        <fieldset className="grid gap-4 rounded-md border border-neutral-200 bg-white p-4 sm:grid-cols-2">
          <legend className="px-1 text-xs font-semibold text-neutral-800">Eligibility and registration</legend>
          <label className={`${LABEL_CLASS} sm:col-span-2`}>Participant eligibility<textarea value={form.eligibility} onChange={(event) => update('eligibility', event.target.value)} rows={2} className={FIELD_CLASS} /></label>
          <label className={LABEL_CLASS}>Registration type<select value={form.registrationType} onChange={(event) => update('registrationType', event.target.value as EventFormValues['registrationType'])} className={FIELD_CLASS}><option value="individual">Individual</option><option value="team">Team</option><option value="both">Individual and team</option></select></label>
          <label className={LABEL_CLASS}>Participant capacity<input type="number" min="1" value={form.participantCapacity} onChange={(event) => update('participantCapacity', event.target.value)} className={FIELD_CLASS} /></label>
          {(form.registrationType === 'team' || form.registrationType === 'both') && <>
            <label className={LABEL_CLASS}>Team capacity<input type="number" min="1" value={form.teamCapacity} onChange={(event) => update('teamCapacity', event.target.value)} className={FIELD_CLASS} /></label>
            <label className={LABEL_CLASS}>Minimum team size<input type="number" min="1" value={form.teamMinimumSize} onChange={(event) => update('teamMinimumSize', event.target.value)} className={FIELD_CLASS} /></label>
            <label className={LABEL_CLASS}>Maximum team size<input type="number" min="1" value={form.teamMaximumSize} onChange={(event) => update('teamMaximumSize', event.target.value)} className={FIELD_CLASS} /></label>
          </>}
        </fieldset>

        {validationMessage && <p role="alert" className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">{validationMessage}</p>}
        {serviceMessage && <p role="status" className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">{serviceMessage}</p>}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/events/registration-form" className="text-xs font-medium text-neutral-700 underline underline-offset-2">Configure registration form</Link>
          <button type="submit" className="rounded bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-700">Save event</button>
        </div>
      </form>
    </section>
  );
}