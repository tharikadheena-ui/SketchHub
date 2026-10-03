import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  eyebrow?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, eyebrow = 'SKETCHHUB WORKSPACE', action }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-1 flex items-center gap-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-800" />
          <span>{eyebrow}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-neutral-900 sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-neutral-500 sm:text-sm">{description}</p>
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </header>
  );
}