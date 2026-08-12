import { useRef, useState } from 'react';
import * as authApi from '../../api/auth.api';
import { getApiErrorMessage } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { getToken } from '../../utils/tokenStorage';

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U';
}

export function ProfilePictureEditor() {
  const { user, setSession } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const uploadPicture = async (file?: File) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please select a JPG, PNG, or WEBP image.');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError('Image size must be 3 MB or smaller.');
      return;
    }

    setIsUploading(true); setError(''); setMessage('');
    try {
      const response = await authApi.updateProfilePicture(file);
      const token = getToken();
      if (!response.data?.user || !token) throw new Error(response.message || 'Upload failed.');
      setSession(response.data.user, token);
      setMessage('Profile picture updated.');
    } catch (err) { setError(getApiErrorMessage(err, 'Could not update profile picture.')); }
    finally { setIsUploading(false); if (inputRef.current) inputRef.current.value = ''; }
  };

  return <div className="flex flex-col items-center gap-3 rounded-xl bg-slate-50 p-5 sm:flex-row sm:items-start">
    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-100 text-2xl font-bold text-blue-700">
      {user?.profilePicture ? <img src={user.profilePicture} alt={`${user.name}'s profile`} className="h-full w-full object-cover" /> : initials(user?.name ?? 'User')}
    </div>
    <div className="text-center sm:text-left"><h3 className="m-0 font-bold">Profile picture</h3><p className="mt-1 mb-3 text-sm text-slate-500">JPG, PNG, or WEBP. Maximum file size 3 MB.</p><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => void uploadPicture(event.target.files?.[0])} /><button type="button" disabled={isUploading} onClick={() => inputRef.current?.click()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{isUploading ? 'Uploading...' : user?.profilePicture ? 'Change picture' : 'Upload picture'}</button>{message && <p className="mt-2 mb-0 text-sm text-emerald-700">{message}</p>}{error && <p className="mt-2 mb-0 text-sm text-rose-700">{error}</p>}</div>
  </div>;
}
