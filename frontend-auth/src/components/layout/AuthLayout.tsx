import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        <header className="auth-header">
          <h1>{title}</h1>
          {subtitle && <p className="muted">{subtitle}</p>}
        </header>
        {children}
      </div>
    </div>
  );
}
