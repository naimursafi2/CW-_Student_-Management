import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`cursor-pointer rounded-lg border-0 px-4 py-[0.7rem] text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-900 hover:bg-slate-300'} ${fullWidth ? 'w-full' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
