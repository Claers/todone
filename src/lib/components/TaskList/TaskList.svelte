<script lang="ts" context="module">
	export interface TaskListProps {}
</script>

<script lang="ts">
	import './TaskList.scss';
	import { useQueryClient } from '@tanstack/svelte-query';
	import Task, { TaskStyle, type TaskProps } from '$lib/components/Task/Task.svelte';
	import { draggedTaskStore } from '$lib/store';
	import { DragPlaceholderPlace } from '../Draggable/Draggable.svelte';
	import { editTask, editTaskBatch } from '$lib/tasks';
	import { flip } from 'svelte/animate';
	import CreateNewTask from '../CreateNewTask/CreateNewTask.svelte';
	// Get QueryClient from the context
	const queryClient = useQueryClient();

	// let tasks: TaskProps[] | undefined = [];

	// $: tasks = $tasksStore?.sort((taskA, taskB) => {
	// 	return taskA.order - taskB.order;
	// });

	// tasksStore.subscribe((data) => {
	// 	console.log(data);
	// 	tasks = data?.sort((taskA, taskB) => {
	// 		return taskA.order - taskB.order;
	// 	});
	// 	reconstructOrder();
	// });
	// $: console.log(tasks);

	export let tasks: TaskProps[] = [];
	$: tasks = tasks.sort((taskA, taskB) => {
		return taskA.order - taskB.order;
	});
	function onDragEnd() {
		if (draggedTaskStore) {
			let draggedElement = $draggedTaskStore.dragged;
			let endElement = $draggedTaskStore.end;
			let endPosition = $draggedTaskStore.endPosition;
			if (draggedElement == endElement) return;
			if (draggedElement && endElement && endPosition) {
				if (draggedElement && endElement) {
					moveTaskTo(draggedElement, endElement, endPosition.pos, tasks);
					reconstructOrder();
				}
			}
			draggedTaskStore.set({
				dragged: undefined,
				end: undefined,
				endPosition: undefined
			});
			editTaskBatch(
				tasks?.map((task) => {
					return {
						id: task.id,
						order: task.order
					} as TaskProps;
				}),
				queryClient
			).then(() => {
				queryClient.refetchQueries('tasks');
			});
		}
	}

	function moveTaskTo(
		task: TaskProps,
		endTask: TaskProps,
		position: DragPlaceholderPlace,
		tasks: TaskProps[]
	) {
		let oldIndex = tasks.indexOf(task);
		let newIndex = tasks.indexOf(endTask);
		if (oldIndex === -1 || newIndex === -1) return;
		if (oldIndex === newIndex) return;
		let oldTask = tasks[oldIndex];
		tasks.splice(oldIndex, 1);
		// Move the task before or after the end task depending on the position
		if (position === DragPlaceholderPlace.Before) {
			if (newIndex === 0) {
				tasks.splice(newIndex, 0, oldTask);
			} else {
				tasks.splice(newIndex - 1, 0, oldTask);
			}
		} else {
			tasks.splice(newIndex, 0, oldTask);
		}
	}

	function reconstructOrder() {
		let order = 1;
		tasks?.forEach((task) => {
			task.order = order;
			order++;
		});
	}

	let size: number | null;
	const dragDuration = 300;
</script>

<svelte:window bind:innerWidth={size} />

<!-- {#if size}
	{#if size > 1024}
		<TaskListFull bind:tasks on:onDragEnd={onDragEnd} />
	{:else if size > 768}
		<TaskListCompact bind:tasks on:onDragEnd={onDragEnd} />
	{:else}
		<TaskListMini bind:tasks on:onDragEnd={onDragEnd} />
	{/if}
{/if} -->
<div class="flex flex-col divide-y-2 md:flex-wrap md:flex-row md:divide-y-0 md:gap-2">
	{#await tasks}
		<div class="flex justify-center items-center">
			<div class="animate-spin rounded-full h-32 w-32 border-b-2" />
		</div>
	{:then}
		{#if tasks}
			{#each tasks as task (task.id)}
				<div
					animate:flip={{ duration: dragDuration }}
					class="border-dashed border-surface-500 md:border-none"
				>
					<Task {task} on:onDragEnd />
				</div>
			{/each}
		{/if}
		<CreateNewTask />
	{/await}
</div>
