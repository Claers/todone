import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import db from "$lib/server/database";
import type { Task } from '@prisma/client';
import type { TaskProps } from '$lib/components/Task/Task.svelte';
import {getUserId} from '$lib/server/user';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    create: async ({ request, cookies }) => { 
        const userId = getUserId(cookies.get('jwt'));
        const formData: FormData = await request.formData();
        const title = formData.get('title');
        let fails = [];
        if (!title || title === '') {
            fails.push({fields: ["title"], missing: true, message: "Le titre est requis"})
            // return fail(400, {fields: ["title"], missing: true, message: "Le titre est requis"})
        }
        const dueDate = formData.get('dueDate');
        if (!dueDate || dueDate === '') {
            fails.push({fields: ["dueDate"], missing: true, message: "La date d'échéance est requise"})
            // return fail(400, { fields: ["dueDate"], missing: true, message: "La date d'échéance est requise" })
        }
        if (fails.length > 0) {
            return fail(400, fails)
        }
        // Find the next order number
        const order = await db.task.count()
        const taskData: Task = {
            title: title as string,
            description: formData.get('description') as string,
            done: formData.get('done') === 'true' ? true : false,
            dueDate: new Date(formData.get('dueDate') as string),
            order: order + 1,   
            userId: userId
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
           return fail(400, { id, missing: true})
        }
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
            return fail(400, { id, missing: true})
        }
        await db.task.delete({ where: { id: parseInt(id as string) } })
        return {
            body: {
                message: 'Task deleted'
            }
        }
    }
} satisfies Actions;
