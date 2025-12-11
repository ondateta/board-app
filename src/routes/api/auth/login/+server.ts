import { json, type RequestHandler } from '@sveltejs/kit';
import { getUserByUsername, verifyPassword, createSession } from '$lib/server/db/actions';

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { username, password } = await request.json();

    if (!username || !password) {
        return json({ error: 'Username and password are required' }, { status: 400 });
    }

    const user = getUserByUsername(username);
    if (!user) {
        return json({ error: 'Invalid username or password' }, { status: 400 });
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
        return json({ error: 'Invalid username or password' }, { status: 400 });
    }

    const session = createSession(user.id);

    cookies.set('session_id', session.id, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return json({ user: { id: user.id, username: user.username } });
};
