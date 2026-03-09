## ADDED Requirements

### Requirement: JWT stored in localStorage
The system SHALL store the JWT token in `localStorage` under the key `auth_token` after successful login.

#### Scenario: Token persists after page refresh
- **WHEN** the user refreshes the browser after logging in
- **THEN** the token is still available in `localStorage`
- **AND** the user remains authenticated

#### Scenario: Token is cleared on logout
- **WHEN** the user logs out
- **THEN** the token SHALL be removed from `localStorage`
- **AND** the user is redirected to `/login`

### Requirement: JWT attached to protected API requests
The system SHALL attach the JWT as an `Authorization: Bearer <token>` header on all outgoing HTTP requests when a token is present.

#### Scenario: Authenticated request
- **WHEN** a protected API call is made while a token exists in `localStorage`
- **THEN** the request includes the header `Authorization: Bearer <token>`

#### Scenario: Unauthenticated request
- **WHEN** an API call is made with no token in `localStorage`
- **THEN** no `Authorization` header is attached

### Requirement: Route guard — protected routes
The system SHALL prevent unauthenticated users from accessing protected routes.

#### Scenario: Unauthenticated access to /welcome
- **WHEN** an unauthenticated user navigates to `/welcome`
- **THEN** the system redirects them to `/login`

### Requirement: Route guard — guest-only routes
The system SHALL redirect authenticated users away from auth pages.

#### Scenario: Authenticated user visits /login
- **WHEN** an authenticated user navigates to `/login`
- **THEN** the system redirects them to `/welcome`

#### Scenario: Authenticated user visits /register
- **WHEN** an authenticated user navigates to `/register`
- **THEN** the system redirects them to `/welcome`

### Requirement: Root route redirect
The system SHALL redirect the root path `/` to `/login`.

#### Scenario: User visits root
- **WHEN** a user navigates to `/`
- **THEN** the system redirects to `/login`
