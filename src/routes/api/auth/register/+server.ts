import { json, type RequestHandler } from '@sveltejs/kit';
import { createUser, getUserByUsername, hashPassword, createSession } from '$lib/server/db/actions';

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { username, password } = await request.json();

    if (!username || !password) {
        return json({ error: 'Username and password are required' }, { status: 400 });
    }

    if (username.length < 3 || password.length < 6) {
         return json({ error: 'Username must be at least 3 characters and password at least 6 characters' }, { status: 400 });
    }

    const existingUser = getUserByUsername(username);
    if (existingUser) {
        return json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const user = createUser(username, hashedPassword);
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
