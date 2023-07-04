import type { RequestHandler } from './$types';
import type { Actions } from '@sveltejs/kit';
import { fail, json } from '@sveltejs/kit';
import db from "$lib/server/database";
import type { TaskProps } from '$lib/components/Task/Task.svelte';
import {getUserId, verifyJWT} from '$lib/server/user';

export const GET: RequestHandler = async ({cookies}) => {
    const jwt = cookies.get('jwt');
    if (!jwt) {
        return json({message: "Unauthorized", status: 401});
    }
    if (!verifyJWT(jwt)) {
        return json({message: "Unauthorized", status: 401});
    }
    const userId = getUserId(cookies.get('jwt'));
    const tasks = await db.task.findMany({
        where: { userId: userId },
        orderBy: [{
            order: "asc",
        }]
    });
    return json(tasks);
};


export const POST: RequestHandler = async ({ request, cookies }) => {
    const data: TaskProps | TaskProps[] = await request.json();
    const id = data.id;
    delete data.id
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
