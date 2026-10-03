import React from 'react';
import type { EventGauge } from '../../types/event';
import { cn } from '../../utils/formatters';

interface EventCapacityProps {
  gauge: EventGauge;
  className?: string;
}

export const EventCapacity: React.FC<EventCapacityProps> = ({ gauge, className = '' }) => {
  const percentageClamped = Math.min(Math.max(gauge.percentage, 0), 100);

  const renderValueDisplay = () => {
    if (gauge.type === 'setup') {
      return `${gauge.percentage}%`;
    }
    return (
      <>
        <span className="font-semibold text-neutral-900">{gauge.current}</span>
        <span className="text-neutral-400"> / </span>
        <span className="text-neutral-600">{gauge.total}</span>{' '}
        <span className="text-neutral-900 font-semibold">({gauge.percentage}%)</span>
      </>
    );
  };

  return (
    <div className={cn('w-56 flex flex-col gap-1 select-none', className)}>
      {/* Top Header Row */}
      <div className="flex items-center justify-between text-[10px] font-mono tracking-tight">
        <span className="text-neutral-500 font-medium tracking-wider uppercase">{gauge.label}</span>
        <span className="text-neutral-800 font-mono text-[11px]">{renderValueDisplay()}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-200 h-1.5 rounded-xs overflow-hidden">
        <div
          className="bg-neutral-900 h-full rounded-xs transition-all duration-300"
          style={{ width: `${percentageClamped}%` }}
        />
      </div>

      {/* Bottom Subtext */}
      {gauge.subtext && (
        <div className="text-right text-[10px] font-mono text-neutral-500 tracking-tight">
          {gauge.subtext}
        </div>
      )}
    </div>
  );
};
