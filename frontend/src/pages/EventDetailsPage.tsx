import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { eventService } from '../services/eventService';
import type { EventRecord } from '../types/domain';

export function EventDetailsPage() {
  const { eventId = '' } = useParams();
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [message, setMessage] = useState('Loading event details.');

  useEffect(() => {
    let isActive = true;
    void eventService.getEvent(eventId).then((result) => {
      if (!isActive) return;
      if (result.status === 'success') {
        setEvent(result.data);
        setMessage('');
      } else {
        setMessage(result.error);
      }
    });
    return () => { isActive = false; };
  }, [eventId]);

  return (
    <section className="flex flex-col gap-5" aria-labelledby="page-title">
      <PageHeader
        eyebrow="EVENTS / DETAILS"
        title={event?.name ?? 'Event details'}
        description={event?.description ?? 'Event records are loaded from the connected event service.'}
        action={<Link to="/events" className="inline-flex items-center gap-2 rounded border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"><ArrowLeft className="h-3.5 w-3.5" /> Events</Link>}
      />
      {event ? (
        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-md border border-neutral-200 bg-white p-4"><h2 className="text-xs font-semibold text-neutral-800">Schedule</h2><p className="mt-3 flex items-center gap-2 text-xs text-neutral-600"><CalendarDays className="h-4 w-4" />{event.eventDate} {event.startTime}–{event.endTime}</p></section>
          <section className="rounded-md border border-neutral-200 bg-white p-4"><h2 className="text-xs font-semibold text-neutral-800">Location</h2><p className="mt-3 flex items-center gap-2 text-xs text-neutral-600"><MapPin className="h-4 w-4" />{[event.venue, event.block, event.room].filter(Boolean).join(', ') || event.locationType}</p></section>
          <Link to={`/events/${event.id}/registration-form`} className="rounded border border-neutral-200 bg-white p-4 text-xs font-medium text-neutral-700 hover:border-neutral-400">Registration form builder</Link>
        </div>
      ) : (
        <div role="status" className="rounded-md border border-dashed border-neutral-300 bg-white p-8 text-center text-xs text-neutral-600">{message}</div>
      )}
    </section>
  );
}