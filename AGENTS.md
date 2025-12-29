# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

Important: Always use `./scripts.sh` and the Docker environment for running checks, tests, or verifying changes. Do not run commands locally without Docker unless explicitly requested.

## Environment Setup

1. Copy `.env.example` to `.env` and configure
2. Development uses Postgres by default (config/env/development/database.ts)
3. Docker setup includes:
  - Strapi app (port 1337)
  - Postgres DB (port 5432)
  - Adminer DB admin (port 9090)

## Architecture

Strapi 5 CMS - Headless CMS with TypeScript

### API Structure

All APIs follow Strapi's MVC pattern in `src/api/{entity}/`:
- `controllers/` - Request handlers (use `factories.createCoreController`)
- `services/` - Business logic (use `factories.createCoreService`)
- `routes/` - Route definitions
- `content-types/{entity}/schema.json` - Content type schema

Content types:
- `post` - Blog posts with title, description, content, slug, tags relation
- `tag` - Tags with title, color
- `about` - Single-type about page
- `contact` - Single-type contact page

### Database

Multi-database support in `config/database.ts` (mysql, postgres, sqlite). Development defaults to Postgres via env override.

### Bootstrap Logic (src/index.ts)

- `register()` - Forces socket encryption for proxy setups
- `bootstrap()` - Empty, no auto-seeding

### Database Seeding (src/seed.ts)

On-demand seeding via `./scripts.sh` option 5 or `docker exec personal-site-strapi yarn seed`. Creates randomized tags, posts, about, contact - no duplicate checks, appends fresh data each run.

### Configuration Files

- `config/database.ts` - Multi-DB config with connection pooling
- `config/env/development/database.ts` - Dev-specific overrides
- `config/server.ts` - Server config
- `config/admin.ts` - Admin panel config
- `config/middlewares.ts` - Middleware stack

## Development Notes

- TypeScript compilation outputs to `dist/`
- Uses Strapi Documents API (`strapi.documents()`) not legacy entity service
- Dev DB auto-populates on first run (see src/index.ts:populateDatabase)
