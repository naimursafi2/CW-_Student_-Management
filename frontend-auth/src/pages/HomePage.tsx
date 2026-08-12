import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserManagement } from '../components/users/UserManagement';
import { DashboardFooter } from '../components/layout/DashboardFooter';
import { DashboardNavbar } from '../components/layout/DashboardNavbar';
import { StudentDashboard } from '../components/students/StudentDashboard';
import { ProfilePictureEditor } from '../components/profile/ProfilePictureEditor';
import { AcademicManagement } from '../components/academic/AcademicManagement';
import { TeacherDashboard } from '../components/teacher/TeacherDashboard';

export function HomePage() {
  const { user, logout } = useAuth();
  const roleLabel = user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : 'Not set';

  return (
    <div id="home" className="flex min-h-screen flex-col scroll-mt-20">
      <DashboardNavbar user={user} onLogout={logout} />
      <div className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-10">
        <header className="mb-8">
          <h1 className="mb-1 text-2xl font-bold">Welcome, {user?.name}</h1>
          <p className="m-0 text-slate-500">
            You are signed in as{' '}
            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-sm font-semibold text-blue-700">
              {roleLabel}
            </span>
          </p>
        </header>

        <main className="flex flex-col gap-6">
          <section className="rounded-xl bg-white p-6 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
          <h2 className="mb-4 text-lg font-bold">Profile</h2>
          <ProfilePictureEditor />
          <dl className="mt-6 mb-0 grid gap-3">
            <div className="grid gap-2 sm:grid-cols-[140px_1fr]"><dt className="font-semibold text-slate-500">Name</dt><dd className="m-0">{user?.name}</dd></div>
            <div className="grid gap-2 sm:grid-cols-[140px_1fr]"><dt className="font-semibold text-slate-500">Email</dt><dd className="m-0">{user?.email}</dd></div>
            <div className="grid gap-2 sm:grid-cols-[140px_1fr]"><dt className="font-semibold text-slate-500">Role</dt><dd className="m-0 font-medium text-blue-700">{roleLabel}</dd></div>
            <div className="grid gap-2 sm:grid-cols-[140px_1fr]"><dt className="font-semibold text-slate-500">Email verified</dt><dd className="m-0">{user?.isEmailVerified ? 'Yes' : 'No'}</dd></div>
            <div className="grid gap-2 sm:grid-cols-[140px_1fr]"><dt className="font-semibold text-slate-500">Member since</dt><dd className="m-0">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</dd></div>
          </dl>
          </section>

          {user?.role === 'admin' && <div id="user-list" className="scroll-mt-24"><UserManagement /></div>}
          {user?.role === 'admin' && <AcademicManagement />}
          {user?.role === 'teacher' && <TeacherDashboard />}
          {user?.role === 'student' && <StudentDashboard />}

          <p className="m-0 text-slate-500">
            Need another account? <Link to="/register">Register</Link> or{' '}
            <Link to="/login">sign in</Link> with different credentials after logging out.
          </p>
        </main>
      </div>
      <DashboardFooter />
    </div>
  );
}
