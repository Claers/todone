import type { PageServerLoad } from './$types';
import { fail, error, json, type Actions } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import db from '$lib/server/database';
import { createJWT } from '$lib/server/user';
import { randomUUID } from 'crypto';

export const actions: Actions = {
    create: async ({ request, cookies }) => {
        // Check if the user does not exist
        const formData = await request.formData();
        const username = formData.get('username');
        const password = formData.get('password');
        // console.log("Create", username, password)
        if (!username) {
            return fail(400, { username, missing: true })
        }
        if (!password) {
            return fail(400, { password, missing: true })
        }
        const user = await db.user.findUnique({
            where: { username: username as string }
        });
        if (user) {
            return fail(400, { username, invalid: true })
        }
        // Create the user
        const newUser = await db.user.create({
            data: {
                username: username as string,
                password: await bcrypt.hash(password as string, await bcrypt.genSalt(10))
            }
        });
        // Create a new refresh token
        const refresh_token = randomUUID();
        newUser.refreshToken = refresh_token;
        const jwtToken = createJWT(newUser);
        cookies.set('refresh_token', refresh_token, { path: '/', secure: false });
        cookies.set('jwt', jwtToken, { path: '/', secure: false });
        return new Response();
    },

    login: async ({ request, cookies }) => {
        const formData = await request.formData();
        const username = formData.get('username');
        const password = formData.get('password');
        // console.log("Login", username, password)
        if (!username) {
            return fail(400, { username, missing: true })
        }
        if (!password) {
            return fail(400, { password, missing: true })
        }
        const user = await db.user.findUnique({
            where: { username: username as string }
        });
        if (!user) {
            return fail(400, 'Invalid username')
        }
        const authenticated = await bcrypt.compare(password, user.password);
        if (!authenticated) {
            return fail(400, 'Invalid password')
        }
        // console.log("User authenticated");
        // Create a new refresh token
        const refresh_token = randomUUID();
        user.refreshToken = refresh_token;
        const jwtToken = createJWT(user);
        cookies.set('refresh_token', refresh_token, { path: '/', secure: false });
        cookies.set('jwt', jwtToken, { path: '/', secure: false });
        return { message: "User authenticated" };
    },
}