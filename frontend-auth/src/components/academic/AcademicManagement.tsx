import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { createClass, createNotice, createSubject, deleteClass, getAcademicData, getAssignableStudents, updateClass, updateClassAssignments, type AssignableStudent } from '../../api/academic.api';
import { getApiErrorMessage } from '../../api/client';
import type { StudentClass, StudentSubject } from '../../api/student.api';

const initialClass = { name: '', code: '', description: '' };
const initialSubject = { subName: '', code: '', credits: '', description: '' };
const initialNotice = { title: '', description: '', imageUrl: '' };

type SelectionOption = { value: string; label: string; searchText: string };

export function AcademicManagement() {
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [subjects, setSubjects] = useState<StudentSubject[]>([]);
  const [students, setStudents] = useState<AssignableStudent[]>([]);
  const [classForm, setClassForm] = useState(initialClass);
  const [subjectForm, setSubjectForm] = useState(initialSubject);
  const [noticeForm, setNoticeForm] = useState(initialNotice);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [managedClassId, setManagedClassId] = useState<string | null>(null);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);

  const studentOptions = useMemo(() => students.map((student) => ({ value: student._id, label: `${student.name} — ${student.email}`, searchText: `${student.name} ${student.email}` })), [students]);
  const subjectOptions = useMemo(() => subjects.map((subject) => ({ value: subject.id ?? subject._id ?? '', label: `${subject.subName} (${subject.code})`, searchText: `${subject.subName} ${subject.code}` })).filter((subject) => Boolean(subject.value)), [subjects]);

  const loadData = useCallback(async () => {
    setIsLoading(true); setError('');
    try {
      const [data, availableStudents] = await Promise.all([getAcademicData(), getAssignableStudents()]);
      const uniqueClasses = data.classes.filter((cls, index, items) => items.findIndex((item) => item.code.toLowerCase() === cls.code.toLowerCase()) === index);
      setClasses(uniqueClasses); setSubjects(data.subjects); setStudents(availableStudents);
    } catch (err) { setError(getApiErrorMessage(err, 'Could not load academic data.')); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  const submit = async (event: FormEvent<HTMLFormElement>, type: 'class' | 'subject' | 'notice') => {
    event.preventDefault(); setError(''); setMessage(''); setIsSaving(true);
    try {
      if (type === 'class') { await createClass(classForm); setClassForm(initialClass); }
      if (type === 'subject') { await createSubject(subjectForm); setSubjectForm(initialSubject); }
      if (type === 'notice') { await createNotice(noticeForm); setNoticeForm(initialNotice); }
      setMessage(`${type === 'class' ? 'Class' : type === 'subject' ? 'Subject' : 'Notice'} created successfully.`);
      await loadData();
    } catch (err) { setError(getApiErrorMessage(err, `Could not create ${type}.`)); }
    finally { setIsSaving(false); }
  };

  const saveAssignments = async (cls: StudentClass, selectedStudents: string[], selectedSubjects: string[]) => {
    setError(''); setMessage(''); setIsSaving(true);
    try {
      await updateClassAssignments(cls.id, { students: selectedStudents, subjects: selectedSubjects });
      setMessage(`${cls.name} assignments updated.`); await loadData();
    } catch (err) { setError(getApiErrorMessage(err, 'Could not update assignments.')); }
    finally { setIsSaving(false); }
  };

  const saveClassDetails = async (cls: StudentClass, details: { name: string; code: string; description: string }) => {
    setError(''); setMessage(''); setIsSaving(true);
    try {
      await updateClass(cls.id, details);
      setEditingClassId(null); setMessage(`${details.name} updated successfully.`); await loadData();
    } catch (err) { setError(getApiErrorMessage(err, 'Could not update class.')); }
    finally { setIsSaving(false); }
  };

  const removeClass = async (cls: StudentClass) => {
    if (!window.confirm(`Delete ${cls.name} (${cls.code})? This cannot be undone.`)) return;
    setError(''); setMessage(''); setIsSaving(true);
    try {
      await deleteClass(cls.id);
      if (managedClassId === cls.id) setManagedClassId(null);
      if (editingClassId === cls.id) setEditingClassId(null);
      setMessage(`${cls.name} deleted successfully.`); await loadData();
    } catch (err) { setError(getApiErrorMessage(err, 'Could not delete class.')); }
    finally { setIsSaving(false); }
  };

  return <section id="academic-management" className="scroll-mt-24">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="m-0 text-xl font-bold">Academic Management</h2><p className="mt-1 mb-0 text-sm text-slate-500">First create subjects, then assign students and subjects to a class.</p></div><button onClick={() => void loadData()} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Refresh</button></div>
    {message && <p className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
    {error && <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    <div className="grid gap-5 lg:grid-cols-3">
      <form onSubmit={(event) => void submit(event, 'class')} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><h3 className="m-0 text-lg font-bold">Create Class</h3><p className="mt-1 text-sm text-slate-500">Assign students and subjects after creating the class.</p><div className="mt-4 grid gap-3"><input required value={classForm.name} onChange={(e) => setClassForm({ ...classForm, name: e.target.value })} placeholder="Class name" className="rounded-lg border border-slate-300 px-3 py-2" /><input required value={classForm.code} onChange={(e) => setClassForm({ ...classForm, code: e.target.value })} placeholder="Class code" className="rounded-lg border border-slate-300 px-3 py-2" /><textarea value={classForm.description} onChange={(e) => setClassForm({ ...classForm, description: e.target.value })} placeholder="Description (optional)" className="min-h-24 rounded-lg border border-slate-300 px-3 py-2" /><button disabled={isSaving} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60">Create class</button></div></form>
      <form onSubmit={(event) => void submit(event, 'subject')} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><h3 className="m-0 text-lg font-bold">Create Subject</h3><div className="mt-4 grid gap-3"><input required value={subjectForm.subName} onChange={(e) => setSubjectForm({ ...subjectForm, subName: e.target.value })} placeholder="Subject name" className="rounded-lg border border-slate-300 px-3 py-2" /><input required value={subjectForm.code} onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })} placeholder="Subject code" className="rounded-lg border border-slate-300 px-3 py-2" /><input value={subjectForm.credits} onChange={(e) => setSubjectForm({ ...subjectForm, credits: e.target.value })} placeholder="Credits (optional)" className="rounded-lg border border-slate-300 px-3 py-2" /><textarea value={subjectForm.description} onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })} placeholder="Description (optional)" className="min-h-20 rounded-lg border border-slate-300 px-3 py-2" /><button disabled={isSaving} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60">Create subject</button></div></form>
      <form onSubmit={(event) => void submit(event, 'notice')} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><h3 className="m-0 text-lg font-bold">Create Notice</h3><div className="mt-4 grid gap-3"><input required value={noticeForm.title} onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })} placeholder="Notice title" className="rounded-lg border border-slate-300 px-3 py-2" /><textarea required value={noticeForm.description} onChange={(e) => setNoticeForm({ ...noticeForm, description: e.target.value })} placeholder="Notice details" className="min-h-20 rounded-lg border border-slate-300 px-3 py-2" /><input value={noticeForm.imageUrl} onChange={(e) => setNoticeForm({ ...noticeForm, imageUrl: e.target.value })} placeholder="Image URL (optional)" className="rounded-lg border border-slate-300 px-3 py-2" /><button disabled={isSaving} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60">Publish notice</button></div></form>
    </div>
    {!isLoading && <section className="mt-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><h3 className="m-0 text-lg font-bold">Class List</h3><p className="mt-1 text-sm text-slate-500">Manage assignments, edit details, or delete a class.</p><div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{classes.map((cls) => <article key={cls.id} className="rounded-lg border border-slate-200 p-4"><h4 className="m-0 text-lg font-bold">{cls.name}</h4><p className="mt-1 text-sm font-semibold text-blue-700">{cls.code}</p><div className="mt-3 flex gap-3 text-sm text-slate-600"><span>{cls.students?.length ?? 0} students</span><span>{cls.subjects?.length ?? 0} subjects</span></div><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => setManagedClassId(managedClassId === cls.id ? null : cls.id)} className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white">{managedClassId === cls.id ? 'Close manager' : 'Manage class'}</button><button type="button" onClick={() => setEditingClassId(editingClassId === cls.id ? null : cls.id)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">{editingClassId === cls.id ? 'Cancel edit' : 'Edit'}</button><button type="button" disabled={isSaving} onClick={() => void removeClass(cls)} className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">Delete</button></div>{editingClassId === cls.id && <div className="mt-4 border-t border-slate-200 pt-4"><ClassEditor cls={cls} disabled={isSaving} onSave={saveClassDetails} /></div>}{managedClassId === cls.id && <div className="mt-4 border-t border-slate-200 pt-4"><AssignmentEditor cls={cls} studentOptions={studentOptions} subjectOptions={subjectOptions} disabled={isSaving} onSave={saveAssignments} /></div>}</article>)}{!classes.length && <p className="text-sm text-slate-500">No classes yet.</p>}</div></section>}
  </section>;
}

