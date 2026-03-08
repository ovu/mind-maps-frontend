## ADDED Requirements

### Requirement: Welcome page displays authenticated user's email
The system SHALL display a welcome message with the authenticated user's email on the `/welcome` page, fetched from `GET /api/me`.

#### Scenario: Successful user info fetch
- **WHEN** an authenticated user lands on `/welcome`
- **THEN** the system calls `GET /api/me` with the Bearer token
- **AND** displays the user's email in a welcome message

#### Scenario: User info fetch fails (e.g. expired token)
- **WHEN** `GET /api/me` returns a 401 error
- **THEN** the system redirects the user to `/login`

### Requirement: Welcome page provides logout
The welcome page SHALL provide a logout action that clears the session.

#### Scenario: User clicks logout
- **WHEN** the user clicks the logout button on `/welcome`
- **THEN** the JWT is removed from `localStorage`
- **AND** the user is redirected to `/login`
