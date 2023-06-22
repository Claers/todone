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
	import DateToText from '$lib/components/DateToText/DateToText.svelte';
	import './Task.scss';
	import Draggable from '$lib/components/Draggable/Draggable.svelte';
	import { tasksStore } from '$lib/store';
	import type { Updater } from 'svelte/store';
	import { draggedTaskStore } from '$lib/store';

	export let style: TaskStyle = TaskStyle.Full;
	export let task: TaskProps;
	function swapToDragged(draggedElement: TaskProps, endCard: TaskProps) {
		let newOrder = endCard.order;
		let oldOrder = draggedElement.order;
		tasksStore.update((tasks) => {
			tasks?.map((task) => {
				task.order = task.id == draggedElement.id ? newOrder : task.order;
				task.order = task.id == endCard.id ? oldOrder : task.order;
			});
			return tasks;
		});
	}

</script>

{#if style === TaskStyle.Full}
	<Draggable
		class="block card card-hover w-80 h-52 p-3 max-w-[20rem] min-w-[20rem] draggable"
		card={task}
		releaseCallback={swapToDragged}
		bind:draggedElement={$draggedTaskStore.dragged}
		bind:endCard={$draggedTaskStore.end}
		bind:endPosition={$draggedTaskStore.endPosition}
	>
		<div class="flex flex-col w-full h-full">
			<div class="w-full h-5/6">
				<header class="card-header flex justify-between">
					<b class="whitespace-nowrap overflow-hidden overflow-ellipsis">{task.title}</b>
					<b
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
			<div class="flex h-1/6 gap-2 items-center justify-start mt-2">
				<input class="checkbox border-2 ml-4" type="checkbox" checked={task.done} />
				<p>Marquer comme terminé</p>
			</div>
		</div>
	</Draggable>
{:else if style === TaskStyle.Compact}
	<a class="block card card-hover w-72 h-38 text-sm" href={`/task/${task.id}`}>
		<div class="flex w-full h-full divide-x-2">
			<div class="flex w-1/12 items-center justify-center m-2">
				<input class="checkbox border-2" type="checkbox" checked={task.done} />
			</div>
			<div class="w-10/12 border-surface-500 h-full">
				<header class="card-header flex justify-between">
					<b class="whitespace-nowrap overflow-hidden overflow-ellipsis">{task.title}</b>
					<b
						><DateToText
							startDate={new Date()}
							endDate={task.dueDate ? task.dueDate : new Date()}
						/></b
					>
				</header>
				<section class="p-4 text-xs whitespace-nowrap overflow-hidden overflow-ellipsis">
					{task.description}
				</section>
				<footer class="card-footer">
					<div class="flex justify-end">
						<div class="flex">
							<button class="btn variant-filled-error">Delete</button>
						</div>
					</div>
				</footer>
			</div>
		</div>
	</a>
{:else if style === TaskStyle.Mini}
	<a class="card-hover text-sm p-2 border-dashed border-surface-500" href={`/task/${task.id}`}>
		<div class="flex w-full h-full divide-x-2">
			<div class="flex w-1/12 items-center justify-center m-2">
				<input class="checkbox border-2" type="checkbox" checked={task.done} />
			</div>
			<div class="w-10/12 border-surface-500 h-full">
				{#if task.description}
					<header class="card-header flex justify-between">
						<b class="whitespace-nowrap overflow-hidden overflow-ellipsis">{task.title}</b>
						<b
							><DateToText
								startDate={new Date()}
								endDate={task.dueDate ? task.dueDate : new Date()}
							/></b
						>
					</header>
					<section class="p-4 text-xs overflow-hidden overflow-ellipsis whitespace-nowrap">
						{task.description}
					</section>
				{:else}
					<section class="flex justify-between h-full m-2">
						<b class="whitespace-nowrap overflow-hidden overflow-ellipsis">{task.title}</b>
						<b
							><DateToText
								startDate={new Date()}
								endDate={task.dueDate ? task.dueDate : new Date()}
							/></b
						>
					</section>
				{/if}
			</div>
		</div>
	</a>
{/if}
