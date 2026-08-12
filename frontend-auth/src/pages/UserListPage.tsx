import { useCallback, useEffect, useState } from 'react';
import { getUsers } from '../api/admin.api';
import { getApiErrorMessage } from '../api/client';
import { DashboardFooter } from '../components/layout/DashboardFooter';
import { DashboardNavbar } from '../components/layout/DashboardNavbar';
import { useAuth } from '../context/AuthContext';
import type { ManagedUser } from '../types/auth.types';

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U';
}

function printIdCard(user: ManagedUser) {
  const popup = window.open('', '_blank', 'width=760,height=520');
  if (!popup) return;

  const safe = (value: string | undefined) => (value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char] ?? char));
  const role = user.role ? `${user.role[0].toUpperCase()}${user.role.slice(1)}` : 'User';
  const memberId = (user.id ?? user._id ?? user.email).slice(-8).toUpperCase();
  const photo = user.profilePicture ? `<img class="photo" src="${safe(user.profilePicture)}" alt="Profile photo">` : `<div class="photo avatar">${safe(initials(user.name))}</div>`;

  popup.document.write(`<!doctype html><html><head><title>${safe(user.name)} ID Card</title><style>
    *{box-sizing:border-box} @page{size:85.6mm 54mm;margin:0} body{margin:0;min-height:100vh;display:grid;place-items:center;background:#e2e8f0;font-family:Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .card{position:relative;width:85.6mm;height:54mm;overflow:hidden;border-radius:3.5mm;background:#fff;box-shadow:0 14px 35px #0f172a40;display:flex}.brand{position:relative;width:31%;padding:6mm 4mm;color:#fff;background:linear-gradient(145deg,#0f2d64,#0755b8);overflow:hidden}.brand:after{content:'';position:absolute;width:42mm;height:42mm;border:1.5mm solid #ffffff22;border-radius:50%;right:-29mm;bottom:-20mm}.brand-mark{position:relative;z-index:1;display:flex;align-items:center;gap:2mm;font-weight:700;font-size:3.1mm;letter-spacing:.1mm}.mark{display:grid;place-items:center;width:6mm;height:6mm;border-radius:1.5mm;background:#fff;color:#0755b8;font-size:3.8mm;font-weight:800}.brand-sub{position:relative;z-index:1;margin-top:1.3mm;font-size:1.75mm;letter-spacing:.3mm;text-transform:uppercase;color:#cfe3ff}.photo{position:relative;z-index:1;width:24mm;height:24mm;margin:6.5mm auto 3mm;border:1.1mm solid #fff;border-radius:50%;object-fit:cover;background:#dbeafe;box-shadow:0 2mm 5mm #001a442b}.avatar{display:grid;place-items:center;color:#0b55b3;font-weight:800;font-size:8mm}.brand-role{position:relative;z-index:1;text-align:center;font-size:2mm;font-weight:700;letter-spacing:.35mm;text-transform:uppercase}.details{width:69%;padding:6mm 6mm 4mm;color:#172554}.details-top{display:flex;align-items:flex-start;justify-content:space-between;border-bottom:.3mm solid #dbeafe;padding-bottom:2.5mm}.title{font-size:2.1mm;font-weight:700;letter-spacing:.4mm;text-transform:uppercase;color:#64748b}.id{font-size:2mm;font-weight:700;color:#0b55b3}.name{margin:3.2mm 0 1mm;font-size:5.1mm;line-height:1.05;color:#0f172a}.email{margin:0;font-size:2.3mm;color:#64748b;overflow-wrap:anywhere}.meta{display:grid;grid-template-columns:1fr 1fr;gap:2.5mm;margin-top:4mm}.label{font-size:1.7mm;font-weight:700;letter-spacing:.25mm;text-transform:uppercase;color:#94a3b8}.value{margin-top:.8mm;font-size:2.5mm;font-weight:700;color:#334155}.footer{position:absolute;bottom:0;right:0;width:69%;padding:1.6mm 6mm;background:#eff6ff;font-size:1.7mm;color:#5272a4;letter-spacing:.1mm}@media print{body{background:#fff}.card{box-shadow:none}}
  </style></head><body><section class="card"><aside class="brand"><div class="brand-mark"><span class="mark">S</span> STUDENT MANAGEMENT</div><div class="brand-sub">Official identification</div>${photo}<div class="brand-role">${safe(role)}</div></aside><div class="details"><div class="details-top"><span class="title">Identity card</span><span class="id">ID · ${safe(memberId)}</span></div><h1 class="name">${safe(user.name)}</h1><p class="email">${safe(user.email)}</p><div class="meta"><div><div class="label">Role</div><div class="value">${safe(role)}</div></div><div><div class="label">Member since</div><div class="value">${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</div></div></div></div><div class="footer">This card remains the property of Student Management.</div></section><script>window.onload=()=>window.print()<\/script></body></html>`);
  popup.document.close();
}

export function UserListPage() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const allUsers = await getUsers('all');
      setUsers(allUsers.filter((item) => item.isApproved && (item.isEmailVerified ?? item.isEmailVerfied)));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load users.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void loadUsers(); }, [loadUsers]);

  return <div className="flex min-h-screen flex-col"><DashboardNavbar user={user} onLogout={logout} /><main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-10">
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm font-bold uppercase tracking-wider text-blue-600">Admin panel</p><h1 className="m-0 text-3xl font-bold">Verified Users</h1><p className="mt-2 mb-0 text-slate-500">Approved and email-verified user profiles with printable identification cards.</p></div><button type="button" onClick={() => void loadUsers()} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Refresh list</button></div>
    {error && <p className="rounded-lg bg-rose-50 p-4 text-rose-700">{error}</p>}
    {isLoading ? <p className="py-16 text-center text-slate-500">Loading users...</p> : !error && users.length === 0 ? <p className="py-16 text-center text-slate-500">No approved and verified users found.</p> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{users.map((item, index) => <article key={item.id ?? item._id ?? `${item.email}-${index}`} className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_16px_rgba(15,23,42,0.07)]"><div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-600"/><div className="px-5 pb-5"><div className="-mt-10 mb-4 flex items-end justify-between"><div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-blue-100 text-xl font-bold text-blue-700 shadow-sm">{item.profilePicture ? <img src={item.profilePicture} alt={`${item.name}'s profile`} className="h-full w-full object-cover"/> : initials(item.name)}</div><span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">{item.role}</span></div><h2 className="m-0 text-lg font-bold">{item.name}</h2><p className="mt-1 mb-3 break-all text-sm text-slate-500">{item.email}</p><p className="min-h-10 text-sm text-slate-600">{item.bio || 'No bio added yet.'}</p><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4"><span className="text-xs text-slate-400">Joined {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}</span><button type="button" onClick={() => printIdCard(item)} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700">Print ID Card</button></div></div></article>)}</div>}
  </main><DashboardFooter /></div>;
}
