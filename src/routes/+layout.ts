import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';
import { QueryClient } from '@tanstack/svelte-query';

export const load = (async ({fetch}) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
    return { queryClient };
}) satisfies LayoutLoad;