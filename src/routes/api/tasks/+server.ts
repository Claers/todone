import type { RequestHandler } from './$types';
import type { Actions } from '@sveltejs/kit';
import { fail, json } from '@sveltejs/kit';
import db from "$lib/server/database";

export const GET: RequestHandler = async () => {
    const taskStatus = await db.task.findMany();
    return json(taskStatus);
};


export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    const id = data.id;
    delete data.id
    // Check if there the done status is set to true
    if (data.done) {
        // Set the status to the first isDoneStatus
        const isDoneStatus = await db.taskStatus.findFirst({
            where: { isDoneStatus: true },
        });
        if (!isDoneStatus) {
            return new Response(
                JSON.stringify({
                    error: 'No isDoneStatus found',
                }),
                {
                    status: 400,
                });
        }
        data.taskStatusId = isDoneStatus.id;
    }
    const task = await db.task.update({
        where: { id: Number(id) },
        data: data,
    });
    return json(task);
};
