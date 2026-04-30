# NIPPARD — Science-Based Gym Tracking App

A full-stack React + Vite gym tracking application built for Jeff Nippard's training platform.

## Features

- **Authentication** — Login, Register, JWT sessions, protected routes
- **User Roles** — Admin, Coach, Athlete with role-gated UI and routes
- **Admin Dashboard** — User management, platform stats, activity log, system config
- **Coach Panel** — Athlete roster, adherence tracking, progress monitoring
- **Workout Logging** — Log sets with weight, reps, RPE; auto-calculates volume
- **Progress Charts** — Strength curves, estimated 1RM, personal records
- **Programs** — Browse evidence-based training programs

---

## Demo Accounts

| Role    | Email                   | Password     |
|---------|-------------------------|--------------|
| Admin   | jeff@nippard.com        | science123   |
| Coach   | coach@nippard.com       | coach123     |
| Athlete | athlete@nippard.com     | lift123      |

---

## Quick Start (Local Dev)

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# Opens at http://localhost:5173
```

---

## Production Build

```bash
# Build for production
npm run build

# Output goes to /dist — deploy this folder
```

---

## Nginx Deployment

1. Build the app: `npm run build`
2. Copy `dist/` to your server: `/var/www/nippard/dist`
3. Copy `nginx/nippard.conf` to `/etc/nginx/sites-available/nippard`
4. Enable it: `ln -s /etc/nginx/sites-available/nippard /etc/nginx/sites-enabled/`
5. Get SSL cert: `certbot --nginx -d nippard.com`
6. Reload nginx: `nginx -s reload`

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18 + Vite                   |
| Routing   | React Router v6                   |
| Charts    | Recharts                          |
| Auth      | JWT (localStorage), Role-based    |
| Styling   | Pure CSS-in-JS (no framework)     |
| Fonts     | Barlow Condensed + JetBrains Mono |
| Server    | Nginx (reverse proxy + SPA)       |
| Backend   | Plug into any REST API on :8080   |

---

## Project Structure

```
src/
  context/
    AuthContext.jsx      # JWT auth, login/register/logout, roles
    WorkoutContext.jsx   # Workout data, exercises, PRs, streaks
  components/
    AppLayout.jsx        # Sidebar navigation shell
    auth/
      ProtectedRoute.jsx # Route guards by auth + role
  pages/
    LoginPage.jsx
    RegisterPage.jsx
    DashboardPage.jsx    # Stats, charts, recent sessions
    WorkoutsPage.jsx     # Workout history
    NewWorkoutPage.jsx   # Log a session
    ProgressPage.jsx     # Strength curves, PRs
    ProgramsPage.jsx     # Browse programs
    AdminPage.jsx        # Admin-only: users, platform, system
    CoachPage.jsx        # Coach-only: athlete management
nginx/
  nippard.conf           # Production nginx config with SSL, rate limits
```

---

## Connecting Your Backend

The app proxies `/api/*` to `localhost:8080` in dev (see `vite.config.js`).

In production, nginx proxies `/api/` to your backend server. Update the upstream in `nginx/nippard.conf`:

```nginx
upstream api_backend {
    server YOUR_BACKEND_IP:8080;
}
```

Replace the mock data in `AuthContext.jsx` and `WorkoutContext.jsx` with real `fetch()` calls to your API.
