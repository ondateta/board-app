# Project: Trello Clone (Bun Edition)

## Overview
A full-stack Kanban application built with **SvelteKit**, **Bun**, and **SQLite**.

## Tech Stack
-   **Runtime:** Bun
-   **Framework:** SvelteKit (Vite)
-   **Database:** SQLite (via `bun:sqlite`)
-   **ORM:** Drizzle ORM
-   **Auth:** Lucia Auth
-   **Styling:** TailwindCSS

## Changelog
-   **2025-12-11:** Restarted project with "Bun Edition" plan to fix `better-sqlite3` build issues.
    -   Defined strict Multi-Agent Workflow.
    -   Created Architecture Document `code/.teta/brainstorming/trello_architecture_bun.md`.
    -   Configured Drizzle to use `bun-sqlite` driver at runtime.
    -   Successfully installed dependencies using `bun install`.
    -   Added `.gitignore` for standard SvelteKit project.

## Status
-   **Phase 1 (Foundation):** In Progress
-   **Phase 2 (Database):** Pending
-   **Phase 3 (Frontend):** Pending
