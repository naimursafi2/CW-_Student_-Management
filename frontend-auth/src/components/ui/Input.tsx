import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id || props.name;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`.trim()}>
      <label htmlFor={inputId} className="text-sm font-semibold">{label}</label>
      <input id={inputId} className={`rounded-lg border px-3 py-[0.65rem] text-base outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300 ${error ? 'border-red-600' : 'border-slate-300'}`} {...props} />
      {error && <span className="text-[0.8125rem] text-red-600">{error}</span>}
    </div>
  );
}
