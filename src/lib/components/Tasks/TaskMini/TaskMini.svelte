<script lang="ts" context="module">
	export interface TaskMiniProps {}
</script>

<script lang="ts">
	import Draggable from '$lib/components/Draggable/Draggable.svelte';
	import { draggedTaskStore } from '$lib/store';
	import DateToText from '$lib/components/DateToText/DateToText.svelte';
	import { DragDirection } from '$lib/components/Draggable/Draggable.svelte';

	export let task: TaskProps;
</script>

<Draggable
	card={task}
	on:onDragEnd
	bind:draggedElement={$draggedTaskStore.dragged}
	bind:endCard={$draggedTaskStore.end}
	bind:endPosition={$draggedTaskStore.endPosition}
	class="card-hover text-sm p-2 draggable"
	dragDirection={DragDirection.Vertical}
>
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
</Draggable>
