## ADDED Requirements

### Requirement: User can register with email and password
The system SHALL provide a registration form at `/register` where a user can create an account by submitting their email and password to `POST /auth/register`.

#### Scenario: Successful registration
- **WHEN** the user submits a valid email and password
- **THEN** the system calls `POST /auth/register` with `{ email, password }`
- **AND** on success, navigates to `/login`

#### Scenario: Registration fails with server error
- **WHEN** the server returns an error response `{ error: string }`
- **THEN** the system displays the error message to the user
- **AND** remains on the `/register` page

#### Scenario: User already has an account
- **WHEN** the user is on `/register`
- **THEN** a link to `/login` SHALL be visible
- **AND** clicking it navigates to `/login`

### Requirement: Registration form validation
The registration form SHALL validate inputs before submission.

#### Scenario: Empty email field
- **WHEN** the user submits the form with an empty email
- **THEN** the system SHALL display a validation error and NOT call the API

#### Scenario: Empty password field
- **WHEN** the user submits the form with an empty password
- **THEN** the system SHALL display a validation error and NOT call the API

#### Scenario: Invalid email format
- **WHEN** the user submits the form with an invalid email format
- **THEN** the system SHALL display a validation error and NOT call the API
