import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { DevMailLink } from '../components/ui/DevMailLink';
import { Input } from '../components/ui/Input';
import { getApiErrorMessage, useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [devPreviewUrl, setDevPreviewUrl] = useState('');
  const [devVerificationUrl, setDevVerificationUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setDevPreviewUrl('');
    setDevVerificationUrl('');
    setIsSubmitting(true);

    try {
      const result = await register({ name, email, password });
      setSuccess('Registration successful! Please check your email to verify your account.');
      if (result.previewUrl) {
        setDevPreviewUrl(result.previewUrl);
      }
      if (result.verificationUrl) {
        setDevVerificationUrl(result.verificationUrl);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Register to get started">
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <DevMailLink
          previewUrl={devPreviewUrl}
          fallbackUrl={devVerificationUrl}
          fallbackLabel="Verification link"
        />

        {!success && (
          <>
            <Input
              label="Name"
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={30}
              value={name}
              onChange={(e) => setName(e.target.value)}
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

            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Register'}
            </Button>
          </>
        )}

        {success && (
          <Button type="button" fullWidth onClick={() => navigate('/login')}>
            Go to sign in
          </Button>
        )}

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
