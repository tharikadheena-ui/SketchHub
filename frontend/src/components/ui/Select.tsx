import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/formatters';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  labelPrefix?: string;
  options: SelectOption[];
  icon?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  labelPrefix,
  options,
  icon,
  className = '',
  value,
  onChange,
  ...props
}) => {
  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        onChange={onChange}
        className={cn(
          'appearance-none bg-white text-neutral-800 text-[11px] font-mono font-medium border border-neutral-300 rounded px-2.5 py-1.5 pr-7 cursor-pointer hover:border-neutral-400 focus:outline-hidden focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800 shadow-xs transition-colors',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {labelPrefix ? `${labelPrefix}: ${opt.label}` : opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-2 pointer-events-none text-neutral-500 flex items-center">
        {icon || <ChevronDown className="w-3.5 h-3.5" />}
      </div>
    </div>
  );
};
