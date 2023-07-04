import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({cookies}) => {
    // console.log("Logout")
    cookies.set('refresh_token', '', { path: '/', secure: false });
    cookies.set('jwt', '', { path: '/', secure: false });
    return new Response();
};