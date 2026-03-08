## Why

The mind map application has no user-facing entry point. Users need to register an account and log in before accessing the app. This is the foundational auth layer that enables all future protected functionality.

## What Changes

- Add `/register` page with email + password registration form
- Add `/login` page with email + password login form
- Add `/welcome` page showing the authenticated user's email
- Store JWT token in `localStorage` after successful login
- Attach JWT as `Authorization: Bearer <token>` header on protected API calls via HTTP interceptor
- Route guards: protect `/welcome` (redirect to `/login` if unauthenticated), redirect `/login` and `/register` to `/welcome` if already authenticated
- After successful registration, redirect user to `/login`
- After successful login, redirect user to `/welcome`

## Capabilities

### New Capabilities

- `user-registration`: Register a new user account with email and password via `POST /auth/register`
- `user-login`: Authenticate with email and password via `POST /auth/login`, receive and store JWT
- `auth-session`: Manage JWT token lifecycle (store in localStorage, attach to requests, guard routes)
- `welcome-page`: Display authenticated user's email fetched from `GET /api/me`

### Modified Capabilities

<!-- None — this is a greenfield project with no existing specs -->

## Impact

- New Angular project scaffold required (greenfield — no `package.json` or `angular.json` yet)
- New dependencies: Angular (latest), Tailwind CSS, RxJS
- Backend integration: `http://localhost:8080` — `/auth/register`, `/auth/login`, `/api/me`
- All routes are new: `/register`, `/login`, `/welcome`, `/` (redirects to `/login`)
