# Project: Trellone (Trello Clone)

## Tech Stack
- **Framework**: SvelteKit
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4)
- **Database**: SQLite (via Prisma)
- **ORM**: Prisma
- **Runtime**: Bun (for dev/build)

## Architecture
- **Frontend**: Svelte 5 Runes for state management.
- **Backend**: SvelteKit Actions & Load functions.
- **DAL**: Encapsulated in `src/lib/server/dal`.

## Commands
- `bun run dev`: Start development server.
- `bun run build`: Build for production.
- `bun x prisma db push`: Sync database schema.
- `bun x prisma generate`: Generate Prisma client.

## Workflow Status
- **Configuration**: Vite and Tailwind CSS v4 configured.
- **Database**: Prisma installed. Initialization pending schema definition.
- **UI**: Foundation laid (Tailwind configured).