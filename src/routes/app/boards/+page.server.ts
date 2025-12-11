import { boardDAL } from '$lib/server/dal';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';

const createBoardSchema = z.object({
  title: z.string().min(1, 'Title is required')
});

export const load: PageServerLoad = async ({ locals }) => {
  const boards = await boardDAL.list(locals.user!.id);
  return { boards };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const formData = await request.formData();
    const title = formData.get('title') as string;

    const result = createBoardSchema.safeParse({ title });

    if (!result.success) {
      return fail(400, {
        data: { title },
        errors: result.error.flatten().fieldErrors
      });
    }

    try {
      await boardDAL.create(locals.user!.id, title);
      return { success: true };
    } catch (error) {
        console.error(error);
      return fail(500, { message: 'Failed to create board' });
    }
  }
};
