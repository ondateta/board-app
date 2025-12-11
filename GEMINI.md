# Project: Trello Clone (Bun Edition)

## Overview
A full-stack Kanban application built with **SvelteKit**, **Bun**, and **SQLite**.

## Tech Stack
-   **Runtime:** Bun
-   **Framework:** SvelteKit (Vite)
-   **Database:** SQLite (via `better-sqlite3` for both app and migrations)
-   **ORM:** Drizzle ORM
-   **Auth:** Lucia Auth
-   **Styling:** TailwindCSS

## Changelog
-   **2025-12-11:** Upgraded `drizzle-orm` and `drizzle-kit` to latest versions, and updated `drizzle.config.ts` to use `dialect: 'sqlite'`.
-   **2025-12-11:** Switched from `bun:sqlite` to `better-sqlite3` for app runtime to resolve Vite SSR compatibility issues.
-   **2025-12-11:** Restarted project with "Bun Edition" plan to fix `better-sqlite3` build issues.
    -   Defined strict Multi-Agent Workflow.
    -   Created Architecture Document `code/.teta/brainstorming/trello_architecture_bun.md`.
    -   Configured Drizzle to use `bun-sqlite` driver at runtime.
    -   Successfully installed dependencies using `bun install`.
    -   Added `.gitignore` for standard SvelteKit project.
    -   Created initial directory structure (`src/routes`, `src/lib`, etc.) and base files (`app.html`, `app.css`, `+layout.svelte`).
    -   Set up database schema with Drizzle and Lucia.
    -   Installed `better-sqlite3` as dev dependency for `drizzle-kit` compatibility.
    -   Successfully synchronized database using `bun run db:push`.
    -   Implemented Authentication with Lucia (Register, Login, Hooks).
    -   Created Auth Routes: `/register` and `/login`.

## Status
-   **Phase 1 (Foundation):** Completed
-   **Phase 2 (Database):** Completed
-   **Phase 3 (Frontend):** In Progress