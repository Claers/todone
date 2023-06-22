<script lang="ts">
	// import TaskList from '$lib/components/TaskList/TaskList.svelte';
	// import TaskStatusList from '$lib/components/TaskStatusList/TaskStatusList.svelte';
	import { tasksStore, setStore, pageStatusStore } from '$lib/store';
	import { createQuery, type CreateQueryResult } from '@tanstack/svelte-query';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import TaskList from '$lib/components/TaskList/TaskList.svelte';

	const tasksQuery = createQuery({ queryKey: ['tasks'], queryFn: () => fetch('api/tasks') });
	$: if ($tasksQuery.data) setStore(tasksStore, $tasksQuery.data);

	// const taskStatusQuery = createQuery({
	// 	queryKey: ['taskStatus'],
	// 	queryFn: () => fetch('api/tasksStatus')
	// });
	// $: if ($taskStatusQuery.data) setStore(tasksStatusStore, $taskStatusQuery.data);

	let pageStatus: string = 'tasks';
	pageStatusStore.subscribe((value) => {
		if (!value) value = 'tasks';
		pageStatus = value;
	});
	// pageStatusStore.set('tasks');

	function ChangePageStatus(status: string) {
		pageStatusStore.set(status);
	}

	let filter: string = 'all';

	// $: $tasksQuery?.data?.json().then((data) => (tasksData = data));
	// $: tasksStore.set(tasksData);
</script>

<!-- <Drawer>
	{#if $drawerStore.meta?.type === Drawers.CreateTaskStatus}
		<CreateTaskStatus />
	{/if}
</Drawer> -->
<!-- 
<div class="flex flex-col w-full h-full items-center">
	<div class="flex items-center justify-center w-full h-fit m-4 p-4 gap-8 text-blue-500">
		<button
			class={pageStatus === 'tasks' ? 'text-green-500' : ''}
			on:click|stopPropagation={() => {
				ChangePageStatus('tasks');
			}}
		>
			<h2 class="h2">Tasks</h2>
		</button>
		<h2 class="h2">-</h2>
		<button
			class={pageStatus === 'taskStatus' ? 'text-green-500' : ''}
			on:click|stopPropagation={() => {
				ChangePageStatus('taskStatus');
			}}
		>
			<h2 class="h2">Tasks Status</h2>
		</button>
	</div>
	{#if pageStatus === 'tasks'}
		<TaskList />
	{:else if pageStatus === 'taskStatus'}
		<TaskStatusList />
	{/if}
</div> -->
<div class="container p-10 space-y-4 w-full max-w-full">
	<!-- Buttons for filters -->
	<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
		<RadioItem bind:group={filter} name="filter" value="all">All</RadioItem>
		<RadioItem bind:group={filter} name="filter" value="done">Done</RadioItem>
		<RadioItem bind:group={filter} name="filter" value="undone">Undone</RadioItem>
	</RadioGroup>
	<hr />
	<TaskList />
</div>
