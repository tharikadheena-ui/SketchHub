import { useState, type FormEvent } from 'react';
import { ArrowLeft, Eye, Plus, Trash2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { registrationService } from '../services/registrationService';
import type { RegistrationForm, RegistrationQuestion, RegistrationQuestionType } from '../types/domain';

const QUESTION_TYPES: Array<{ value: RegistrationQuestionType; label: string }> = [
  { value: 'short_answer', label: 'Short answer' },
  { value: 'long_answer', label: 'Long answer' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'multiple_choice', label: 'Multiple choice' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'file_upload', label: 'File upload' },
];

function makeQuestion(): RegistrationQuestion {
  return { id: crypto.randomUUID(), prompt: '', type: 'short_answer', required: false };
}

export function RegistrationFormBuilderPage() {
  const { eventId } = useParams();
  const [registrationType, setRegistrationType] = useState<RegistrationForm['registrationType']>('individual');
  const [questions, setQuestions] = useState<RegistrationQuestion[]>([]);
  const [minimumSize, setMinimumSize] = useState('');
  const [maximumSize, setMaximumSize] = useState('');
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function updateQuestion(id: string, updates: Partial<RegistrationQuestion>) {
    setQuestions((current) => current.map((question) => question.id === id ? { ...question, ...updates } : question));
  }

  async function saveForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (questions.some((question) => !question.prompt.trim())) {
      setMessage('Add text to each question before saving.');
      return;
    }
    const result = await registrationService.saveForm({
      eventId: eventId ?? null,
      registrationType,
      questions,
      isPublished: false,
      teamMinimumSize: minimumSize ? Number(minimumSize) : null,
      teamMaximumSize: maximumSize ? Number(maximumSize) : null,
    });
    setMessage(result.status === 'success' ? 'Form saved.' : result.error);
  }

  async function publishForm() {
    if (!eventId) {
      setMessage('Save an event before publishing its registration form.');
      return;
    }
    const result = await registrationService.publishForm(eventId);
    setMessage(result.status === 'success' ? 'Form published.' : result.error);
  }

  return (
    <section className="flex flex-col gap-5" aria-labelledby="page-title">
      <PageHeader
        eyebrow="EVENTS / REGISTRATION FORM"
        title="Registration form builder"
        description="Configure event questions and preview the participant form. Saving and publishing require a connected event service."
        action={<Link to="/events/new" className="inline-flex items-center gap-2 rounded border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"><ArrowLeft className="h-3.5 w-3.5" /> Event details</Link>}
      />

      <form onSubmit={saveForm} className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
        <div className="flex flex-col gap-4">
          <section className="rounded-md border border-neutral-200 bg-white p-4">
            <fieldset>
              <legend className="text-xs font-semibold text-neutral-800">Registration type</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {(['individual', 'team', 'both'] as const).map((type) => (
                  <label key={type} className={`cursor-pointer rounded border px-3 py-2 text-xs capitalize ${registrationType === type ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'}`}>
                    <input type="radio" name="registrationType" value={type} checked={registrationType === type} onChange={() => setRegistrationType(type)} className="sr-only" />
                    {type === 'both' ? 'Individual and team' : type}
                  </label>
                ))}
              </div>
            </fieldset>
            {(registrationType === 'team' || registrationType === 'both') && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">Minimum team size<input type="number" min="1" value={minimumSize} onChange={(event) => setMinimumSize(event.target.value)} className="rounded border border-neutral-200 px-2.5 py-2 text-xs font-sans font-normal normal-case tracking-normal text-neutral-800" /></label>
                <label className="flex flex-col gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">Maximum team size<input type="number" min="1" value={maximumSize} onChange={(event) => setMaximumSize(event.target.value)} className="rounded border border-neutral-200 px-2.5 py-2 text-xs font-sans font-normal normal-case tracking-normal text-neutral-800" /></label>
              </div>
            )}
          </section>

          <section className="rounded-md border border-neutral-200 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
              <div><h2 className="text-xs font-semibold text-neutral-800">Event-specific questions</h2><p className="mt-1 text-[10px] text-neutral-500">Question configuration is held in this browser until a service is connected.</p></div>
              <button type="button" onClick={() => setQuestions((current) => [...current, makeQuestion()])} className="inline-flex items-center gap-1.5 rounded border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"><Plus className="h-3.5 w-3.5" /> Add question</button>
            </div>
            <div className="flex flex-col gap-3 p-4">
              {questions.length === 0 ? (
                <EmptyState icon={Plus} title="No questions added" description="Add short or long answers, choices, checkboxes, or file uploads." compact />
              ) : questions.map((question, index) => (
                <fieldset key={question.id} className="rounded border border-neutral-200 p-3">
                  <legend className="px-1 text-[10px] font-mono uppercase tracking-wider text-neutral-500">Question {index + 1}</legend>
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <label className="flex flex-col gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">Question text<input value={question.prompt} onChange={(event) => updateQuestion(question.id, { prompt: event.target.value })} className="rounded border border-neutral-200 px-2.5 py-2 text-xs font-sans font-normal normal-case tracking-normal text-neutral-800" /></label>
                    <label className="flex flex-col gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">Type<select value={question.type} onChange={(event) => updateQuestion(question.id, { type: event.target.value as RegistrationQuestionType, options: undefined })} className="rounded border border-neutral-200 bg-white px-2.5 py-2 text-xs font-sans font-normal normal-case tracking-normal text-neutral-700">{QUESTION_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label>
                  </div>
                  {(question.type === 'dropdown' || question.type === 'multiple_choice' || question.type === 'checkbox') && (
                    <label className="mt-3 flex flex-col gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">Options<textarea value={question.options?.join('\n') ?? ''} onChange={(event) => updateQuestion(question.id, { options: event.target.value.split('\n').filter((option) => option.trim()).map((option) => option.trim()) })} rows={3} className="rounded border border-neutral-200 px-2.5 py-2 text-xs font-sans font-normal normal-case tracking-normal text-neutral-800" /></label>
                  )}
                  {question.type === 'short_answer' || question.type === 'long_answer' ? (
                    <label className="mt-3 flex max-w-xs flex-col gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">Maximum answer length<input type="number" min="1" value={question.maxLength ?? ''} onChange={(event) => updateQuestion(question.id, { maxLength: event.target.value ? Number(event.target.value) : undefined })} className="rounded border border-neutral-200 px-2.5 py-2 text-xs font-sans font-normal normal-case tracking-normal text-neutral-800" /></label>
                  ) : null}
                  {question.type === 'file_upload' && (
                    <label className="mt-3 flex flex-col gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">Accepted file types<input value={question.acceptedFileTypes?.join(', ') ?? ''} onChange={(event) => updateQuestion(question.id, { acceptedFileTypes: event.target.value.split(',').map((type) => type.trim()).filter(Boolean) })} className="rounded border border-neutral-200 px-2.5 py-2 text-xs font-sans font-normal normal-case tracking-normal text-neutral-800" /></label>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <label className="inline-flex items-center gap-2 text-xs text-neutral-700"><input type="checkbox" checked={question.required} onChange={(event) => updateQuestion(question.id, { required: event.target.checked })} className="accent-neutral-900" /> Required</label>
                    <button type="button" aria-label={`Remove question ${index + 1}`} onClick={() => setQuestions((current) => current.filter((item) => item.id !== question.id))} className="rounded p-1.5 text-neutral-500 hover:bg-rose-50 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </fieldset>
              ))}
            </div>
          </section>

          {message && <p role="status" className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">{message}</p>}
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => setPreview((current) => !current)} className="inline-flex items-center gap-2 rounded border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700"><Eye className="h-3.5 w-3.5" />{preview ? 'Hide preview' : 'Preview form'}</button>
            <button type="submit" className="rounded bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-700">Save form draft</button>
            <button type="button" onClick={publishForm} className="rounded border border-neutral-900 px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-100">Publish form</button>
          </div>
        </div>

        <aside className="sticky top-20 rounded-md border border-neutral-200 bg-white" aria-label="Registration form preview">
          <div className="border-b border-neutral-100 px-4 py-3"><h2 className="text-xs font-semibold text-neutral-800">Participant preview</h2></div>
          {preview ? (
            <div className="flex flex-col gap-4 p-4">
              {questions.length === 0 ? <p className="text-xs text-neutral-500">Add questions to preview the registration form.</p> : questions.map((question) => (
                <label key={question.id} className="flex flex-col gap-1.5 text-xs font-medium text-neutral-700">
                  {question.prompt || 'Untitled question'}{question.required && <span className="ml-1 text-rose-600" aria-label="required">*</span>}
                  {question.type === 'long_answer' ? <textarea disabled maxLength={question.maxLength} rows={3} className="rounded border border-neutral-200 bg-neutral-50 px-2.5 py-2" /> : question.type === 'dropdown' ? <select disabled className="rounded border border-neutral-200 bg-neutral-50 px-2.5 py-2"><option>Select an option</option>{(question.options ?? []).map((option) => <option key={option}>{option}</option>)}</select> : question.type === 'multiple_choice' || question.type === 'checkbox' ? <div className="flex flex-col gap-2">{(question.options ?? []).map((option) => <span key={option} className="flex items-center gap-2 text-xs font-normal"><input type={question.type === 'checkbox' ? 'checkbox' : 'radio'} disabled />{option}</span>)}</div> : <input disabled maxLength={question.maxLength} accept={question.acceptedFileTypes?.join(',')} type={question.type === 'file_upload' ? 'file' : 'text'} className="rounded border border-neutral-200 bg-neutral-50 px-2.5 py-2" />}
                </label>
              ))}
            </div>
          ) : <EmptyState icon={Eye} title="Preview is hidden" description="Open the preview to inspect the participant form." compact />}
          <div className="border-t border-neutral-100 px-4 py-3 text-[10px] font-mono text-neutral-500">No submissions are created by preview.</div>
        </aside>
      </form>
    </section>
  );
}