import { apiClient } from './client';
import type { ApiResponse, ManagedUser } from '../types/auth.types';

export type UserManagementTab = 'all' | 'pending' | 'teachers' | 'students';

type AdminResponse = ApiResponse<{
  users?: ManagedUser[];
  teacher?: ManagedUser[];
  students?: ManagedUser[];
}> & {
  user?: ManagedUser[];
};

export async function getUsers(tab: UserManagementTab): Promise<ManagedUser[]> {
  const endpoints: Record<UserManagementTab, string> = {
    all: '/admin/users',
    pending: '/admin/users/pending',
    teachers: '/admin/teachers',
    students: '/admin/students',
  };

  const { data } = await apiClient.get<AdminResponse>(endpoints[tab]);
  return data.data?.users ?? data.data?.teacher ?? data.data?.students ?? data.user ?? [];
}

export async function approveUser(id: string) {
  await apiClient.patch(`/admin/approved/${id}`);
}

export async function rejectUser(id: string) {
  await apiClient.delete(`/admin/users/${id}/reject`);
}
