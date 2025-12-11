import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { board } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const userBoards = await db.select().from(board).where(eq(board.userId, locals.user.id)).orderBy(desc(board.createdAt));

	return {
		boards: userBoards,
		user: locals.user
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401);
		}

		const formData = await request.formData();
		const title = formData.get('title');

		if (!title || typeof title !== 'string') {
			return fail(400, {
				message: 'Title is required'
			});
		}

		try {
			await db.insert(board).values({
				id: crypto.randomUUID(),
				title,
				userId: locals.user.id,
				createdAt: Date.now()
			});
		} catch (e) {
			console.error(e);
			return fail(500, {
				message: 'An error occurred while creating the board'
			});
		}

		return { success: true };
	}
};
