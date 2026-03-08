# AGENTS.md

Context for AI agents working on this codebase.

## Project Overview

This is the **frontend** of a mind map solution. It is built with:

- **Angular** (latest)
- **Tailwind CSS** — the modern, utility-first CSS solution

## Tech Stack

| Component | Technology |
|-----------|------------|
| Language | TypeScript |
| Framework | Angular (latest) |
| CSS | Tailwind CSS — modern utility-first CSS |
| Reactive | RxJS |
| Domain | Mind maps frontend |

## CSS & Responsive Design

**Tailwind CSS** is the chosen CSS solution. It is a modern, utility-first framework — styling is applied directly in templates using utility classes, with no custom CSS files needed for most work.

**All UI components MUST be fully responsive.** The application must look and work correctly across all device sizes:

- **Mobile phones** — small screens, touch input
- **Tablets** — medium screens, touch + pointer
- **Desktops / large monitors** — large screens, mouse and keyboard

### Rules

- Use Tailwind's **mobile-first** approach: design for small screens first, then enhance with breakpoint prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Avoid fixed pixel widths. Prefer `w-full`, `max-w-*`, `flex`, `grid`, and their responsive variants
- The mind map canvas/viewer must handle different viewport sizes and orientations gracefully
- Layouts must reflow cleanly — no horizontal overflow on small screens

## Backend Integration

- **API docs (Swagger UI):** `http://localhost:8080/docs`
- **OpenAPI spec:** `http://localhost:8080/docs/openapi.yaml`
- **Base URL:** `http://localhost:8080`
- **Authentication:** JWT Bearer token — include as `Authorization: Bearer <token>` on protected requests

### Endpoints

| Method | Path | Description | Auth required |
|--------|------|-------------|---------------|
| POST | /auth/register | Register a new user (email + password) | No |
| POST | /auth/login | Login — returns a signed JWT | No |
| GET | /api/me | Get current authenticated user info | Yes (JWT) |

- On login success the response is `{ token: string }` — store the JWT client-side and attach it to subsequent protected calls
- Errors follow the shape `{ error: string }`
- The JWT is never returned again after login — store it securely (e.g. memory or `localStorage`)

## Testing

Tests MUST be written using Angular's built-in testing setup (**Jasmine + Karma**) or **Jest**. Cover components, services, and HTTP interactions. Use Angular's `HttpClientTestingModule` for mocking backend calls.
