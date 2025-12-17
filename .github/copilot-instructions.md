# Copilot Instructions for node-template

## Project Overview

This is an **AdonisJS 6** real estate listing application with web scraping capabilities. The backend uses AdonisJS with Lucid ORM (PostgreSQL), while the frontend is built with **Inertia.js + React + TypeScript**. Key features include scheduled scraping from multiple real estate agencies and a search interface for property listings.

## Architecture & Tech Stack

### Backend (AdonisJS)

- **Framework**: AdonisJS v6 with TypeScript
- **Database**: PostgreSQL via Lucid ORM
- **Path aliases**: Use `#` imports (defined in package.json) - e.g., `#models/listing`, `#controllers/*`
- **Key services**: Web scraping with Playwright, scheduled tasks with `adonisjs-scheduler`

### Frontend (Inertia + React)

- **Stack**: Inertia.js + React 19 + TypeScript + Tailwind CSS v4
- **Path aliases**: Use `~/` or `@/` for `inertia/` directory imports
- **Components**: shadcn/ui components in `inertia/components/ui/`, custom components in `inertia/components/`
- **Pages**: Located in `inertia/pages/`, automatically resolved by Inertia

### Data Flow

1. **Scraping**: Scheduled commands (`commands/scrape_lisitngs.ts`) run scrapers in `app/scrapping_service/`
2. **Models**: `ScrappedListing` → `Listing` (normalized data)
3. **Controllers**: Fetch from `Listing` model, render via Inertia
4. **Frontend**: React pages receive props from controllers, render with components

## Development Workflow

### Running the App

```bash
npm run dev          # Start dev server with HMR (Vite + AdonisJS)
npm run build        # Build for production
npm start            # Run production build
```

### Database

```bash
node ace migration:run    # Run migrations
node ace db:seed          # Seed database
docker compose up -d      # Start PostgreSQL (port 5432)
```

### Scraping & Commands

```bash
node ace scrape:listings  # Run scraper manually
node ace list             # List all available commands
```

### Testing

```bash
npm test                  # Run Japa tests
npx playwright test       # Run E2E tests
```

## Key Conventions

### Backend Patterns

- **Controllers**: Return `inertia.render('page_name', props)` to render React pages
- **Middleware**: Defined in `start/kernel.ts`, named middleware in route definitions
- **Models**: Use Lucid decorators (`@column`, `@hasMany`, etc.)
- **Routes**: Define in `start/routes.ts` using lazy imports: `[HomeController, 'index']`

### Frontend Patterns

- **Inertia Pages**: Export default function component with typed props
- **Head tags**: Use `<Head title="..." />` from `@inertiajs/react`
- **Navigation**: Use `<Link href="..." />` instead of `<a>` tags
- **Forms**: Use `react-hook-form` with zod validation (via `@hookform/resolvers/zod`)
- **Styling**: Tailwind v4 with `tw-merge` and `class-variance-authority` for components

### Code Organization

- **No barrel exports**: Import directly from file paths
- **Scraping services**: Each agency has its own file in `app/scrapping_service/`
- **Shared utilities**: Backend in `app/lib/`, frontend in `inertia/lib/` and `inertia/helpers/`

## Important Implementation Details

### Scraping Architecture

- Uses **Playwright** (chromium) for browser automation
- Scrapers save to `ScrappedListing` model first, then normalize to `Listing`
- Scheduled daily at 3 AM Sao Paulo time via `start/scheduler.ts`
- Truncates `ScrappedListing` table on each run

### Inertia Setup

- **SSR disabled**: Client-side rendering only (`ssr: { enabled: false }`)
- Root view: `resources/views/inertia_layout.edge`
- Shared data: Currently empty but can add global props (e.g., authenticated user)

### Authentication

- Session-based auth with `@adonisjs/auth`
- Named middleware: `auth` and `guest` available for routes
- User model: `app/models/user.ts`

### Hot Module Replacement

- Enabled via `hot-hook` for controllers and middleware
- Vite HMR for frontend React components
- Edge templates trigger reload (configured in vite.config.ts)

## Common Pitfalls

1. **Path aliases**: Always use `#` for backend imports, `~/` or `@/` for frontend
2. **Inertia props**: Type your page props explicitly, don't use `any`
3. **Migrations**: Use descriptive names with timestamps (generated via `node ace make:migration`)
4. **Scraper error handling**: Always use `.catch()` for Playwright selectors that might not exist
5. **Environment**: Requires PostgreSQL running (use `docker compose up -d`)
