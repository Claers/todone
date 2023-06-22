<script lang="ts" context="module">
	export interface TaskListProps {}
</script>

<script lang="ts">
	import './TaskList.scss';
	import TaskListFull from '$lib/components/TaskListFull/TaskListFull.svelte';
	import TaskListCompact from '$lib/components/TaskListCompact/TaskListCompact.svelte';
	import TaskListMini from '$lib/components/TaskListMini/TaskListMini.svelte';
	import { tasksStore } from '$lib/store';
	import { useQueryClient } from '@tanstack/svelte-query';
	import type { TaskProps } from '$lib/components/Task/Task.svelte';
	import { onMount } from 'svelte';
	// Get QueryClient from the context
	const queryClient = useQueryClient();

	let tasks: TaskProps[] | undefined = [];
	$: tasks = $tasksStore
		?.map((task) => {
			return {
				...task,
				order: task.order ? task.order : task.id
			};
		})
		.sort((taskA, taskB) => {
			return taskA.order - taskB.order;
		});
	let size: number | null;
	$: console.log(tasks);
</script>

<svelte:window bind:innerWidth={size} />

{#if size}
	{#if size > 1024}
		<TaskListFull {tasks} />
	{:else if size > 768}
		<TaskListCompact {tasks} />
	{:else}
		<TaskListMini {tasks} />
	{/if}
{/if}
