import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as authApi from '../api/auth.api';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { getApiErrorMessage, useAuth } from '../context/AuthContext';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing.');
      return;
    }

    const verify = async () => {
      try {
        const response = await authApi.verifyEmail(token);
        if (response.data?.user && response.data?.token) {
          setSession(response.data.user, response.data.token);
          setStatus('success');
          setMessage(response.message || 'Email verified successfully!');
        } else {
          setStatus('error');
          setMessage('Verification failed. Please try again.');
        }
      } catch (err) {
        setStatus('error');
        setMessage(getApiErrorMessage(err, 'Invalid or expired verification token.'));
      }
    };

    verify();
  }, [token, setSession]);

  return (
    <AuthLayout title="Email verification" subtitle="Confirming your email address">
      {status === 'loading' && <p className="muted">Verifying your email...</p>}

      {status === 'success' && (
        <>
          <Alert type="success" message={message} />
          <Button fullWidth onClick={() => navigate('/', { replace: true })}>
            Go to homepage
          </Button>
        </>
      )}

      {status === 'error' && (
        <>
          <Alert type="error" message={message} />
          <Button fullWidth onClick={() => navigate('/resend-verification')}>
            Resend verification email
          </Button>
          <p className="auth-footer">
            <Link to="/login">Back to sign in</Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
