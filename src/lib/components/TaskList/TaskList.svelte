<script lang="ts" context="module">
	export interface TaskListProps {}
</script>

<script lang="ts">
	import './TaskList.scss';
	import TaskListFull from '$lib/components/TaskLists/TaskListFull/TaskListFull.svelte';
	import TaskListCompact from '$lib/components/TaskLists/TaskListCompact/TaskListCompact.svelte';
	import TaskListMini from '$lib/components/TaskLists/TaskListMini/TaskListMini.svelte';
	import { tasksStore } from '$lib/store';
	import { useQueryClient } from '@tanstack/svelte-query';
	import type { TaskProps } from '$lib/components/Task/Task.svelte';
	import { onMount } from 'svelte';
	import { draggedTaskStore } from '$lib/store';
	import { DragPlaceholderPlace } from '../Draggable/Draggable.svelte';
	import { json } from '@sveltejs/kit';
	// Get QueryClient from the context
	const queryClient = useQueryClient();

	let tasks: TaskProps[] | undefined = [];

	// $: tasks = $tasksStore?.sort((taskA, taskB) => {
	// 	return taskA.order - taskB.order;
	// });

	tasksStore.subscribe((data) => {
		tasks = data?.sort((taskA, taskB) => {
			return taskA.order - taskB.order;
		});
		reconstructOrder();
	});
	$: console.log(tasks);
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
			fetch('/api/tasks', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(
					tasks?.map((task) => {
						return {
							id: task.id,
							order: task.order
						};
					})
				)
			});
			queryClient.invalidateQueries('tasks');
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
</script>

<svelte:window bind:innerWidth={size} />

{#if size}
	{#if size > 1024}
		<TaskListFull {tasks} on:onDragEnd={onDragEnd} />
	{:else if size > 768}
		<TaskListCompact {tasks} on:onDragEnd={onDragEnd} />
	{:else}
		<TaskListMini {tasks} on:onDragEnd={onDragEnd} />
	{/if}
{/if}
