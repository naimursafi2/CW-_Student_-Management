import { apiClient } from './client';
import type { Notice, StudentClass, StudentSubject } from './student.api';

export interface ClassInput { name: string; code: string; description?: string; students?: string[]; subjects?: string[]; teacher?: string | null; }
export interface SubjectInput { subName: string; code: string; credits?: string; description?: string; }
export interface NoticeInput { title: string; description: string; imageUrl?: string; }

export async function getAcademicData() {
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

export async function createClass(input: ClassInput) {
  return apiClient.post('/class/create', input);
}

export async function createSubject(input: SubjectInput) {
  return apiClient.post('/subject/create', input);
}

export async function createNotice(input: NoticeInput) {
  return apiClient.post('/notice/create', input);
}

export interface AssignableStudent { _id?: string; id?: string; name: string; email: string; }

export async function getAssignableStudents() {
  const { data } = await apiClient.get<{ data?: { students?: AssignableStudent[] } }>('/class/students');
  return data.data?.students ?? [];
}

export async function updateClassAssignments(id: string, input: Pick<ClassInput, 'students' | 'subjects' | 'teacher'>) {
  return apiClient.put(`/class/update/${id}`, input);
}

export async function updateClass(id: string, input: Pick<ClassInput, 'name' | 'code' | 'description'>) {
  return apiClient.put(`/class/update/${id}`, input);
}

export async function deleteClass(id: string) {
  return apiClient.delete(`/class/delete/${id}`);
}

export async function getTeachers() {
  const { data } = await apiClient.get<{ data?: { teacher?: AssignableStudent[] } }>('/admin/teachers?status=approved');
  return data.data?.teacher?.filter((teacher) => Boolean(teacher._id ?? teacher.id)) ?? [];
}

export async function getTeacherClass(id: string) { return apiClient.get<{ data: { class: StudentClass } }>(`/teacher/classes/${id}`); }
export async function saveAttendance(id: string, date: string, records: { studentId: string; status: 'present' | 'absent' }[]) { return apiClient.post(`/teacher/classes/${id}/attendance`, { date, records }); }
export async function saveMarks(id: string, studentId: string, subjectId: string, marks: number) { return apiClient.put(`/teacher/classes/${id}/results`, { studentId, subjectId, marks }); }
