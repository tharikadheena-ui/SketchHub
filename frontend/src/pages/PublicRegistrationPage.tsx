import { useEffect, useState, type FormEvent } from 'react';
import { AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { registrationService } from '../services/registrationService';
import type { RegistrationForm, RegistrationSubmission } from '../types/domain';

export function PublicRegistrationPage() {
  const { eventId = '' } = useParams();
  const [form, setForm] = useState<RegistrationForm | null>(null);
  const [message, setMessage] = useState('Loading registration form.');
  const [submissionState, setSubmissionState] = useState<string | null>(null);
  const [registrationType, setRegistrationType] = useState<'individual' | 'team'>('individual');
  const [answers, setAnswers] = useState<Record<string, unknown>>({});

  useEffect(() => {
    let isActive = true;
    void registrationService.getPublicForm(eventId).then((result) => {
      if (!isActive) return;
      if (result.status === 'success') {
        setForm(result.data);
        setRegistrationType(result.data.registrationType === 'team' ? 'team' : 'individual');
        setMessage('');
      } else {
        setMessage(result.error);
      }
    });
    return () => { isActive = false; };
  }, [eventId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    const hasMissingRequiredCheckbox = form.questions.some((question) =>
      question.required &&
      question.type === 'checkbox' &&
      !((answers[question.id] as string[] | undefined)?.length)
    );
    if (hasMissingRequiredCheckbox) {
      setSubmissionState('Complete each required checkbox question.');
      return;
    }
    const values = new FormData(event.currentTarget);
    const submission: RegistrationSubmission = {
      name: String(values.get('participant-name') ?? ''),
      email: String(values.get('participant-email') ?? ''),
      phone: String(values.get('participant-phone') ?? '') || null,
      registrationType,
      teamName: String(values.get('team-name') ?? '') || null,
      teamCode: String(values.get('team-code') ?? '') || null,
      answers,
    };
    const result = await registrationService.submitRegistration(eventId, submission);
    setSubmissionState(result.status === 'success' ? 'Registration submitted.' : result.error);
  }

  if (!form) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-4 py-10">
        <div role="status" className="w-full rounded-md border border-dashed border-neutral-300 bg-white p-8 text-center">
          <AlertCircle className="mx-auto h-5 w-5 text-neutral-500" aria-hidden="true" />
          <h1 className="mt-3 text-sm font-semibold text-neutral-800">Registration form unavailable</h1>
          <p className="mt-1 text-xs text-neutral-500">{message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-4 py-8 sm:py-12">
      <header className="mb-6">
        <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">SKETCHHUB REGISTRATION</p>
        <h1 className="mt-1 text-2xl font-bold text-neutral-900">Event registration</h1>
        <p className="mt-1 text-xs text-neutral-500">Submit details to the event registration service.</p>
      </header>
      <form onSubmit={submit} className="flex flex-col gap-4 rounded-md border border-neutral-200 bg-white p-4 sm:p-6">
        <fieldset className="grid gap-3 sm:grid-cols-2">
          <legend className="mb-3 text-xs font-semibold text-neutral-800">Participant details</legend>
          <label className="flex flex-col gap-1.5 text-xs font-medium text-neutral-700">Name<input name="participant-name" required className="rounded border border-neutral-200 px-2.5 py-2 text-xs outline-none focus:border-neutral-800" /></label>
          <label className="flex flex-col gap-1.5 text-xs font-medium text-neutral-700">Email<input name="participant-email" type="email" required className="rounded border border-neutral-200 px-2.5 py-2 text-xs outline-none focus:border-neutral-800" /></label>
          <label className="flex flex-col gap-1.5 text-xs font-medium text-neutral-700">Phone<input name="participant-phone" type="tel" className="rounded border border-neutral-200 px-2.5 py-2 text-xs outline-none focus:border-neutral-800" /></label>
        </fieldset>
        {form.registrationType === 'both' && (
          <label className="flex flex-col gap-1.5 text-xs font-medium text-neutral-700">Registration type<select value={registrationType} onChange={(event) => setRegistrationType(event.target.value as 'individual' | 'team')} className="rounded border border-neutral-200 bg-white px-2.5 py-2 text-xs"><option value="individual">Individual</option><option value="team">Team</option></select></label>
        )}
        {registrationType === 'team' && (
          <fieldset className="grid gap-3 sm:grid-cols-2">
            <legend className="mb-3 text-xs font-semibold text-neutral-800">Team information</legend>
            {(form.teamMinimumSize || form.teamMaximumSize) && <p className="text-xs text-neutral-500 sm:col-span-2">Team size: {form.teamMinimumSize ?? 'No minimum'} to {form.teamMaximumSize ?? 'No maximum'} members.</p>}
            <label className="flex flex-col gap-1.5 text-xs font-medium text-neutral-700">Team name<input name="team-name" className="rounded border border-neutral-200 px-2.5 py-2 text-xs" /></label>
            <label className="flex flex-col gap-1.5 text-xs font-medium text-neutral-700">Team code<input name="team-code" className="rounded border border-neutral-200 px-2.5 py-2 text-xs" /></label>
          </fieldset>
        )}
        {form.questions.map((question) => (
          <label key={question.id} className="flex flex-col gap-1.5 text-xs font-medium text-neutral-700">
            {question.prompt}{question.required && <span className="sr-only">required</span>}{question.required && <span aria-hidden="true" className="text-rose-700">*</span>}
            {question.type === 'long_answer' ? (
              <textarea required={question.required} maxLength={question.maxLength} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} rows={3} className="rounded border border-neutral-200 px-2.5 py-2 text-xs" />
            ) : question.type === 'dropdown' ? (
              <select required={question.required} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} className="rounded border border-neutral-200 bg-white px-2.5 py-2 text-xs"><option value="">Select an option</option>{question.options?.map((option) => <option key={option}>{option}</option>)}</select>
            ) : question.type === 'multiple_choice' || question.type === 'checkbox' ? (
              <span className="flex flex-col gap-2">{question.options?.map((option) => <span key={option} className="inline-flex items-center gap-2"><input type={question.type === 'checkbox' ? 'checkbox' : 'radio'} name={question.id} required={question.required && question.type === 'multiple_choice'} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: question.type === 'checkbox' ? [...((current[question.id] as string[] | undefined) ?? []).filter((value) => value !== option), ...(event.target.checked ? [option] : [])] : option }))} />{option}</span>)}</span>
            ) : question.type === 'file_upload' ? (
              <input type="file" required={question.required} accept={question.acceptedFileTypes?.join(',')} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.files?.[0] ?? null }))} className="rounded border border-neutral-200 px-2.5 py-2 text-xs" />
            ) : (
              <input required={question.required} maxLength={question.maxLength} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} className="rounded border border-neutral-200 px-2.5 py-2 text-xs" />
            )}
          </label>
        ))}
        {submissionState && <p role="status" className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">{submissionState}</p>}
        <button type="submit" className="w-fit rounded bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-700">Submit registration</button>
      </form>
    </main>
  );
}