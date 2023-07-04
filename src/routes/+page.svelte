<script lang="ts">
	// import TaskList from '$lib/components/TaskList/TaskList.svelte';
	// import TaskStatusList from '$lib/components/TaskStatusList/TaskStatusList.svelte';
	import { tasksStore, setStore, pageStatusStore, breadcrumbsStore } from '$lib/store';
	import { createQuery, type CreateQueryResult } from '@tanstack/svelte-query';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import TaskList from '$lib/components/TaskList/TaskList.svelte';
	import { Pages, addPathToBreadcrumbs } from '$lib/breadcrums';
	import type { TaskProps } from '$lib/components/Task/Task.svelte';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faSearch } from '@fortawesome/free-solid-svg-icons';
	// const tasksQuery = createQuery({
	// 	queryKey: ['tasks'],
	// 	queryFn: async () => (await fetch('api/tasks')).json()
	// });
	let filter: string = 'todo';
	// $: if ($tasksQuery) setStore(tasksStore, $tasksQuery);
	let filteredTasks: TaskProps[] = [];
	let search = '';
	tasksStore.subscribe(async (value) => {
		if (!value) return;
		let data = await value;
		filteredTasks = filterTask(data);
		// setStore(tasksStore, filteredTasks);
	});
	function filterTask(tasks: TaskProps[]) {
		if (!tasks) return [];
		let filteredTasks = tasks;
		// If search is not empty, filter tasks
		if (search) {
			// console.log('search');
			// console.log(search.toLowerCase());
			filteredTasks = tasks.filter((task) =>
				task.title.toLowerCase().includes(search.toLowerCase())
			);
		}
		switch (filter) {
			case 'todo':
				return filteredTasks.filter((task) => !task.done);
			case 'all':
				return filteredTasks;
			case 'done':
				return filteredTasks.filter((task) => task.done);
			default:
				return filteredTasks;
		}
	}

	function filterActualTasks() {
		filteredTasks = filterTask($tasksStore);
		// setStore(tasksStore, filteredTasks);
	}

	let pageStatus: string = 'tasks';
	pageStatusStore.subscribe((value) => {
		if (!value) value = 'tasks';
		pageStatus = value;
	});
	// pageStatusStore.set('tasks');

	function ChangePageStatus(status: string) {
		pageStatusStore.set(status);
	}

	addPathToBreadcrumbs('Acceuil', '/', Pages.HOME, $breadcrumbsStore);
</script>

<div class="container p-4 sm:p-6 lg:p-10 space-y-4 w-full md:max-w-[1024px] lg:max-w-none">
	<!-- Buttons for filters -->
	<div class="flex gap-2 flex-wrap">
		<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
			<RadioItem bind:group={filter} name="filter" value="todo" on:change={filterActualTasks}
				>Todo</RadioItem
			>
			<RadioItem bind:group={filter} name="filter" value="done" on:change={filterActualTasks}
				>Done</RadioItem
			>
			<RadioItem bind:group={filter} name="filter" value="all" on:change={filterActualTasks}
				>All</RadioItem
			>
		</RadioGroup>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] max-w-[40rem]">
			<div class="input-group-shim"><Fa icon={faSearch} /></div>
			<input
				class="!bg-surface-800"
				type="search"
				placeholder="Search..."
				bind:value={search}
				on:change={filterActualTasks}
				on:keyup={filterActualTasks}
			/>
		</div>
	</div>
	<TaskList bind:tasks={filteredTasks} />
</div>
