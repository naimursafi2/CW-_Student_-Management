import { useCallback, useEffect, useState } from 'react';
import { approveUser, getUsers, rejectUser, type UserManagementTab } from '../../api/admin.api';
import { getApiErrorMessage } from '../../api/client';
import type { ManagedUser } from '../../types/auth.types';

const tabs: { id: UserManagementTab; label: string }[] = [
  { id: 'all', label: 'All Users' },
  { id: 'pending', label: 'Pending Users' },
  { id: 'teachers', label: 'All Teachers' },
  { id: 'students', label: 'All Students' },
];

function formatRole(role: string) {
  return role ? `${role[0].toUpperCase()}${role.slice(1)}` : '—';
}

function userStatus(user: ManagedUser) {
  if (!user.isApproved) return { label: 'PENDING', className: 'bg-amber-100 text-amber-700' };
  if (user.isEmailVerified ?? user.isEmailVerfied) return { label: 'VERIFIED', className: 'bg-emerald-100 text-emerald-700' };
  return { label: 'UNVERIFIED', className: 'bg-rose-100 text-rose-700' };
}

export function UserManagement() {
  const [activeTab, setActiveTab] = useState<UserManagementTab>('all');
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadUsers = useCallback(async (tab: UserManagementTab) => {
    setIsLoading(true);
    setError('');
    try {
      setUsers(await getUsers(tab));
    } catch (err) {
      setUsers([]);
      setError(getApiErrorMessage(err, 'Could not load users.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers(activeTab);
  }, [activeTab, loadUsers]);

  const updatePendingUser = async (user: ManagedUser, action: 'approve' | 'reject') => {
    const id = user.id ?? user._id;
    if (!id) {
      setError('This user does not have a valid ID.');
      return;
    }

    setUpdatingId(id);
    setError('');
    try {
      if (action === 'approve') {
        await approveUser(id);
      } else {
        await rejectUser(id);
      }
      await loadUsers('pending');
    } catch (err) {
      setError(getApiErrorMessage(err, `Could not ${action} this user.`));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="min-h-[560px] rounded-xl bg-white p-7 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="m-0 text-lg font-bold">User Management</h2>
          <p className="mt-1 mb-0 text-sm text-slate-500">View users by account type and approval status.</p>
        </div>
        <button
          type="button"
          onClick={() => void loadUsers(activeTab)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 sm:grid-cols-4" role="tablist" aria-label="User groups">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
              activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-white hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {isLoading ? (
        <p className="py-8 text-center text-slate-500">Loading users...</p>
      ) : !error && users.length === 0 ? (
        <p className="py-8 text-center text-slate-500">No users found in this group.</p>
      ) : !error ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-separate border-spacing-y-2 text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Name</th><th className="px-3 py-2">Email</th><th className="px-3 py-2">Role</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Joined</th>
                {activeTab === 'pending' && <th className="px-3 py-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                const status = userStatus(user);
                return (
                  <tr key={user.id ?? user._id ?? `${user.email}-${index}`} className="bg-slate-50 text-slate-700">
                    <td className="rounded-l-lg px-3 py-3 font-semibold text-slate-900">{user.name}</td>
                    <td className="px-3 py-3 text-slate-500">{user.email}</td>
                    <td className="px-3 py-3 font-medium">{formatRole(user.role)}</td>
                    <td className="px-3 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${status.className}`}>{status.label}</span></td>
                    <td className={`${activeTab === 'pending' ? '' : 'rounded-r-lg'} px-3 py-3 text-slate-500`}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td>
                    {activeTab === 'pending' && (
                      <td className="rounded-r-lg px-3 py-2">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={updatingId === (user.id ?? user._id)}
                            onClick={() => void updatePendingUser(user, 'approve')}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {updatingId === (user.id ?? user._id) ? 'Updating...' : 'Approve'}
                          </button>
                          <button
                            type="button"
                            disabled={updatingId === (user.id ?? user._id)}
                            onClick={() => void updatePendingUser(user, 'reject')}
                            className="rounded-lg bg-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
