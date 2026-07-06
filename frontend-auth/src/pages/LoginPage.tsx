import axios from 'axios';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { getApiErrorMessage, useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setNeedsVerification(false);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate('/', { replace: true });
    } catch (err) {
      const message = getApiErrorMessage(err, 'Login failed.');
      setError(message);

      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setNeedsVerification(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Sign in" subtitle="Access your account">
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <Alert type="error" message={error} />}

        {/*{needsVerification && (
          <Alert
            type="info"
            message="Your email is not verified yet. Check your inbox or resend the verification email."
          />
        )}*/}

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
          autoComplete="current-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="form-actions">
          <Link to="/forgot-password" className="link-sm">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>

        <p className="auth-footer">
          No account? <Link to="/register">Create one</Link>
        </p>

        {needsVerification && (
          <p className="auth-footer">
            <Link to={`/resend-verification?email=${encodeURIComponent(email)}`}>
              Resend verification email
            </Link>
          </p>
        )}
      </form>
    </AuthLayout>
  );
}
