import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';
import { QueryClient } from '@tanstack/svelte-query';
import { tasksStore } from '$lib/store';

export const load = (async ({fetch}) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
	

	let taskData = await queryClient.fetchQuery({
		queryKey: ['tasks'], queryFn: async () => {
			let data = await (await fetch("/api/tasks")).json();
			data.map((task: any) => {
				
				task.dueDate = task.dueDate ? new Date(task.dueDate) : new Date();
				return task;
			});
			tasksStore.set(data);
			return data;
		},
	});
	
	// queryClient.fetchQuery({queryKey :['taskStatus'], queryFn: async () => (await fetch("api/tasksStatus")).json()});
    return { queryClient};
}) satisfies LayoutLoad;