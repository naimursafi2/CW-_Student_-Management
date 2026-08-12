import { apiClient } from './client';

export interface StudentSubject { _id?: string; id?: string; subName: string; code: string; credits?: string; description?: string; }
export interface StudentClass { id: string; name: string; code: string; description?: string; subjects: StudentSubject[]; students?: Array<string | { _id?: string; id?: string; name?: string; email?: string }>; teacher?: { _id?: string; id?: string; name?: string; email?: string } | null; }
export interface Notice { id: string; title: string; description: string; imageUrl?: string; likesCount: number; createdAt: string; postedBy?: { name?: string; role?: string }; }

export async function getStudentDashboardData() {
  const [classResponse, subjectResponse, noticeResponse] = await Promise.all([
    apiClient.get<{ data?: { classes?: StudentClass[] } }>('/class/get'),
    apiClient.get<{ data?: StudentSubject[] }>('/subject/get'),
    apiClient.get<{ data?: { notices?: Notice[] } }>('/notice/get'),
  ]);

  return {
    classes: classResponse.data.data?.classes ?? [],
    subjects: subjectResponse.data.data ?? [],
    notices: noticeResponse.data.data?.notices ?? [],
  };
}
