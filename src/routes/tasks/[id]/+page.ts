import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
    return {task_id: params.id};
}) satisfies PageLoad;