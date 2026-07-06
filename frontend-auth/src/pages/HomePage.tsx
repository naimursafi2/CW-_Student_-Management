import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="home-layout">
      <header className="home-header">
        <div>
          <h1>Welcome, {user?.name}</h1>
          <p className="muted">You are signed in to your account.</p>
        </div>
        <Button variant="secondary" onClick={logout}>
          Log out
        </Button>
      </header>

      <main className="home-content">
        <section className="info-card">
          <h2>Profile</h2>
          <dl className="profile-list">
            <div>
              <dt>Name</dt>
              <dd>{user?.name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user?.email}</dd>
            </div>
            <div>
              <dt>Email verified</dt>
              <dd>{user?.isEmailVerified ? 'Yes' : 'No'}</dd>
            </div>
            <div>
              <dt>Member since</dt>
              <dd>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</dd>
            </div>
          </dl>
        </section>

        <p className="muted">
          Need another account? <Link to="/register">Register</Link> or{' '}
          <Link to="/login">sign in</Link> with different credentials after logging out.
        </p>
      </main>
    </div>
  );
}
