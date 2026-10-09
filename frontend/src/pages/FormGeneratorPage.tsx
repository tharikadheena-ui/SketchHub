import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Eye,
  Save,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  X,
  FileQuestion,
  HelpCircle,
  Calendar,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import {
  formGeneratorService,
  type GoogleFormData,
  type GoogleFormQuestion,
  type GoogleFormQuestionType,
  type GoogleFormQuestionOption,
} from '../services/formGeneratorService';
import { eventService } from '../services/eventService';
import type { EventItem } from '../types/event';

const QUESTION_TYPES: Array<{ value: GoogleFormQuestionType; label: string }> = [
  { value: 'short_answer', label: 'Short answer' },
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'multiple_choice', label: 'Multiple choice' },
  { value: 'checkboxes', label: 'Checkboxes' },
  { value: 'dropdown', label: 'Dropdown' },
];

function createOption(defaultText: string = ''): GoogleFormQuestionOption {
  return {
    id: crypto.randomUUID(),
    text: defaultText,
  };
}

function createQuestion(type: GoogleFormQuestionType = 'short_answer'): GoogleFormQuestion {
  const needsOptions = type === 'multiple_choice' || type === 'checkboxes' || type === 'dropdown';
  return {
    id: crypto.randomUUID(),
    title: '',
    type,
    required: false,
    options: needsOptions ? [createOption('Option 1')] : [],
  };
}

function getInitialFormData(): GoogleFormData {
  return {
    title: 'Event Registration Form',
    description: 'Please fill out this form to register for the event.',
    eventId: null,
    status: 'draft',
    questions: [
      {
        id: crypto.randomUUID(),
        title: 'Full Name',
        type: 'short_answer',
        required: true,
        options: [],
      },
      {
        id: crypto.randomUUID(),
        title: 'Email Address',
        type: 'short_answer',
        required: true,
        options: [],
      },
    ],
  };
}

