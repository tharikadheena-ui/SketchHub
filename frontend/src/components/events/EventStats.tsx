import React from 'react';
import { Radio, Users, ArrowLeftRight, Award } from 'lucide-react';
import type { EventStatsSummary } from '../../types/event';
import { formatNumber } from '../../utils/formatters';

interface EventStatsProps {
  stats: EventStatsSummary | null;
  isLoading?: boolean;
}

export const EventStats: React.FC<EventStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white border border-neutral-200 rounded-md p-4 animate-pulse h-28 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <div className="h-3 w-28 bg-neutral-200 rounded" />
              <div className="h-4 w-4 bg-neutral-200 rounded-full" />
            </div>
            <div className="h-7 w-16 bg-neutral-200 rounded" />
            <div className="h-2.5 w-24 bg-neutral-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: ACTIVE EVENTS */}
      <div className="bg-white border border-neutral-200 rounded-md p-4 flex flex-col justify-between shadow-2xs relative overflow-hidden group hover:border-neutral-300 transition-colors">
        <div className="flex items-center justify-between text-neutral-500">
          <span className="text-[11px] font-mono font-medium tracking-wider uppercase">
            ACTIVE EVENTS
          </span>
          <Radio className="w-4 h-4 text-neutral-700" />
        </div>
        <div className="my-2">
          <span className="text-2xl font-bold font-mono tracking-tight text-neutral-900">
            {stats ? formatNumber(stats.activeEvents) : '—'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-600">
          <span>{stats ? `${stats.liveToday} Live Today` : 'Not connected'}</span>
        </div>
        {/* Accent Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-900" />
      </div>

      {/* Card 2: TOTAL REGISTRANTS */}
      <div className="bg-white border border-neutral-200 rounded-md p-4 flex flex-col justify-between shadow-2xs relative overflow-hidden group hover:border-neutral-300 transition-colors">
        <div className="flex items-center justify-between text-neutral-500">
          <span className="text-[11px] font-mono font-medium tracking-wider uppercase">
            TOTAL REGISTRANTS
          </span>
          <Users className="w-4 h-4 text-neutral-700" />
        </div>
        <div className="my-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tracking-tight text-neutral-900">
            {stats ? formatNumber(stats.totalRegistrants) : '—'}
          </span>
          {stats && (
            <span className="text-[11px] font-mono font-medium text-neutral-500">
              {stats.wowGrowth > 0 ? `+${stats.wowGrowth}% WoW` : `${stats.wowGrowth}% WoW`}
            </span>
          )}
        </div>
        <div className="text-[11px] font-mono text-neutral-400">
          {stats ? 'Registration records' : 'Not connected'}
        </div>
        {/* Accent Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-900" />
      </div>

      {/* Card 3: REGISTRATION FORMS */}
      <div className="bg-white border border-neutral-200 rounded-md p-4 flex flex-col justify-between shadow-2xs relative overflow-hidden group hover:border-neutral-300 transition-colors">
        <div className="flex items-center justify-between text-neutral-500">
          <span className="text-[11px] font-mono font-medium tracking-wider uppercase">
            REGISTRATION FORMS
          </span>
          <ArrowLeftRight className="w-4 h-4 text-neutral-700" />
        </div>
        <div className="my-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tracking-tight text-neutral-900">
            {stats ? stats.publishedRegistrationForms : '—'}
            {stats && <span className="text-neutral-400 text-lg font-normal">/ {stats.totalRegistrationForms}</span>}
          </span>
        </div>
        <div className="text-[11px] font-mono text-neutral-400">
          {stats ? 'Registration form records' : 'Not connected'}
        </div>
        {/* Accent Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-900" />
      </div>

      {/* Card 4: CERTIFICATES ISSUED */}
      <div className="bg-white border border-neutral-200 rounded-md p-4 flex flex-col justify-between shadow-2xs relative overflow-hidden group hover:border-neutral-300 transition-colors">
        <div className="flex items-center justify-between text-neutral-500">
          <span className="text-[11px] font-mono font-medium tracking-wider uppercase">
            CERTIFICATES ISSUED
          </span>
          <Award className="w-4 h-4 text-neutral-700" />
        </div>
        <div className="my-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tracking-tight text-neutral-900">
            {stats ? formatNumber(stats.certificatesIssued) : '—'}
          </span>
        </div>
        <div className="text-[11px] font-mono text-neutral-400">
          {stats ? 'Certificate records' : 'Not connected'}
        </div>
        {/* Accent Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-900" />
      </div>
    </div>
  );
};
