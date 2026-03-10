## Context

The backend API has been updated to support an optional `name` field on registration and to return the user's `name` from the `/me` endpoint. Currently, the register form only collects `email` and `password`, and the welcome page only displays the email. The frontend needs to be updated to align with the new API contract.

## Goals / Non-Goals

**Goals:**
- Allow users to optionally provide their name during registration
- Display the user's name on the welcome page when available
- Maintain backward compatibility (name is optional)

**Non-Goals:**
- Profile editing or name updates after registration
- Name validation rules (min/max length, character restrictions)
- Displaying name in other parts of the app beyond the welcome page

## Decisions

1. **Optional name field placement**: The name field will be placed at the top of the registration form (before email) since it's the most natural order. It will have no validators since it's optional.

2. **UserProfile type update**: Add `name` as an optional string property (`name?: string`) to `UserProfile` rather than relying on the existing index signature. This provides type safety.

3. **Welcome page name display**: When `name` is present, greet with "Welcome, {name}!" instead of showing only the email. The email remains visible as a secondary identifier.

4. **AuthService.register() signature**: Add an optional `name` parameter to the register method. When provided, include it in the request body alongside email and password.

## Risks / Trade-offs

- [Name may be empty string from API] → Treat empty string same as undefined; only display when truthy
- [Existing tests assume two-field registration] → Tests need updating but changes are minimal
