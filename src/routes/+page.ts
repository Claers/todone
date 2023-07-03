import type { PageLoad } from './$types';


export const load = (async ({ parent, fetch }) => {
    // const response = fetch("api/tasks");
    // const { queryClient } = await parent()
	// await queryClient.prefetchQuery({queryKey :['tasks'], queryFn: () => fetch("api/tasks")});
    // return { response }
}) satisfies PageLoad;