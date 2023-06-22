import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import db from "$lib/server/database";
import { fail } from '@sveltejs/kit';
import type { TaskStatus } from '@prisma/client';


export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    create: async ({ request }) => { 
        const data = await request.formData();
        if (!data.get("name")) {
            return {
                status: 400,
                body: { message: "Name is required" },
            };
        }
        const taskStatusData: TaskStatus = {
            name: data.get("name") as string,
            isArchivedStatus: data.get("isArchivedStatus") === "on",
            isDefaultStatus: data.get("isDefaultStatus") === "on",
            isDoneStatus: data.get("isDoneStatus") === "on",
        }
        const taskStatus = await db.taskStatus.create({
            data: taskStatusData,
        });
        return {
            status: 201,
            body: taskStatus,
        };
    },
    
    update: async ({ request, params }) => {
        const data = await request.formData();
        const taskStatus = await db.taskStatus.update({
            where: { id: Number(params.id) },
            data: data,
        });
        return {
            status: 200,
            body: taskStatus,
        };
    
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id');
        if (!id) {
            fail(400, { id, missing: true})
        }
        await db.taskStatus.delete({ where: { id: parseInt(id as string) } })
        return {
            body: {
                message: 'Status deleted'
            }
        }
    }
};