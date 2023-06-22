import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import db from "$lib/server/database";

export const GET: RequestHandler = async () => {
    const tasks = await db.taskStatus.findMany();
    return json(tasks);
};


export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    const id = data.id;
    delete data.id
    const taskStatus = await db.taskStatus.update({
        where: { id: Number(id) },
        data: data,
    });
    return json(taskStatus);
};
