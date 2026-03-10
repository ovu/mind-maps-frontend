## Why

The backend API has been updated: the register endpoint now optionally accepts a user `name`, and the `/me` endpoint now returns the user's `name`. The frontend needs to support this so users can provide their name during registration and see it displayed in their profile.

## What Changes

- Add an optional "Name" field to the registration form
- Include `name` in the register API request when provided
- Update `UserProfile` type to include `name`
- Display the user's name on the welcome page (when available)

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `user-registration`: Registration form and API request now support an optional `name` field
- `welcome-page`: The `/me` response now includes `name`, which should be displayed

## Impact

- **API**: Register request body gains optional `name` field; `/me` response gains `name` field
- **Components**: Register form (new input), Welcome page (display name)
- **Services**: `AuthService.register()` signature, `UserProfile` interface
- **Tests**: Register and welcome page tests need updates
