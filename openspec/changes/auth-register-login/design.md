## Context

Greenfield Angular application. No existing code — needs full project scaffold. Backend is already running at `http://localhost:8080` with JWT-based auth. The frontend must integrate with three endpoints: `POST /auth/register`, `POST /auth/login`, and `GET /api/me`.

The app is mobile-first (Tailwind CSS, responsive), single-user per session, no multi-tab sync requirements.

## Goals / Non-Goals

**Goals:**
- Scaffold Angular project with Tailwind CSS
- Implement register, login, and welcome pages
- JWT stored in `localStorage`, attached via HTTP interceptor
- Route guards for auth-protected and auth-redirect routes
- Responsive UI across mobile, tablet, and desktop

**Non-Goals:**
- Password reset / forgot password
- Social / OAuth login
- Multi-factor authentication
- Token refresh / silent re-authentication
- Persisting session across browser tabs reactively

## Decisions

### 1. Token storage: `localStorage`

**Decision**: Store JWT in `localStorage` under key `auth_token`.

**Rationale**: Simple, survives page refresh, appropriate for a mind map productivity app (not a banking app). The AGENTS.md explicitly lists localStorage as acceptable.

**Alternative considered**: In-memory (Angular service property) — rejected because token is lost on refresh, requiring re-login every time.

### 2. HTTP interceptor for auth header

**Decision**: Use a single `AuthInterceptor` (functional interceptor, Angular 15+ style) to read the token from `localStorage` and attach `Authorization: Bearer <token>` to all outgoing requests.

**Rationale**: Centralizes auth logic. No need to manually attach headers per call.

### 3. Route guard strategy

**Decision**:
- `AuthGuard` — blocks unauthenticated access to `/welcome`, redirects to `/login`
- `GuestGuard` — blocks authenticated users from accessing `/login` and `/register`, redirects to `/welcome`

**Rationale**: Prevents authenticated users from seeing auth forms and unauthenticated users from seeing protected content.

### 4. Angular standalone components (no NgModules)

**Decision**: Use Angular standalone components throughout (no `NgModule` declarations).

**Rationale**: Current Angular best practice, less boilerplate, cleaner imports.

### 5. After register → redirect to `/login`

**Decision**: On successful registration, navigate to `/login` rather than auto-logging in.

**Rationale**: Explicit user decision. Keeps flows simple and decoupled.

### 6. Welcome page data source: `GET /api/me`

**Decision**: Fetch user info from `GET /api/me` after login to display email on welcome page.

**Rationale**: Token doesn't expose user data directly; `GET /api/me` is the contract for user info per AGENTS.md.

## Risks / Trade-offs

- **XSS risk with localStorage** → Mitigation: Acceptable for this app's risk profile; avoid `innerHTML`, use Angular's built-in sanitization
- **No token expiry handling** → Mitigation: If `GET /api/me` returns 401 on welcome page, redirect to `/login`; full refresh flow is out of scope
- **Greenfield scaffold complexity** → Mitigation: Use `ng new` with routing and skip tests flag for speed, then configure Tailwind per official guide
