import { lucia } from "$lib/server/auth";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		// Protect /app routes - Redirect unauthenticated users to login
		if (event.url.pathname.startsWith('/app')) {
			throw redirect(302, '/login');
		}
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	
	// Handle session cookie updates
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

	// Protect /app routes - Double check for valid user
	if (event.url.pathname.startsWith('/app') && !user) {
		throw redirect(302, '/login');
	}

	return resolve(event);
};