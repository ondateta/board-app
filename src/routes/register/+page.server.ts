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
            console.error(e);
			return fail(500, { message: 'An unknown error occurred' });
		}
		throw redirect(302, '/app');
	}
};
