import type { RequestHandler } from './$types';
import type { Actions } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import db from "$lib/server/database";

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    const id = data.id;
    const taskStatusId = data.taskStatusId;
    const task = await db.task.update({
        where: { id: Number(id) },
        data: { taskStatusId: Number(taskStatusId) },
    });
    
    return json(task);
};
