# DevPulse

DevPulse is a developer productivity dashboard built with React 19, Vite, and TailwindCSS. It aggregates external API data, tracks user productivity, and includes a trivia mini-game.

## Features

- **Dashboard:** Unified view of users, posts, productivity stats, trivia scores, and global countries.
- **Robust Authentication:** JWT-based auth with silent token refresh, integrated with a custom Express backend.
- **Trivia Game:** Play trivia, score points, and climb the global leaderboard.
- **Modern UI:** Built with Tailwind v4, featuring a responsive slide-in sidebar, glassmorphism design, and custom animations.
- **Performance:** Implements per-tab client-side caching (5-minute TTL) to minimize redundant API calls.

## Prerequisites

- Node.js (v18+)
- Running instance of the DevPulse Backend (configured to run on port 3000 by default)

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Setup**
   Copy `.env.example` to `.env` and adjust if necessary:

   ```bash
   cp .env.example .env
   ```

3. **Development Server**
   Start the Vite development server (proxies `/api` to `localhost:3000`):
   ```bash
   npm run dev
   ```

## Testing

Unit tests run via Vitest:

```bash
npm run test           # Run tests
npm run test:coverage  # Run tests with coverage report
```

## Production Build

Build the static SPA bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Tech Stack

- **Framework:** React 19 + Vite 8
- **Styling:** TailwindCSS v4
- **Routing:** React Router v7
- **Data Visualization:** Recharts
- **HTTP Client:** Axios (with interceptors)
- **Testing:** Vitest + React Testing Library
