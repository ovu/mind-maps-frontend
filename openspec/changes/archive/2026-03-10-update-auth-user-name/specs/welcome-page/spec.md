## MODIFIED Requirements

### Requirement: Welcome page displays authenticated user's email
The system SHALL display a welcome message with the authenticated user's information on the `/welcome` page, fetched from `GET /api/me`. When the user has a name, the welcome message SHALL include the name. The email SHALL always be displayed.

#### Scenario: Successful user info fetch with name
- **WHEN** an authenticated user lands on `/welcome`
- **AND** `GET /api/me` returns a response with `name` and `email`
- **THEN** the system displays a welcome message including the user's name
- **AND** displays the user's email

#### Scenario: Successful user info fetch without name
- **WHEN** an authenticated user lands on `/welcome`
- **AND** `GET /api/me` returns a response with `email` but no `name` (or empty name)
- **THEN** the system displays a welcome message with the user's email only

#### Scenario: User info fetch fails (e.g. expired token)
- **WHEN** `GET /api/me` returns a 401 error
- **THEN** the system redirects the user to `/login`