export function FormGeneratorPage() {
  const [formData, setFormData] = useState<GoogleFormData>(getInitialFormData);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isEventServiceConnected, setIsEventServiceConnected] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(true);

  // UI state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [bannerNotice, setBannerNotice] = useState<{
    type: 'success' | 'warning' | 'error';
    text: string;
  } | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<{
    title?: string;
    questions?: { [questionId: string]: { title?: string; options?: string } };
  }>({});

  // Fetch events if available
  useEffect(() => {
    let isCancelled = false;
    async function loadEvents() {
      setEventsLoading(true);
      try {
        const res = await eventService.fetchEvents();
        if (!isCancelled) {
          setEvents(res.data);
          setIsEventServiceConnected(res.isConnected);
        }
      } catch {
        if (!isCancelled) {
          setIsEventServiceConnected(false);
        }
      } finally {
        if (!isCancelled) {
          setEventsLoading(false);
        }
      }
    }
    void loadEvents();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Form field handlers
  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({ ...prev, title }));
    if (errors.title && title.trim()) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  const handleDescriptionChange = (description: string) => {
    setFormData((prev) => ({ ...prev, description }));
  };

  const handleEventChange = (eventId: string) => {
    setFormData((prev) => ({ ...prev, eventId: eventId || null }));
  };

  // Question handlers
  const handleAddQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, createQuestion('short_answer')],
    }));
    setBannerNotice(null);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
    // Clean up question errors
    setErrors((prev) => {
      if (!prev.questions?.[questionId]) return prev;
      const updatedQuestions = { ...prev.questions };
      delete updatedQuestions[questionId];
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleQuestionTitleChange = (questionId: string, title: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, title } : q
      ),
    }));
    if (errors.questions?.[questionId]?.title && title.trim()) {
      setErrors((prev) => ({
        ...prev,
        questions: {
          ...prev.questions,
          [questionId]: {
            ...prev.questions?.[questionId],
            title: undefined,
          },
        },
      }));
    }
  };

  const handleQuestionTypeChange = (questionId: string, newType: GoogleFormQuestionType) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id !== questionId) return q;
        const needsOptions =
          newType === 'multiple_choice' || newType === 'checkboxes' || newType === 'dropdown';
        let options = q.options;
        if (needsOptions && (!options || options.length === 0)) {
          options = [createOption('Option 1')];
        } else if (!needsOptions) {
          options = [];
        }
        return { ...q, type: newType, options };
      }),
    }));
    // Clean up options error if moving away from options type
    setErrors((prev) => {
      if (!prev.questions?.[questionId]?.options) return prev;
      return {
        ...prev,
        questions: {
          ...prev.questions,
          [questionId]: {
            ...prev.questions?.[questionId],
            options: undefined,
          },
        },
      };
    });
  };

  const handleQuestionRequiredToggle = (questionId: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, required: !q.required } : q
      ),
    }));
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.questions.length) return;
    setFormData((prev) => {
      const updated = [...prev.questions];
      const [item] = updated.splice(index, 1);
      updated.splice(targetIndex, 0, item);
      return { ...prev, questions: updated };
    });
  };

  // Option handlers
  const handleAddOption = (questionId: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id !== questionId) return q;
        const nextNum = (q.options?.length || 0) + 1;
        return {
          ...q,
          options: [...(q.options || []), createOption(`Option ${nextNum}`)],
        };
      }),
    }));
  };

  const handleRemoveOption = (questionId: string, optionId: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id !== questionId) return q;
        const filtered = (q.options || []).filter((opt) => opt.id !== optionId);
        return { ...q, options: filtered };
      }),
    }));
  };

  const handleOptionTextChange = (questionId: string, optionId: string, text: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          options: (q.options || []).map((opt) =>
            opt.id === optionId ? { ...opt, text } : opt
          ),
        };
      }),
    }));
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: {
      title?: string;
      questions?: { [questionId: string]: { title?: string; options?: string } };
    } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Form title is required.';
    }

    const questionErrors: { [questionId: string]: { title?: string; options?: string } } = {};
    let hasQuestionError = false;

    formData.questions.forEach((q, idx) => {
      const qErr: { title?: string; options?: string } = {};
      if (!q.title.trim()) {
        qErr.title = `Question ${idx + 1} title cannot be empty.`;
        hasQuestionError = true;
      }

      const hasOptions =
        q.type === 'multiple_choice' || q.type === 'checkboxes' || q.type === 'dropdown';
      if (hasOptions) {
        if (!q.options || q.options.length === 0) {
          qErr.options = 'At least one option is required.';
          hasQuestionError = true;
        } else if (q.options.some((opt) => !opt.text.trim())) {
          qErr.options = 'Option labels cannot be empty.';
          hasQuestionError = true;
        }
      }

      if (qErr.title || qErr.options) {
        questionErrors[q.id] = qErr;
      }
    });

    if (hasQuestionError) {
      newErrors.questions = questionErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Action handlers
  const handleSaveDraft = async () => {
    if (!validateForm()) {
      setBannerNotice({
        type: 'error',
        text: 'Please resolve validation errors before saving draft.',
      });
      return;
    }

    // Call service to demonstrate boundary
    const res = await formGeneratorService.saveDraft(formData);
    if (res.status === 'not_connected') {
      setBannerNotice({
        type: 'warning',
        text: 'Draft saved in frontend memory. (Backend service is offline; persistent database storage is not connected).',
      });
    } else {
      setBannerNotice({
        type: 'success',
        text: 'Form draft saved successfully.',
      });
    }
  };

  const handleOpenPreview = () => {
    if (!validateForm()) {
      setBannerNotice({
        type: 'error',
        text: 'Please fill in required form and question titles before previewing.',
      });
      return;
    }
    setBannerNotice(null);
    setPreviewOpen(true);
  };

  const handleResetForm = () => {
    setFormData(getInitialFormData());
    setErrors({});
    setClearConfirmOpen(false);
    setBannerNotice({
      type: 'success',
      text: 'Form reset to default draft state.',
    });
  };

  return (
    <section className="flex flex-col gap-6" aria-labelledby="page-title">
      {/* Header */}
      <PageHeader
        eyebrow="EVENTS / FORM GENERATOR"
        title="Form Generator"
        description="Create registration forms for your events."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={() => setClearConfirmOpen(true)}
            >
              Reset Form
            </Button>
            <Button
              type="button"
              variant="outline"
              size="md"
              icon={<Eye className="w-3.5 h-3.5" />}
              onClick={handleOpenPreview}
            >
              Preview
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              icon={<Save className="w-3.5 h-3.5" />}
              onClick={handleSaveDraft}
            >
              Save Draft
            </Button>
          </div>
        }
      />

      {/* Status Notice Banner */}
      {bannerNotice && (
        <div
          role="status"
          className={`flex items-start justify-between gap-3 p-3.5 rounded-md border text-xs leading-relaxed transition-all ${
            bannerNotice.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : bannerNotice.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-neutral-50 border-neutral-300 text-neutral-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {bannerNotice.type === 'warning' ? (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            ) : bannerNotice.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-neutral-800 shrink-0" />
            )}
            <span>{bannerNotice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setBannerNotice(null)}
            className="text-neutral-400 hover:text-neutral-700 p-0.5"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Grid: Form Editor (Left) & Sidebar Info (Right) */}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        {/* Left Column: Form Details & Question Builder */}
        <div className="flex flex-col gap-6">
          {/* Section A: Form Details Card */}
          <section
            className="rounded-md border border-neutral-200 bg-white p-5 shadow-2xs"
            aria-labelledby="form-details-heading"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-neutral-700" />
                <h2 id="form-details-heading" className="text-xs font-semibold uppercase tracking-wider text-neutral-800 font-mono">
                  Form Details
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-neutral-100 border border-neutral-200 text-neutral-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
                  Status: {formData.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Form Title */}
              <div>
                <label
                  htmlFor="form-title"
                  className="block text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500 mb-1.5"
                >
                  Form Title <span className="text-rose-600">*</span>
                </label>
                <input
                  id="form-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Annual Design Summit 2026 Registration"
                  className={`w-full bg-white text-neutral-900 placeholder:text-neutral-400 text-xs border rounded px-3 py-2 transition-colors focus:outline-hidden focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800 ${
                    errors.title ? 'border-rose-400 bg-rose-50/20' : 'border-neutral-300'
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.title}
                  </p>
                )}
              </div>

              {/* Form Description */}
              <div>
                <label
                  htmlFor="form-description"
                  className="block text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500 mb-1.5"
                >
                  Form Description
                </label>
                <textarea
                  id="form-description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  placeholder="Brief description or instructions for respondents..."
                  className="w-full bg-white text-neutral-900 placeholder:text-neutral-400 text-xs border border-neutral-300 rounded px-3 py-2 transition-colors focus:outline-hidden focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800"
                />
              </div>

              {/* Event Association Selector */}
              <div>
                <label
                  htmlFor="event-association"
                  className="block text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500 mb-1.5"
                >
                  Associate with Event
                </label>
                {isEventServiceConnected && events.length > 0 ? (
                  <select
                    id="event-association"
                    value={formData.eventId || ''}
                    onChange={(e) => handleEventChange(e.target.value)}
                    className="w-full bg-white text-neutral-800 text-xs border border-neutral-300 rounded px-2.5 py-2 cursor-pointer focus:outline-hidden focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800"
                  >
                    <option value="">-- No specific event (Standalone Form) --</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title} ({ev.category})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 rounded border border-neutral-200 bg-neutral-50/80 p-2.5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neutral-400 shrink-0" />
                      <span className="text-xs text-neutral-600">
                        {eventsLoading
                          ? 'Checking for available events...'
                          : 'No event records available (Event service offline)'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase px-2 py-0.5 rounded bg-neutral-200/60 shrink-0">
                      Standalone Mode
                    </span>
                  </div>
                )}
                <p className="mt-1 text-[10px] text-neutral-500">
                  Associating a form with an event links responses directly to the event roster.
                </p>
              </div>
            </div>
          </section>

          {/* Section B: Question Builder */}
          <section
            className="rounded-md border border-neutral-200 bg-white shadow-2xs overflow-hidden"
            aria-labelledby="questions-heading"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 p-4">
              <div>
                <h2 id="questions-heading" className="text-xs font-semibold uppercase tracking-wider text-neutral-800 font-mono">
                  Questions ({formData.questions.length})
                </h2>
                <p className="mt-0.5 text-[11px] text-neutral-500">
                  Define questions, types, options, and required constraints.
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={handleAddQuestion}
              >
                Add Question
              </Button>
            </div>

            {/* Questions List */}
            <div className="p-4 flex flex-col gap-4">
              {formData.questions.length === 0 ? (
                <EmptyState
                  icon={FileQuestion}
                  title="No questions created"
                  description="Click 'Add Question' above to add short answers, paragraphs, multiple choices, checkboxes, or dropdowns."
                  compact
                />
              ) : (
                formData.questions.map((question, index) => {
                  const qErrors = errors.questions?.[question.id];
                  const hasOptions =
                    question.type === 'multiple_choice' ||
                    question.type === 'checkboxes' ||
                    question.type === 'dropdown';

                  return (
                    <article
                      key={question.id}
                      className="rounded-md border border-neutral-200 bg-white p-4 transition-all hover:border-neutral-300 shadow-2xs"
                    >
                      {/* Top Bar of Card: Reorder, Number, Type, Delete */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-neutral-100">
                        {/* Number & Reorder controls */}
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
                            Q{index + 1}
                          </span>

                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveQuestion(index, 'up')}
                            className="p-1 text-neutral-400 hover:text-neutral-800 disabled:opacity-20 disabled:hover:text-neutral-400 rounded hover:bg-neutral-100 transition-colors"
                            aria-label={`Move Question ${index + 1} up`}
                            title="Move up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            disabled={index === formData.questions.length - 1}
                            onClick={() => handleMoveQuestion(index, 'down')}
                            className="p-1 text-neutral-400 hover:text-neutral-800 disabled:opacity-20 disabled:hover:text-neutral-400 rounded hover:bg-neutral-100 transition-colors"
                            aria-label={`Move Question ${index + 1} down`}
                            title="Move down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Question Type Selector & Delete */}
                        <div className="flex items-center gap-2">
                          <select
                            value={question.type}
                            onChange={(e) =>
                              handleQuestionTypeChange(
                                question.id,
                                e.target.value as GoogleFormQuestionType
                              )
                            }
                            aria-label={`Question ${index + 1} type`}
                            className="bg-white text-neutral-800 text-xs font-mono border border-neutral-300 rounded px-2.5 py-1 focus:outline-hidden focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800 cursor-pointer"
                          >
                            {QUESTION_TYPES.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            aria-label={`Delete question ${index + 1}`}
                            title="Delete question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Question Title Input */}
                      <div className="mb-3">
                        <label
                          htmlFor={`q-title-${question.id}`}
                          className="block text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500 mb-1"
                        >
                          Question Title <span className="text-rose-600">*</span>
                        </label>
                        <input
                          id={`q-title-${question.id}`}
                          type="text"
                          value={question.title}
                          onChange={(e) =>
                            handleQuestionTitleChange(question.id, e.target.value)
                          }
                          placeholder="e.g. What is your dietary preference?"
                          className={`w-full bg-white text-neutral-900 placeholder:text-neutral-400 text-xs border rounded px-3 py-1.5 transition-colors focus:outline-hidden focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800 ${
                            qErrors?.title
                              ? 'border-rose-400 bg-rose-50/20'
                              : 'border-neutral-300'
                          }`}
                        />
                        {qErrors?.title && (
                          <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {qErrors.title}
                          </p>
                        )}
                      </div>

                      {/* Options Editor (if Multiple Choice, Checkboxes, Dropdown) */}
                      {hasOptions && (
                        <div className="mt-3 pt-3 border-t border-neutral-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">
                              Options ({question.options?.length || 0})
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAddOption(question.id)}
                              className="text-[11px] font-medium text-neutral-800 hover:text-black hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" /> Add Option
                            </button>
                          </div>

                          <div className="flex flex-col gap-2">
                            {question.options?.map((opt, optIdx) => (
                              <div
                                key={opt.id}
                                className="flex items-center gap-2"
                              >
                                <span className="text-neutral-400 text-xs font-mono w-4 text-right">
                                  {optIdx + 1}.
                                </span>
                                <input
                                  type="text"
                                  value={opt.text}
                                  onChange={(e) =>
                                    handleOptionTextChange(
                                      question.id,
                                      opt.id,
                                      e.target.value
                                    )
                                  }
                                  placeholder={`Option ${optIdx + 1}`}
                                  aria-label={`Question ${index + 1} Option ${optIdx + 1}`}
                                  className="flex-1 bg-white text-neutral-900 placeholder:text-neutral-400 text-xs border border-neutral-200 rounded px-2.5 py-1 transition-colors focus:outline-hidden focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800"
                                />
                                <button
                                  type="button"
                                  disabled={question.options.length <= 1}
                                  onClick={() =>
                                    handleRemoveOption(question.id, opt.id)
                                  }
                                  className="p-1 text-neutral-300 hover:text-rose-600 disabled:opacity-20 disabled:hover:text-neutral-300 rounded transition-colors"
                                  aria-label={`Remove option ${optIdx + 1}`}
                                  title="Remove option"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          {qErrors?.options && (
                            <p className="mt-2 text-[11px] text-rose-600 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {qErrors.options}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Bottom Options: Required Toggle */}
                      <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-end">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={question.required}
                            onChange={() =>
                              handleQuestionRequiredToggle(question.id)
                            }
                            className="w-3.5 h-3.5 rounded border-neutral-300 text-neutral-900 accent-neutral-900 focus:ring-neutral-800"
                          />
                          <span className="text-xs text-neutral-700 font-medium">
                            Required response
                          </span>
                        </label>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            {/* Bottom Add Question Button */}
            {formData.questions.length > 0 && (
              <div className="p-3 bg-neutral-50/50 border-t border-neutral-100 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={handleAddQuestion}
                >
                  Add Another Question
                </Button>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Guide, Actions & Backend Boundary Details */}
        <aside className="flex flex-col gap-5 sticky top-20" aria-label="Generator controls and status">
          {/* Quick Summary Card */}
          <div className="rounded-md border border-neutral-200 bg-white p-4 shadow-2xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-800 font-mono border-b border-neutral-100 pb-2 mb-3">
              Form Overview
            </h3>
            <dl className="flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between items-center">
                <dt className="text-neutral-500 font-mono text-[11px]">Total Questions:</dt>
                <dd className="font-semibold text-neutral-900">{formData.questions.length}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-neutral-500 font-mono text-[11px]">Required Fields:</dt>
                <dd className="font-semibold text-neutral-900">
                  {formData.questions.filter((q) => q.required).length}
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-neutral-500 font-mono text-[11px]">Associated Event:</dt>
                <dd className="font-medium text-neutral-800 truncate max-w-[150px]">
                  {formData.eventId
                    ? events.find((e) => e.id === formData.eventId)?.title || 'Selected'
                    : 'None (Standalone)'}
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-neutral-500 font-mono text-[11px]">Draft Status:</dt>
                <dd className="font-mono text-[11px] uppercase text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded">
                  In Memory
                </dd>
              </div>
            </dl>

            <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                className="w-full justify-center"
                icon={<Eye className="w-3.5 h-3.5" />}
                onClick={handleOpenPreview}
              >
                Open Live Preview
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                className="w-full justify-center"
                icon={<Save className="w-3.5 h-3.5" />}
                onClick={handleSaveDraft}
              >
                Save Draft
              </Button>
            </div>
          </div>

          {/* Google Forms Integration Boundary Notice */}
          <div className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4 text-xs text-neutral-600">
            <div className="flex items-center gap-2 mb-2 font-mono text-[11px] font-semibold text-neutral-700 uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Google Forms Integration</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              This builder generates schema definitions for Google Forms. Once Google Workspace API credentials and backend endpoints are configured, forms will be synchronized directly to Google Drive.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-neutral-500">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" />
              <span>API Gateway: Not connected</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal: Live Form Preview */}
      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Form Preview"
        subtitle="This is how participants will see the Google Form."
        footer={
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => setPreviewOpen(false)}
          >
            Close Preview
          </Button>
        }
      >
        <div className="flex flex-col gap-5 py-2">
          {/* Header block resembling Google Form top card */}
          <div className="p-4 rounded-md border border-neutral-200 bg-neutral-50/60 border-t-4 border-t-neutral-900">
            <h3 className="text-base font-bold text-neutral-900">
              {formData.title || 'Untitled Form'}
            </h3>
            {formData.description ? (
              <p className="mt-2 text-xs text-neutral-600 whitespace-pre-wrap leading-relaxed">
                {formData.description}
              </p>
            ) : (
              <p className="mt-1 text-xs text-neutral-400 italic">No description provided.</p>
            )}
            <p className="mt-3 text-[10px] font-mono text-rose-600">
              * Indicates required question
            </p>
          </div>

          {/* Question cards */}
          {formData.questions.length === 0 ? (
            <p className="text-center text-xs text-neutral-500 py-6">
              No questions in this form yet.
            </p>
          ) : (
            formData.questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 rounded-md border border-neutral-200 bg-white flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <label className="text-xs font-semibold text-neutral-800">
                    {idx + 1}. {q.title || 'Untitled question'}
                    {q.required && <span className="text-rose-600 ml-1">*</span>}
                  </label>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">
                    {QUESTION_TYPES.find((t) => t.value === q.type)?.label}
                  </span>
                </div>

                {/* Render field mockup by type */}
                {q.type === 'short_answer' && (
                  <input
                    type="text"
                    disabled
                    placeholder="Short-answer text"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded px-2.5 py-1.5 text-xs text-neutral-500 cursor-not-allowed"
                  />
                )}

                {q.type === 'paragraph' && (
                  <textarea
                    rows={3}
                    disabled
                    placeholder="Long-answer text"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded px-2.5 py-1.5 text-xs text-neutral-500 cursor-not-allowed"
                  />
                )}

                {q.type === 'multiple_choice' && (
                  <div className="flex flex-col gap-1.5 mt-1">
                    {q.options?.map((opt) => (
                      <label
                        key={opt.id}
                        className="flex items-center gap-2 text-xs text-neutral-700 cursor-not-allowed opacity-90"
                      >
                        <input
                          type="radio"
                          name={`preview-radio-${q.id}`}
                          disabled
                          className="text-neutral-900"
                        />
                        <span>{opt.text || 'Option'}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'checkboxes' && (
                  <div className="flex flex-col gap-1.5 mt-1">
                    {q.options?.map((opt) => (
                      <label
                        key={opt.id}
                        className="flex items-center gap-2 text-xs text-neutral-700 cursor-not-allowed opacity-90"
                      >
                        <input
                          type="checkbox"
                          disabled
                          className="rounded text-neutral-900"
                        />
                        <span>{opt.text || 'Option'}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'dropdown' && (
                  <select
                    disabled
                    className="w-full bg-neutral-50 border border-neutral-200 rounded px-2.5 py-1.5 text-xs text-neutral-500 cursor-not-allowed"
                  >
                    <option value="">Choose an option</option>
                    {q.options?.map((opt) => (
                      <option key={opt.id} value={opt.text}>
                        {opt.text || 'Option'}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Modal: Confirm Reset/Clear Form */}
      <Modal
        isOpen={clearConfirmOpen}
        onClose={() => setClearConfirmOpen(false)}
        title="Reset Form?"
        subtitle="This action will clear your customizations and revert the form to default questions."
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setClearConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="md"
              onClick={handleResetForm}
            >
              Confirm Reset
            </Button>
          </>
        }
      >
        <p className="text-xs text-neutral-600 leading-relaxed">
          Are you sure you want to reset all form details and questions? Any unsaved edits will be discarded.
        </p>
      </Modal>
    </section>
  );
}
export default FormGeneratorPage;
