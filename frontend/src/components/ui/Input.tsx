import React from 'react';
import { cn } from '../../utils/formatters';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  shortcut?: string;
  onClear?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon, shortcut, onClear, className = '', value, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <span className="absolute left-3 text-neutral-400 pointer-events-none flex items-center justify-center">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          value={value}
          className={cn(
            'w-full bg-white text-neutral-900 placeholder:text-neutral-400 text-xs border border-neutral-300 rounded px-3 py-1.5 transition-colors focus:outline-hidden focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800',
            icon ? 'pl-8' : '',
            shortcut || onClear ? 'pr-12' : '',
            className
          )}
          {...props}
        />
        <div className="absolute right-2.5 flex items-center gap-1">
          {onClear && value && (
            <button
              type="button"
              onClick={onClear}
              className="text-neutral-400 hover:text-neutral-600 p-0.5 text-xs rounded hover:bg-neutral-100"
              title="Clear input"
            >
              ✕
            </button>
          )}
          {shortcut && (
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-neutral-500 bg-neutral-100 border border-neutral-200 rounded">
              {shortcut}
            </kbd>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
