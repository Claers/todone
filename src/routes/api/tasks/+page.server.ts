import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import db from "$lib/server/database";
import type { Task } from '@prisma/client';


export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    create: async ({ request }) => { 
        const formData = await request.formData();
        const name = formData.get('name');
        const description = formData.get('description');
        const markdownDescription = formData.get('markdownDescription');
        const status = formData.get('taskStatusId');
        if (!name) {
            fail(400, { name, missing: true})
        }
        if (!status) {
            fail(400, { status, missing: true})
        }
        const taskData: Task = {
            ...formData,
            title: name as string,
            description: description as string,
            markdownDescription: markdownDescription as string,
            taskStatusId: parseInt(status as string)

        }
        const task = await db.task.create({ data: taskData })
        return {
            body: {
                task
            }
        }
    },

    update: async ({ request, params }) => { 
        const formData = await request.formData();
        const id = formData.get('id');
        const name = formData.get('name');
        const description = formData.get('description');
        const status = formData.get('taskStatusId');
        if (!id) {
            fail(400, { id, missing: true})
        }
        console.log("id", id)
        console.log("description", description)

        // if (!name) {
        //     fail(400, { name, missing: true})
        // }
        const taskData: Task = {}
        if (name) {
            taskData.title = name as string
        }
        if (description) {
            taskData.description = description as string
        }
        if (status) {
            taskData.taskStatusId = parseInt(status as string)
        }
        const task = await db.task.update({ where: { id: parseInt(id as string) }, data: taskData })
        return {
            body: {
                task
            }
        }
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id');
        if (!id) {
            fail(400, { id, missing: true})
        }
        await db.task.delete({ where: { id: parseInt(id as string) } })
        return {
            body: {
                message: 'Task deleted'
            }
        }
    }
} satisfies Actions;
