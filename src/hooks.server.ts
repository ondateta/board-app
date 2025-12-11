import { type Handle } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('session');

	if (!sessionToken) {
		event.locals.user = null;
		return resolve(event);
	}

	const session = await prisma.session.findUnique({
		where: { id: sessionToken },
		include: { user: true }
	});

	if (session && session.expiresAt > new Date()) {
		event.locals.user = {
			id: session.user.id,
			email: session.user.email,
			name: session.user.name
		};
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};
