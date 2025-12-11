import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { prisma } from '$lib/server/db';
import { hashPassword } from '$lib/server/auth';

const registerSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters')
});

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = Object.fromEntries(await request.formData());
		const parseResult = registerSchema.safeParse(formData);

		if (!parseResult.success) {
			const { fieldErrors: errors } = parseResult.error.flatten();
			return fail(400, {
				data: formData,
				errors
			});
		}

		const { name, email, password } = parseResult.data;

		const existingUser = await prisma.user.findUnique({
			where: { email }
		});

		if (existingUser) {
			return fail(400, {
				data: formData,
				errors: { email: ['Email already registered'] }
			});
		}

		const passwordHash = await hashPassword(password);

		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: passwordHash
			}
		});

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
