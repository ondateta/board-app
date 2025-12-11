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
