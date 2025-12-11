import type { PageServerLoad, Actions } from './$types';
import { getBoards, createBoard } from '$lib/server/db/actions';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/');
    }

    const boards = getBoards(locals.user.id);
    return {
        boards
    };
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (!locals.user) {
            throw redirect(302, '/');
        }

        const data = await request.formData();
        const title = data.get('title');

        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return fail(400, { title, missing: true });
        }

        try {
            createBoard(locals.user.id, title);
            return { success: true };
        } catch (error) {
            return fail(500, { message: 'Could not create board' });
        }
    }
};