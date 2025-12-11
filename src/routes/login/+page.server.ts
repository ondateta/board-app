import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { prisma } from '$lib/server/db';
import { comparePassword } from '$lib/server/auth';

const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required')
});

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = Object.fromEntries(await request.formData());
		const parseResult = loginSchema.safeParse(formData);

		if (!parseResult.success) {
			const { fieldErrors: errors } = parseResult.error.flatten();
			return fail(400, {
				data: formData,
				errors
			});
		}

		const { email, password } = parseResult.data;

		const user = await prisma.user.findUnique({
			where: { email }
		});

		if (!user) {
			return fail(400, {
				data: formData,
				errors: { form: ['Invalid email or password'] }
			});
		}

		const passwordMatch = await comparePassword(password, user.password);

		if (!passwordMatch) {
			return fail(400, {
				data: formData,
				errors: { form: ['Invalid email or password'] }
			});
		}

		const session = await prisma.session.create({
			data: {
				userId: user.id,
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
			}
		});

		cookies.set('session', session.id, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});

		throw redirect(302, '/');
	}
};
