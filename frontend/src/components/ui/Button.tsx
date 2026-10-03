import React from 'react';
import { cn } from '../../utils/formatters';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  shortcut?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'outline',
  size = 'md',
  icon,
  shortcut,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-sans tracking-tight transition-colors duration-150 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50';

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-1 gap-1 rounded',
    md: 'text-xs px-3 py-1.5 gap-1.5 rounded',
    lg: 'text-sm px-4 py-2 gap-2 rounded-md',
  };

  const variantStyles = {
    primary:
      'bg-neutral-900 text-white hover:bg-neutral-800 active:bg-black font-medium border border-neutral-900 shadow-xs',
    outline:
      'bg-white text-neutral-800 hover:bg-neutral-50 active:bg-neutral-100 border border-neutral-300 font-medium shadow-xs',
    secondary:
      'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:bg-neutral-300 border border-transparent font-medium',
    ghost:
      'bg-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80 active:bg-neutral-200 border border-transparent',
    danger:
      'bg-white text-rose-600 hover:bg-rose-50 active:bg-rose-100 border border-rose-200 font-medium',
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {shortcut && (
        <kbd className="ml-1.5 px-1 py-0.2 text-[9px] font-mono font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700 rounded">
          {shortcut}
        </kbd>
      )}
    </button>
  );
};