function CheckboxSelector({ label, options, value, onChange, empty }: { label: string; options: SelectionOption[]; value: string[]; onChange: (value: string[]) => void; empty: string }) {
  const [query, setQuery] = useState('');
  const visible = options.filter((option) => option.searchText.toLowerCase().includes(query.toLowerCase()));
  const selectedVisibleCount = visible.filter((option) => value.includes(option.value)).length;
  const toggle = (id: string) => onChange(value.includes(id) ? value.filter((selected) => selected !== id) : [...value, id]);
  const toggleAll = () => onChange(selectedVisibleCount === visible.length ? value.filter((id) => !visible.some((option) => option.value === id)) : Array.from(new Set([...value, ...visible.map((option) => option.value)])));
  return <fieldset className="rounded-lg border border-slate-200 p-3"><div className="flex items-center justify-between gap-2"><legend className="font-semibold text-slate-700">{label}</legend><span className="text-xs font-semibold text-blue-700">{value.length} selected</span></div>{options.length ? <><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${label.toLowerCase()}...`} className="mt-2 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" /><label className="mt-2 flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-600"><input type="checkbox" checked={visible.length > 0 && selectedVisibleCount === visible.length} onChange={toggleAll} />Select all {query ? 'shown' : ''}</label><div className="mt-2 max-h-36 space-y-1 overflow-y-auto pr-1">{visible.map((option) => <label key={option.value} className="flex cursor-pointer items-start gap-2 rounded px-1 py-1 text-sm text-slate-700 hover:bg-slate-50"><input type="checkbox" checked={value.includes(option.value)} onChange={() => toggle(option.value)} className="mt-0.5" /><span>{option.label}</span></label>)}{!visible.length && <p className="m-0 py-2 text-xs text-slate-500">No matching items.</p>}</div></> : <p className="mb-0 mt-2 text-xs text-slate-500">{empty}</p>}</fieldset>;
}

function ClassEditor({ cls, disabled, onSave }: { cls: StudentClass; disabled: boolean; onSave: (cls: StudentClass, details: { name: string; code: string; description: string }) => Promise<void> }) {
  const [details, setDetails] = useState({ name: cls.name, code: cls.code, description: cls.description ?? '' });
  useEffect(() => setDetails({ name: cls.name, code: cls.code, description: cls.description ?? '' }), [cls]);
  return <form onSubmit={(event) => { event.preventDefault(); void onSave(cls, details); }} className="grid gap-3"><h5 className="m-0 font-bold">Edit class</h5><input required value={details.name} onChange={(event) => setDetails({ ...details, name: event.target.value })} placeholder="Class name" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" /><input required value={details.code} onChange={(event) => setDetails({ ...details, code: event.target.value })} placeholder="Class code" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" /><textarea value={details.description} onChange={(event) => setDetails({ ...details, description: event.target.value })} placeholder="Description" className="min-h-20 rounded-lg border border-slate-300 px-3 py-2 text-sm" /><button disabled={disabled} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">Save changes</button></form>;
}

function AssignmentEditor({ cls, studentOptions, subjectOptions, disabled, onSave }: { cls: StudentClass; studentOptions: SelectionOption[]; subjectOptions: SelectionOption[]; disabled: boolean; onSave: (cls: StudentClass, students: string[], subjects: string[]) => Promise<void> }) {
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [subjectIds, setSubjectIds] = useState<string[]>([]);
  useEffect(() => { setStudentIds((cls.students ?? []).map((student) => typeof student === 'string' ? student : student._id ?? student.id).filter((id): id is string => Boolean(id))); setSubjectIds((cls.subjects ?? []).map((subject) => typeof subject === 'string' ? subject : subject._id ?? subject.id).filter((id): id is string => Boolean(id))); }, [cls]);
  return <article className="rounded-lg border border-slate-200 p-4"><h4 className="m-0 font-bold">{cls.name} <span className="text-sm font-normal text-slate-500">({cls.code})</span></h4><div className="mt-3 grid gap-3"><CheckboxSelector label="Students" options={studentOptions} value={studentIds} onChange={setStudentIds} empty="No verified students found." /><CheckboxSelector label="Subjects" options={subjectOptions} value={subjectIds} onChange={setSubjectIds} empty="No subjects found." /><button type="button" disabled={disabled} onClick={() => void onSave(cls, studentIds, subjectIds)} className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">Save assignments</button></div></article>;
}
