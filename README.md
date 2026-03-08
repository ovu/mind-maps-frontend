# mind-maps-frontend

Frontend for the Mind Maps application — an interactive tool for creating and managing mind maps.

Built with **Angular** and **Tailwind CSS**, fully responsive across mobile, tablet, and desktop.

## Tech Stack

- **Angular** — component-based SPA framework
- **TypeScript** — statically typed JavaScript
- **Tailwind CSS** — utility-first CSS for responsive design
- **RxJS** — reactive programming for async data flows

## Getting Started

### Prerequisites

- Node.js (LTS)
- npm or yarn
- Angular CLI: `npm install -g @angular/cli`

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

> The backend must be running at `http://localhost:8080`. See [mind-maps-backend](../mind-maps-backend).

## Backend API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login — returns a JWT |
| GET | `/api/me` | Get current user (requires JWT) |

API docs (Swagger UI): [http://localhost:8080/docs](http://localhost:8080/docs)

## Responsive Design

The UI is designed mobile-first using Tailwind CSS breakpoints and adapts to:

- Mobile phones
- Tablets
- Desktops and large monitors

## Running Tests

```bash
ng test
```
