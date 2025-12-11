import { fail, redirect } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { lucia } from '$lib/server/auth';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (typeof username !== 'string' || typeof password !== 'string') {
			return fail(400, { message: 'Invalid input' });
		}

		try {
			const existingUser = await db.select().from(user).where(eq(user.username, username)).get();

			if (!existingUser) {
				return fail(400, { message: 'Incorrect username or password' });
			}

			const validPassword = await new Argon2id().verify(existingUser.password_hash, password);
			if (!validPassword) {
				return fail(400, { message: 'Incorrect username or password' });
			}

			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (e) {
            console.error(e);
			return fail(500, { message: 'An unknown error occurred' });
		}
		throw redirect(302, '/app');
	}
};
