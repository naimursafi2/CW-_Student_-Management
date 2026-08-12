import { useCallback, useEffect, useState } from 'react';
import { getApiErrorMessage } from '../../api/client';
import { getStudentDashboardData, type Notice, type StudentClass, type StudentSubject } from '../../api/student.api';

export function StudentDashboard() {
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [subjects, setSubjects] = useState<StudentSubject[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true); setError('');
    try {
      const data = await getStudentDashboardData();
      setClasses(data.classes); setSubjects(data.subjects); setNotices(data.notices);
    } catch (err) { setError(getApiErrorMessage(err, 'Could not load your dashboard.')); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  return <section id="student-dashboard" className="scroll-mt-24">
    <div className="mb-5 flex items-center justify-between"><div><h2 className="m-0 text-xl font-bold">My Dashboard</h2><p className="mt-1 mb-0 text-sm text-slate-500">Classes, subjects, and recent announcements in one place.</p></div><button onClick={() => void loadDashboard()} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Refresh</button></div>
    {error && <p className="mb-5 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    {isLoading ? <p className="py-10 text-center text-slate-500">Loading your dashboard...</p> : <>
      <div className="mb-7 grid gap-4 sm:grid-cols-3"><div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white"><p className="m-0 text-sm text-blue-100">My Classes</p><p className="mt-2 mb-0 text-3xl font-bold">{classes.length}</p></div><div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="m-0 text-sm text-slate-500">Available Subjects</p><p className="mt-2 mb-0 text-3xl font-bold text-slate-800">{subjects.length}</p></div><div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="m-0 text-sm text-slate-500">New Notices</p><p className="mt-2 mb-0 text-3xl font-bold text-slate-800">{notices.length}</p></div></div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><div className="rounded-xl bg-white p-6 shadow-[0_4px_16px_rgba(15,23,42,0.06)]"><h3 className="m-0 text-lg font-bold">My Classes</h3><div className="mt-4 grid gap-3">{classes.length ? classes.map((item) => <article key={item.id} className="rounded-lg border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><h4 className="m-0 font-bold">{item.name}</h4><p className="mt-1 mb-0 text-sm text-slate-500">{item.description || 'No class description.'}</p></div><span className="rounded bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">{item.code}</span></div><p className="mt-3 mb-0 text-xs font-semibold text-slate-500">{item.subjects?.length ?? 0} subject(s) assigned</p></article>) : <p className="py-5 text-center text-sm text-slate-500">You have not been assigned to a class yet.</p>}</div></div>
      <div className="rounded-xl bg-white p-6 shadow-[0_4px_16px_rgba(15,23,42,0.06)]"><h3 className="m-0 text-lg font-bold">Latest Notices</h3><div className="mt-4 space-y-3">{notices.slice(0, 4).map((notice) => <article key={notice.id} className="border-b border-slate-100 pb-3 last:border-0"><p className="m-0 font-semibold text-slate-800">{notice.title}</p><p className="mt-1 mb-0 line-clamp-2 text-sm text-slate-500">{notice.description}</p><p className="mt-2 mb-0 text-xs text-slate-400">{new Date(notice.createdAt).toLocaleDateString()}</p></article>)}{!notices.length && <p className="py-5 text-center text-sm text-slate-500">No notices yet.</p>}</div></div></div>
      <section className="mt-6 rounded-xl bg-white p-6 shadow-[0_4px_16px_rgba(15,23,42,0.06)]"><h3 className="m-0 text-lg font-bold">My Subjects</h3><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{subjects.map((item) => <article key={item.id ?? item._id ?? item.code} className="rounded-lg border border-slate-200 p-4"><p className="m-0 text-xs font-bold text-blue-600">{item.code}</p><h4 className="mt-1 mb-1 font-bold">{item.subName}</h4><p className="m-0 text-sm text-slate-500">{item.credits ? `${item.credits} credit(s)` : 'Credit not specified'}</p></article>)}{!subjects.length && <p className="col-span-full py-5 text-center text-sm text-slate-500">No subjects available yet.</p>}</div></section>
    </>}
  </section>;
}
