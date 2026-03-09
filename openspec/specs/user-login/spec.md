## ADDED Requirements

### Requirement: User can log in with email and password
The system SHALL provide a login form at `/login` where a user can authenticate by submitting their email and password to `POST /auth/login`.

#### Scenario: Successful login
- **WHEN** the user submits valid credentials
- **THEN** the system calls `POST /auth/login` with `{ email, password }`
- **AND** stores the returned `{ token: string }` in `localStorage`
- **AND** navigates to `/welcome`

#### Scenario: Login fails with server error
- **WHEN** the server returns an error response `{ error: string }`
- **THEN** the system displays the error message to the user
- **AND** remains on the `/login` page
- **AND** does NOT store any token

#### Scenario: User does not have an account
- **WHEN** the user is on `/login`
- **THEN** a link to `/register` SHALL be visible
- **AND** clicking it navigates to `/register`

### Requirement: Login form validation
The login form SHALL validate inputs before submission.

#### Scenario: Empty email field
- **WHEN** the user submits the form with an empty email
- **THEN** the system SHALL display a validation error and NOT call the API

#### Scenario: Empty password field
- **WHEN** the user submits the form with an empty password
- **THEN** the system SHALL display a validation error and NOT call the API
