import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as authApi from '../api/auth.api';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { DevMailLink } from '../components/ui/DevMailLink';
import { Input } from '../components/ui/Input';
import { getApiErrorMessage } from '../context/AuthContext';

export function ResendVerificationPage() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [devPreviewUrl, setDevPreviewUrl] = useState('');
  const [devVerificationUrl, setDevVerificationUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setDevPreviewUrl('');
    setDevVerificationUrl('');
    setIsSubmitting(true);

    try {
      const response = await authApi.resendVerification(email);
      setMessage(
        response.message ||
          'If an account exists with this email, a verification link has been sent.'
      );
      if (response.previewUrl) {
        setDevPreviewUrl(response.previewUrl);
      }
      if (response.verificationUrl) {
        setDevVerificationUrl(response.verificationUrl);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to resend verification email.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Resend verification"
      subtitle="We'll send a new verification link to your email"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <Alert type="error" message={error} />}
        {message && <Alert type="success" message={message} />}

        <DevMailLink
          previewUrl={devPreviewUrl}
          fallbackUrl={devVerificationUrl}
          fallbackLabel="Verification link"
        />

        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Resend verification email'}
        </Button>

        <p className="auth-footer">
          <Link to="/login">Back to sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
