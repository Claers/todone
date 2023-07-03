import type { RequestHandler } from './$types';
import type { Actions } from '@sveltejs/kit';
import { fail, json } from '@sveltejs/kit';
import db from "$lib/server/database";
import type { TaskProps } from '$lib/components/Task/Task.svelte';

export const GET: RequestHandler = async () => {
    const tasks = await db.task.findMany({
        orderBy: [{
            order: "asc",
        }]
    });
    return json(tasks);
};


export const POST: RequestHandler = async ({ request }) => {
    const data: TaskProps | TaskProps[] = await request.json();
    const id = data.id;
    delete data.id
    console.log(data);
    if (data.delete) {
        const deletedData = await db.task.delete({
            where: { id: id },
        });
        return json({
            message: "Task deleted",
        });
    }
    let updatedData;
    if (!id) {
        updatedData = [];
        for (const task of data as TaskProps[]) {
            updatedData.push(await db.task.update({
                where: { id: task.id },
                data: task,
            }));
        }
        
    } else {
        updatedData = await db.task.update({
            where: { id: id },
            data: data,
        });
    }
    return json(updatedData);
};
