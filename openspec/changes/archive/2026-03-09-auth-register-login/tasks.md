## 1. Project Scaffold

- [x] 1.1 Generate new Angular project with routing enabled (`ng new mind-maps-frontend --routing --style=css --standalone`)
- [x] 1.2 Install and configure Tailwind CSS (follow official Angular + Tailwind guide)
- [x] 1.3 Verify dev server runs (`ng serve`) and Tailwind utility classes apply correctly

## 2. Auth Service

- [x] 2.1 Create `AuthService` with `register(email, password)` method calling `POST /auth/register`
- [x] 2.2 Add `login(email, password)` method calling `POST /auth/login` and storing JWT in `localStorage` under key `auth_token`
- [x] 2.3 Add `logout()` method that removes the token from `localStorage`
- [x] 2.4 Add `getToken()` method that reads token from `localStorage`
- [x] 2.5 Add `isAuthenticated()` method returning `true` if a token exists
- [x] 2.6 Create `UserService` with `getMe()` method calling `GET /api/me` with Bearer token

## 3. HTTP Interceptor

- [x] 3.1 Create functional `AuthInterceptor` that reads token from `localStorage` and attaches `Authorization: Bearer <token>` header when token exists
- [x] 3.2 Register the interceptor in `app.config.ts` using `provideHttpClient(withInterceptors([authInterceptor]))`

## 4. Route Guards

- [x] 4.1 Create `authGuard` (functional guard) that checks `isAuthenticated()` — redirects to `/login` if false
- [x] 4.2 Create `guestGuard` (functional guard) that checks `isAuthenticated()` — redirects to `/welcome` if true
- [x] 4.3 Configure routes in `app.routes.ts`:
  - `''` → redirect to `/login`
  - `/register` → `RegisterComponent` with `guestGuard`
  - `/login` → `LoginComponent` with `guestGuard`
  - `/welcome` → `WelcomeComponent` with `authGuard`

## 5. Register Component

- [x] 5.1 Create `RegisterComponent` with reactive form (email + password fields)
- [x] 5.2 Add form validation: required email, valid email format, required password
- [x] 5.3 On submit, call `AuthService.register()` — on success navigate to `/login`
- [x] 5.4 Display server error message when registration fails
- [x] 5.5 Add "Already have an account? Log in" link to `/login`
- [x] 5.6 Style with Tailwind CSS — responsive layout (mobile-first)

## 6. Login Component

- [x] 6.1 Create `LoginComponent` with reactive form (email + password fields)
- [x] 6.2 Add form validation: required email, valid email format, required password
- [x] 6.3 On submit, call `AuthService.login()` — on success navigate to `/welcome`
- [x] 6.4 Display server error message when login fails
- [x] 6.5 Add "Don't have an account? Register" link to `/register`
- [x] 6.6 Style with Tailwind CSS — responsive layout (mobile-first)

## 7. Welcome Component

- [x] 7.1 Create `WelcomeComponent` that calls `UserService.getMe()` on init
- [x] 7.2 Display welcome message with user's email
- [x] 7.3 Handle `GET /api/me` 401 error — redirect to `/login`
- [x] 7.4 Add logout button that calls `AuthService.logout()` and navigates to `/login`
- [x] 7.5 Style with Tailwind CSS — responsive layout (mobile-first)

## 8. Tests

- [x] 8.1 Write unit tests for `AuthService` (register, login, logout, getToken, isAuthenticated)
- [x] 8.2 Write unit tests for `UserService` (getMe)
- [x] 8.3 Write unit tests for `AuthInterceptor` using `HttpClientTestingModule`
- [x] 8.4 Write unit tests for `authGuard` and `guestGuard`
- [x] 8.5 Write component tests for `RegisterComponent` (form validation, success, error)
- [x] 8.6 Write component tests for `LoginComponent` (form validation, success, error)
- [x] 8.7 Write component tests for `WelcomeComponent` (displays email, logout, 401 redirect)
