import type { PageLoad } from './$types';


export const load = (async ({ parent, fetch }) => {
    // const response = fetch("api/tasks");
    const { queryClient } = await parent()

	queryClient.prefetchQuery({queryKey :['tasks'], queryFn: () => fetch("api/tasks")});
	queryClient.prefetchQuery({queryKey :['taskStatus'], queryFn: () => fetch("api/tasksStatus")});
	// await queryClient.prefetchQuery({queryKey :['tasks'], queryFn: () => fetch("api/tasks")});
    // return { response }
}) satisfies PageLoad;