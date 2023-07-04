<script lang="ts" context="module">
	export interface TaskProps {
		id: number;
		title: string;
		description?: string;
		markdownDescription?: string;
		createdAt: Date;
		updatedAt: Date;
		done: boolean;
		dueDate?: Date;
		order?: number;
	}

	export enum TaskStyle {
		Full = 'full',
		Compact = 'compact',
		Mini = 'mini'
	}
</script>

<script lang="ts">
	import './Task.scss';
	import Draggable from '$lib/components/Draggable/Draggable.svelte';
	import { draggedTaskStore } from '$lib/store';
	import DateToText from '$lib/components/DateToText/DateToText.svelte';
	import { DragDirection } from '$lib/components/Draggable/Draggable.svelte';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
	import { deleteTask, setTaskDone } from '$lib/tasks';
	import { useQueryClient } from '@tanstack/svelte-query';

	export let style: TaskStyle = TaskStyle.Full;
	let contextMenu;
	export let task: TaskProps;
	const queryClient = useQueryClient();

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

<!-- {#if style === TaskStyle.Full}
	<TaskFull bind:task on:onDragEnd />
{:else if style === TaskStyle.Compact}
	<TaskCompact bind:task on:onDragEnd />
{:else if style === TaskStyle.Mini}
	<TaskMini bind:task on:onDragEnd />
{/if} -->
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
	card={task}
	on:onDragEnd
	bind:draggedElement={$draggedTaskStore.dragged}
	bind:endCard={$draggedTaskStore.end}
	bind:endPosition={$draggedTaskStore.endPosition}
	class="card-hover text-sm p-2 draggable bg-surface-800 md:flex md:card md:h-52 md:text-base md:p-3 md:min-w-[20rem] md:max-w-[20rem] md:text-base"
	dragDirection={window.screenX < 768 ? DragDirection.Vertical : DragDirection.Horizontal}
>
	<a
		class="flex md:max-w-[22rem] h-full divide-x-2 md:divide-x-0 md:w-full md:h-full md:flex-col"
		href={`/tasks/${task.id}`}
		on:contextmenu|preventDefault={(event) => {
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
		<div class="flex w-1/12 items-center justify-center m-2 md:hidden">
			<input class="checkbox border-2" type="checkbox" checked={task.done} />
		</div>
		<div
			class="w-10/12 border-surface-500 overflow-hidden h-full md:w-full md:h-[9rem] md:border-none"
		>
			<header
				class="flex justify-between h-full my-2 ml-2 gap-2 md:m-0 md:gap-0 md:card-header md:h-auto"
			>
				<b class="md:whitespace-pre-wrap">{task.title}</b>
				<b class="whitespace-nowrap"
					><DateToText
						startDate={new Date()}
						endDate={task.dueDate ? task.dueDate : new Date()}
					/></b
				>
			</header>
			{#if task.description}
				<section
					class="p-4 text-xs overflow-hidden overflow-ellipsis md:text-base md:w-full md:h-[5.5rem]"
				>
					{task.description}
				</section>
			{/if}
		</div>
		<hr class="hidden md:inline-block" />
		<div class="mt-3 w-full hidden md:inline-block">
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
