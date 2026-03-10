## 1. Types and Services

- [x] 1.1 Add optional `name` property to `UserProfile` interface in `user.service.ts`
- [x] 1.2 Update `AuthService.register()` to accept an optional `name` parameter and include it in the request body when provided

## 2. Registration Form

- [x] 2.1 Add optional name input field to the register form (above email)
- [x] 2.2 Update form submission to pass `name` to `AuthService.register()` when provided

## 3. Welcome Page

- [x] 3.1 Update welcome page to display user's name in the greeting when available
- [x] 3.2 Fall back to email-only display when name is absent or empty

## 4. Tests

- [x] 4.1 Update auth service tests for register with and without name
- [x] 4.2 Update register component tests for the new name field
- [x] 4.3 Update welcome page tests for name display scenarios
- [x] 4.4 Run all tests and verify they pass
