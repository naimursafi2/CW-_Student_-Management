# Frontend Auth

React + Vite frontend for the `backend-auth` API.

## Setup

```bash
cd frontend-auth
npm install
cp .env.example .env   # or copy manually on Windows
npm run dev
```

Runs at **http://localhost:3000** (Vite default port).

Ensure `backend-auth` has `FRONTEND_URL=http://localhost:3000` in its `.env`.

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL (default: `http://localhost:8000/api/v1`) |

## Routes

| Path | Description |
|------|-------------|
| `/` | Homepage (protected, after login) |
| `/login` | Sign in |
| `/register` | Create account |
| `/verify-email?token=` | Email verification (from email link) |
| `/resend-verification` | Resend verification email |
| `/forgot-password` | Request password reset |
| `/reset-password?token=` | Set new password (from email link) |

## Auth flow

1. **Register** → verification email sent → click link → auto-login → homepage
2. **Login** → JWT stored in localStorage → homepage
3. **Forgot password** → reset email → `/reset-password?token=` → auto-login → homepage

JWT is sent as `Authorization: Bearer <token>` on protected requests (`GET /auth/me`).
