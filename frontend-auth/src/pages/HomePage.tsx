import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto max-w-[720px] px-6 py-8">
      <header className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div>
          <h1 className="mb-1 text-2xl font-bold">Welcome, {user?.name}</h1>
          <p className="m-0 text-slate-500">You are signed in to your account.</p>
        </div>
        <Button variant="secondary" onClick={logout}>Log out</Button>
      </header>

      <main className="flex flex-col gap-6">
        <section className="rounded-xl bg-white p-6 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
          <h2 className="mb-4 text-lg font-bold">Profile</h2>
          <dl className="m-0 grid gap-3">
            <div className="grid gap-2 sm:grid-cols-[140px_1fr]"><dt className="font-semibold text-slate-500">Name</dt><dd className="m-0">{user?.name}</dd></div>
            <div className="grid gap-2 sm:grid-cols-[140px_1fr]"><dt className="font-semibold text-slate-500">Email</dt><dd className="m-0">{user?.email}</dd></div>
            <div className="grid gap-2 sm:grid-cols-[140px_1fr]"><dt className="font-semibold text-slate-500">Email verified</dt><dd className="m-0">{user?.isEmailVerified ? 'Yes' : 'No'}</dd></div>
            <div className="grid gap-2 sm:grid-cols-[140px_1fr]"><dt className="font-semibold text-slate-500">Member since</dt><dd className="m-0">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</dd></div>
          </dl>
        </section>

        <p className="m-0 text-slate-500">
          Need another account? <Link to="/register">Register</Link> or{' '}
          <Link to="/login">sign in</Link> with different credentials after logging out.
        </p>
      </main>
    </div>
  );
}
