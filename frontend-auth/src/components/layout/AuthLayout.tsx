import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-[420px] rounded-xl bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
        <header className="auth-header">
          <h1 className="mb-2 text-[1.75rem] font-bold">{title}</h1>
          {subtitle && <p className="m-0 text-slate-500">{subtitle}</p>}
        </header>
        {children}
      </div>
    </div>
  );
}
