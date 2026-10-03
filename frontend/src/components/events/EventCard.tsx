import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  MoreVertical,
  Code2,
  FileText,
  CheckCircle2,
  Archive,
  QrCode,
  Users,
  ExternalLink,
  Sliders,
  Pencil,
  RotateCcw,
  BarChart2,
  Download,
} from 'lucide-react';
import type { EventItem } from '../../types/event';
import { Link } from 'react-router-dom';
import { EventStatusBadge } from './EventStatusBadge';
import { EventCapacity } from './EventCapacity';
import { Button } from '../ui/Button';
import { Dropdown } from '../ui/Dropdown';
import type { DropdownItem } from '../ui/Dropdown';
import { cn } from '../../utils/formatters';

interface EventCardProps {
  event: EventItem;
  onActionClick?: (actionId: string, event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onActionClick }) => {
  // Render thumbnail icon or label
  const renderThumbnail = () => {
    if (event.thumbnailType === 'code') {
      return (
        <div className="w-14 h-14 bg-neutral-900 text-neutral-100 rounded flex items-center justify-center font-mono font-bold text-sm shrink-0 border border-neutral-800">
          {'</>'}
        </div>
      );
    }
    if (event.thumbnailType === 'rust') {
      return (
        <div className="w-14 h-14 bg-neutral-900 text-neutral-100 rounded flex items-center justify-center font-mono font-bold text-xs tracking-wider shrink-0 border border-neutral-800">
          RUST
        </div>
      );
    }
    if (event.thumbnailType === 'text' && event.thumbnailLabel) {
      return (
        <div className="w-14 h-14 bg-neutral-900 text-neutral-100 rounded flex items-center justify-center font-mono font-bold text-sm shrink-0 border border-neutral-800">
          {event.thumbnailLabel}
        </div>
      );
    }
    if (event.status === 'draft') {
      return (
        <div className="w-14 h-14 bg-neutral-100 text-neutral-500 rounded flex items-center justify-center shrink-0 border border-neutral-200">
          <FileText className="w-6 h-6 stroke-1" />
        </div>
      );
    }
    if (event.status === 'completed') {
      return (
        <div className="w-14 h-14 bg-neutral-100 text-neutral-600 rounded flex items-center justify-center shrink-0 border border-neutral-200">
          <CheckCircle2 className="w-6 h-6 stroke-1" />
        </div>
      );
    }
    if (event.status === 'archived') {
      return (
        <div className="w-14 h-14 bg-neutral-100 text-neutral-500 rounded flex items-center justify-center shrink-0 border border-neutral-200">
          <Archive className="w-6 h-6 stroke-1" />
        </div>
      );
    }

    return (
      <div className="w-14 h-14 bg-neutral-900 text-white rounded flex items-center justify-center shrink-0">
        <Code2 className="w-6 h-6" />
      </div>
    );
  };

  const dropdownItems: DropdownItem[] = [
    {
      id: 'edit',
      label: 'Edit Configuration',
      icon: <Pencil className="w-3.5 h-3.5" />,
      onClick: () => onActionClick?.('edit', event),
    },
    {
      id: 'registration-form',
      label: 'Registration Form Builder',
      icon: <ExternalLink className="w-3.5 h-3.5" />,
      onClick: () => onActionClick?.('registration-form', event),
    },
    {
      id: 'publish',
      label: 'Publish Event',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      onClick: () => onActionClick?.('publish', event),
    },
    {
      id: 'unpublish',
      label: 'Unpublish Event',
      icon: <FileText className="w-3.5 h-3.5" />,
      onClick: () => onActionClick?.('unpublish', event),
    },
    {
      id: 'close',
      label: 'Close Event',
      icon: <Archive className="w-3.5 h-3.5" />,
      onClick: () => onActionClick?.('close', event),
    },
    {
      id: 'cancel',
      label: 'Cancel Event',
      icon: <Archive className="w-3.5 h-3.5" />,
      danger: true,
      onClick: () => onActionClick?.('cancel', event),
    },
    {
      id: 'archive',
      label: 'Archive Event',
      icon: <Download className="w-3.5 h-3.5" />,
      onClick: () => onActionClick?.('archive', event),
    },
  ];

  const getActionIcon = (iconName?: string) => {
    switch (iconName) {
      case 'scan':
        return <QrCode className="w-3.5 h-3.5" />;
      case 'form':
        return <ExternalLink className="w-3.5 h-3.5" />;
      case 'users':
        return <Users className="w-3.5 h-3.5" />;
      case 'builder':
        return <Sliders className="w-3.5 h-3.5" />;
      case 'analytics':
        return <BarChart2 className="w-3.5 h-3.5" />;
      case 'archive':
        return <Download className="w-3.5 h-3.5" />;
      case 'restore':
        return <RotateCcw className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        'bg-white border border-neutral-200 rounded-md p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-5 relative overflow-hidden shadow-2xs hover:border-neutral-300 transition-colors',
        event.isFeatured ? 'border-l-4 border-l-neutral-900' : ''
      )}
    >
      {/* Left Details Section */}
      <div className="flex items-start gap-4 flex-1">
        {renderThumbnail()}

        <div className="flex flex-col gap-1.5 min-w-0">
          {/* Metadata & Status */}
          <div className="flex flex-wrap items-center gap-2">
            <EventStatusBadge status={event.status} />
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
              {event.category}
              {event.teamFormat ? ` · ${event.teamFormat}` : ''}
            </span>
          </div>

          {/* Event Title */}
          <Link to={`/events/${event.id}`} className="text-base font-bold text-neutral-900 tracking-tight leading-snug truncate hover:underline">
            {event.title}
          </Link>

          {/* Date, Time, Venue, and Badges */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-600 font-mono">
            {event.dateDisplay && (
              <span className="inline-flex items-center gap-1.5 text-neutral-700">
                {event.status === 'live_now' ? (
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                ) : (
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                )}
                <span>{event.dateDisplay}</span>
              </span>
            )}

            {event.venue && (
              <span className="inline-flex items-center gap-1 text-neutral-600">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{event.venue}</span>
              </span>
            )}

            {event.subBadge && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded text-[10px] font-mono border border-neutral-200">
                {event.subBadge}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Metrics & Actions Section */}
      <div className="flex flex-col sm:flex-row xl:flex-row items-start sm:items-center xl:items-center gap-4 shrink-0 border-t xl:border-t-0 pt-3 xl:pt-0 border-neutral-100">
        {/* Capacity / Metric Gauge */}
        {event.gauge && <EventCapacity gauge={event.gauge} />}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {event.actions?.map((act) => (
            <Button
              key={act.id}
              variant={act.variant || 'outline'}
              size="sm"
              icon={getActionIcon(act.icon)}
              disabled={act.disabled}
              onClick={() => onActionClick?.(act.id, event)}
            >
              {act.label}
            </Button>
          ))}

          {/* 3-dots Context Menu */}
          <Dropdown
            align="right"
            trigger={
              <button
                type="button"
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded cursor-pointer transition-colors"
                title="More actions"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            }
            items={dropdownItems}
          />
        </div>
      </div>
    </div>
  );
};
