import { json, type RequestHandler } from '@sveltejs/kit';
import { deleteSession } from '$lib/server/db/actions';

export const POST: RequestHandler = async ({ cookies }) => {
    const sessionId = cookies.get('session_id');

    if (sessionId) {
        deleteSession(sessionId);
        cookies.delete('session_id', { path: '/' });
    }

    return json({ success: true });
};
