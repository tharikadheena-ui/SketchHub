import React from 'react';
import type { EventStatus } from '../../types/event';
import { cn } from '../../utils/formatters';

interface EventStatusBadgeProps {
  status: EventStatus;
  className?: string;
}

export const EventStatusBadge: React.FC<EventStatusBadgeProps> = ({ status, className = '' }) => {
  const badgeConfig = {
    registration_open: {
      text: 'REGISTRATION OPEN',
      containerClass: 'bg-emerald-50/80 text-emerald-800 border-emerald-200/70',
      dotClass: 'bg-emerald-500',
      pulse: false,
    },
    registration_closed: {
      text: 'REGISTRATION FULL / CLOSED',
      containerClass: 'bg-neutral-100 text-neutral-700 border-neutral-200',
      dotClass: 'bg-neutral-400',
      pulse: false,
    },
    live_now: {
      text: 'LIVE NOW',
      containerClass: 'bg-neutral-900 text-white border-neutral-800 shadow-xs',
      dotClass: 'bg-emerald-400',
      pulse: true,
    },
    draft: {
      text: 'DRAFT',
      containerClass: 'bg-neutral-100 text-neutral-700 border-neutral-200',
      dotClass: 'bg-neutral-400',
      pulse: false,
    },
    completed: {
      text: 'COMPLETED',
      containerClass: 'bg-neutral-100 text-neutral-700 border-neutral-200',
      dotClass: 'bg-neutral-400',
      pulse: false,
    },
    cancelled: {
      text: 'CANCELLED',
      containerClass: 'bg-rose-50 text-rose-800 border-rose-200',
      dotClass: 'bg-rose-500',
      pulse: false,
    },
    archived: {
      text: 'ARCHIVED',
      containerClass: 'bg-neutral-100 text-neutral-600 border-neutral-200',
      dotClass: 'bg-neutral-400',
      pulse: false,
    },
  };

  const current = badgeConfig[status] || badgeConfig.draft;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider border select-none',
        current.containerClass,
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {current.pulse && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        )}
        <span className={cn('relative inline-flex rounded-full h-1.5 w-1.5', current.dotClass)} />
      </span>
      <span>{current.text}</span>
    </span>
  );
};
