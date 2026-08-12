import { Link } from 'react-router-dom';
import type { User } from '../../types/auth.types';
import { Button } from '../ui/Button';

interface DashboardNavbarProps {
  user: User | null;
  onLogout: () => void;
}

export function DashboardNavbar({ user, onLogout }: DashboardNavbarProps) {
  const confirmLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      onLogout();
    }
  };

  return (
    <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 py-3">
        <Link to="/" className="text-lg font-bold text-slate-900 no-underline hover:text-blue-600 hover:no-underline">
          Student Management
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 no-underline hover:bg-slate-100 hover:text-blue-600 hover:no-underline" to="/">
            Home
          </Link>
          {user?.role === 'admin' && (
            <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 no-underline hover:bg-slate-100 hover:text-blue-600 hover:no-underline" to="/users">
              User List
            </Link>
          )}
          {user?.role === 'student' && (
            <a className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 no-underline hover:bg-slate-100 hover:text-blue-600 hover:no-underline" href="#student-dashboard">
              My Dashboard
            </a>
          )}
          {user?.role === 'admin' && (
            <a className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 no-underline hover:bg-slate-100 hover:text-blue-600 hover:no-underline" href="#academic-management">
              Academic
            </a>
          )}
          {user?.role === 'teacher' && (
            <a className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 no-underline hover:bg-slate-100 hover:text-blue-600 hover:no-underline" href="#teacher-dashboard">
              My Classes
            </a>
          )}
          <Button variant="secondary" onClick={confirmLogout}>Log out</Button>
        </div>
      </div>
    </nav>
  );
}
