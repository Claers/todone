import type { LayoutServerLoad } from './$types';
import db from '$lib/server/database';
import type { Cookies } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { verifyJWT } from '$lib/server/user';
import { JWT_ACCESS_SECRET } from '$env/static/private';

const PRIVATE_ROUTES = [
    "/api/tasksStatus",
    "/api/tasks",
    "/",
    "/tasks/[id]"
]

const PUBLIC_ROUTES = [
    "/api/login",
    "/api/logout",
    "/login"
]


export const load = (async ({cookies, route}) => {
    // Load jwt from cookies
    const jwt = cookies.get('jwt');
    if (jwt) {
        try {
            const user = verifyJWT(jwt);
            return { "session": user };
        } catch {
            // Ignore
            
        }
    }
    if (!jwt) {
        if (PRIVATE_ROUTES.includes(route.id)) {
            throw redirect(307, "/login");
        }
        // Get the refresh token
        const refresh_token = cookies.get('refresh_token');
        if (refresh_token) {
            // Check if the refresh token is valid
            const user = await db.user.findUnique({
                where: { refreshToken: refresh_token }
            });
            if (user) {
            }
        }
    }
    if (PRIVATE_ROUTES.includes(route.id)) {
        throw redirect(307, "/login");
    }
    return { "session": undefined};
}) satisfies LayoutServerLoad;