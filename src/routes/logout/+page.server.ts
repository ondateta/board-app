import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { prisma } from '$lib/server/db';

export const actions: Actions = {
	default: async ({ cookies }) => {
		const sessionToken = cookies.get('session');

		if (sessionToken) {
			await prisma.session.delete({
				where: { id: sessionToken }
			}).catch(() => {
                // Ignore if session not found
            });
		}

		cookies.delete('session', { path: '/' });
		throw redirect(302, '/login');
	}
};
