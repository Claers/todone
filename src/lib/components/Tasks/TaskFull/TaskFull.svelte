<script lang="ts" context="module">
	export interface TaskFullProps {}
</script>

<script lang="ts">
	import Draggable from '$lib/components/Draggable/Draggable.svelte';
	import { draggedTaskStore } from '$lib/store';
	import DateToText from '$lib/components/DateToText/DateToText.svelte';
	import type { ModalSettings, PopupSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import type { TaskProps } from '$lib/components/Task/Task.svelte';
	import { setTaskDone, deleteTask } from '$lib/tasks';
	import { useQueryClient } from '@tanstack/svelte-query';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
	let queryClient = useQueryClient();
	export let task: TaskProps;

	let contextMenu;
	onMount(async () => {
		contextMenu = document.querySelector(`[data-popup="popupContext-${task.id}"]`);
	});

	function isMouseInRangeOfElement(
		element: HTMLElement,
		pos: { x: number; y: number },
		radius: number
	) {
		const rect = element.getBoundingClientRect();
		// Calc a circle around the element
		const range = {
			x: {
				min: rect.left - radius,
				max: rect.right + radius
			},
			y: {
				min: rect.top - radius,
				max: rect.bottom + radius
			}
		};
		// If the mouse is in the circle
		if (
			pos.x >= range.x.min &&
			pos.x <= range.x.max &&
			pos.y >= range.y.min &&
			pos.y <= range.y.max
		) {
			return true;
		}
		return false;
	}

	function disableContextMenu(event: MouseEvent) {
		// If the popup is visible
		if (contextMenu.style.display === 'flex') {
			// If the mouse go a bit to far from the popup
			if (!isMouseInRangeOfElement(contextMenu, { x: event.clientX, y: event.clientY }, 50)) {
				// Hide the popup
				contextMenu.style.display = 'none';
				contextMenu.style.opacity = '0';
				contextMenu.style.pointerEvents = 'none';
			}
		}
	}

	function forceDisableContextMenu() {
		// If the mouse go a bit to far from the popup
		// Hide the popup
		contextMenu.style.display = 'none';
		contextMenu.style.opacity = '0';
		contextMenu.style.pointerEvents = 'none';
	}

	function onDeleteTask() {
		forceDisableContextMenu();
		deleteTask(task, queryClient);
	}
</script>

<svelte:window on:mousemove={disableContextMenu} />

<div
	class="flex flex-col shadow-lg !bg-surface-500 rounded-md overflow-hidden"
	data-popup={`popupContext-${task.id}`}
	style="display: none; opacity: 0; pointer-events: none; z-index: 9999;"
>
	<a class="btn rounded-none p-2 variant-filled-primary" href={`/tasks/${task.id}`}
		><Fa class="mr-2" icon={faEdit} />Editer</a
	>
	<hr />
	<button class="btn rounded-none p-2 bg-error-500" on:click={onDeleteTask}
		><Fa class="mr-2" icon={faTrash} />Supprimer</button
	>
</div>

<Draggable
	class="flex card card-hover h-52 p-3 max-w-[20rem] min-w-[20rem] draggable bg-surface-800"
	card={task}
	on:onDragEnd
	bind:draggedElement={$draggedTaskStore.dragged}
	bind:endCard={$draggedTaskStore.end}
	bind:endPosition={$draggedTaskStore.endPosition}
>
	<a
		class="flex flex-col w-full h-full"
		href={`/tasks/${task.id}`}
		on:contextmenu|preventDefault={() => {
			// Get the data popup
			// const popup = document.querySelector(`[data-popup="popupContext-${task.id}"]`);
			// Set the popup position to the mouse position
			contextMenu.style.top = `${event.clientY}px`;
			contextMenu.style.left = `${event.clientX}px`;
			// Show the popup
			contextMenu.style.display = 'flex';
			contextMenu.style.opacity = '1';
			contextMenu.style.pointerEvents = 'all';
		}}
	>
		<div class="w-full h-[9rem] overflow-hidden">
			<header class="card-header w-full flex justify-between">
				<b class="whitespace-pre-wrap">{task.title}</b>
				<b class="text-sm whitespace-nowrap"
					><DateToText
						startDate={new Date()}
						endDate={task.dueDate ? task.dueDate : new Date()}
					/></b
				>
			</header>
			<section class="p-4 w-full overflow-hidden overflow-ellipsis h-[5.5rem]">
				{task.description}
			</section>
			<footer class="card-footer">
				<div class="flex justify-between">
					<div class="flex" />
					<!-- <div class="flex gap-2">
							<button class="btn hover:variant-filled-success btn-sm">Edit</button>
							<button class="btn variant-filled-error btn-sm">Delete</button>
						</div> -->
				</div>
			</footer>
		</div>
		<hr />
		<div class="mt-3 w-full inline-block">
			<button
				class="flex gap-2 w-full items-center justify-center"
				on:click|preventDefault={() => {
					setTaskDone(task, !task.done, queryClient);
				}}
			>
				<input class="checkbox border-2" type="checkbox" checked={task.done} />
				<p>Marquer comme terminé</p></button
			>
		</div>
	</a>
</Draggable>
