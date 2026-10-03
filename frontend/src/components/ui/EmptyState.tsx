import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  compact?: boolean;
}

export function EmptyState({ icon: Icon, title, description, compact = false }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-center ${compact ? 'px-5 py-8' : 'min-h-64 px-6 py-12'}`}>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
        <Icon className="h-5 w-5 stroke-[1.5]" aria-hidden="true" />
      </div>
      <div className="max-w-md">
        <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-neutral-500">{description}</p>
      </div>
      <span className="rounded border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-600">
        Not connected
      </span>
    </div>
  );
}