export function DashboardFooter() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-6 py-7 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="m-0 font-semibold text-white">Student Management</p>
          <p className="mt-1 mb-0 text-slate-400">A simple place to manage students, teachers, and accounts.</p>
        </div>
        <p className="m-0 text-slate-400">© {new Date().getFullYear()} Student Management</p>
      </div>
    </footer>
  );
}
