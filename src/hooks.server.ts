import type { Handle } from '@sveltejs/kit';
import { getSession } from '$lib/server/db/actions';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionId = event.cookies.get('session_id');

    if (!sessionId) {
        event.locals.user = null;
        event.locals.session = null;
        return resolve(event);
    }

    const session = getSession(sessionId);

    if (session) {
        event.locals.session = {
            id: session.id,
            expires_at: session.expires_at
        };
        event.locals.user = {
            id: session.user_id,
            username: session.username
        };
    } else {
        event.locals.user = null;
        event.locals.session = null;
    }

    return resolve(event);
};
