import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as authApi from '../api/auth.api';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { DevMailLink } from '../components/ui/DevMailLink';
import { Input } from '../components/ui/Input';
import { getApiErrorMessage } from '../context/AuthContext';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [devPreviewUrl, setDevPreviewUrl] = useState('');
  const [devResetUrl, setDevResetUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setDevPreviewUrl('');
    setDevResetUrl('');
    setIsSubmitting(true);

    try {
      const response = await authApi.forgotPassword(email);
      setMessage(
        response.message ||
          'If an account exists with this email, a password reset link has been sent.'
      );
      if (response.previewUrl) {
        setDevPreviewUrl(response.previewUrl);
      }
      if (response.resetUrl) {
        setDevResetUrl(response.resetUrl);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to send reset email.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Forgot password" subtitle="We'll email you a reset link">
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <Alert type="error" message={error} />}
        {message && <Alert type="success" message={message} />}

        <DevMailLink
          previewUrl={devPreviewUrl}
          fallbackUrl={devResetUrl}
          fallbackLabel="Reset link"
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
          {isSubmitting ? 'Sending...' : 'Send reset link'}
        </Button>

        <p className="auth-footer">
          Remember your password? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
