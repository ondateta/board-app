# Trello Clone Architecture (Bun Edition)

## 1. Project Configuration

### package.json
```json
{
  "name": "trello-bun",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  },
  "devDependencies": {
    "@sveltejs/adapter-auto": "^3.0.0",
    "@sveltejs/kit": "^2.0.0",
    "@sveltejs/vite-plugin-svelte": "^3.0.0",
    "@types/bun": "latest",
    "autoprefixer": "^10.4.16",
    "drizzle-kit": "^0.20.14",
    "postcss": "^8.4.32",
    "svelte": "^5.0.0-next.1",
    "svelte-check": "^3.6.0",
    "tailwindcss": "^3.3.6",
    "tslib": "^2.4.1",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  },
  "dependencies": {
    "drizzle-orm": "^0.29.3",
    "lucia": "^3.0.1",
    "@lucia-auth/adapter-drizzle": "^1.0.2",
    "oslo": "^1.1.3"
  },
  "type": "module"
}
```

### svelte.config.js
```javascript
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
        alias: {
            $lib: 'src/lib'
        }
	}
};

export default config;
```

### vite.config.ts
```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()]
});
```

### tsconfig.json
```json
{
	"extends": "./.svelte-kit/tsconfig.json",
	"compilerOptions": {
		"allowJs": true,
		"checkJs": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"resolveJsonModule": true,
		"skipLibCheck": true,
		"sourceMap": true,
		"strict": true,
		"moduleResolution": "bundler"
	}
}
```

### drizzle.config.ts
```typescript
import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	driver: 'better-sqlite', 
	dbCredentials: {
		url: 'sqlite.db'
	}
} satisfies Config;
```
*Note: We use 'better-sqlite' driver in config for compatibility with drizzle-kit, but 'bun:sqlite' in runtime.*

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 2. Directory Structure & Base Files

### Structure
```
code/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   └── server/
│   │       └── db/
│   └── routes/
```

### src/app.html
```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

### src/app.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### src/routes/+layout.svelte
```svelte
<script>
  import "../app.css";
  let { children } = $props();
</script>

<main class="min-h-screen bg-gray-50">
  {@render children()}
</main>
```

## 3. Backend & Database

### src/lib/server/db/schema.ts
```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    password_hash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id),
    expiresAt: integer('expires_at').notNull()
});

export const board = sqliteTable('board', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    userId: text('user_id').notNull().references(() => user.id),
    createdAt: integer('created_at').notNull()
});

export const list = sqliteTable('list', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    boardId: text('board_id').notNull().references(() => board.id),
    position: integer('position').notNull()
});

export const card = sqliteTable('card', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    listId: text('list_id').notNull().references(() => list.id),
    position: integer('position').notNull()
});
```

### src/lib/server/db/index.ts
```typescript
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from './schema';

const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite, { schema });
```

### src/lib/server/auth.ts
```typescript
import { Lucia } from "lucia";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "./db";
import { session, user } from "./db/schema";

const adapter = new DrizzleSQLiteAdapter(db, session, user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === "production"
		}
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username
		};
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	username: string;
}
```

## 4. Frontend & Auth Routes

### src/routes/register/+page.svelte
```svelte
<script>
    import { enhance } from '$app/forms';
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="p-8 bg-white rounded shadow-md w-96">
        <h1 class="mb-4 text-2xl font-bold text-center">Register</h1>
        <form method="POST" use:enhance class="flex flex-col gap-4">
            <input name="username" placeholder="Username" class="p-2 border rounded" required />
            <input type="password" name="password" placeholder="Password" class="p-2 border rounded" required />
            <button class="p-2 text-white bg-blue-500 rounded hover:bg-blue-600">Sign Up</button>
        </form>
        <p class="mt-4 text-center">Already have an account? <a href="/login" class="text-blue-500">Login</a></p>
    </div>
</div>
```

### src/routes/register/+page.server.ts
```typescript
import { fail, redirect } from '@sveltejs/kit';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { lucia } from '$lib/server/auth';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (typeof username !== 'string' || username.length < 3 || typeof password !== 'string' || password.length < 6) {
			return fail(400, { message: 'Invalid input' });
		}

		const hashedPassword = await new Argon2id().hash(password);
		const userId = generateId(15);

		try {
			await db.insert(user).values({
				id: userId,
				username: username,
				password_hash: hashedPassword
			});

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (e) {
			return fail(500, { message: 'An unknown error occurred' });
		}
		throw redirect(302, '/app');
	}
};
```

*(Login pages are similar but verify password)*

### src/hooks.server.ts
```typescript
import { lucia } from "$lib/server/auth";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
    if (event.url.pathname.startsWith('/app')) {
       throw redirect(302, '/login');
    }
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;

  if (event.url.pathname.startsWith('/app') && !user) {
      throw redirect(302, '/login');
  }

	return resolve(event);
};
```