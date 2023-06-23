<script lang="ts" context="module">
	export interface TaskCompactProps {}
</script>

<script lang="ts">
	import Draggable from '$lib/components/Draggable/Draggable.svelte';
	import { draggedTaskStore } from '$lib/store';
	import DateToText from '$lib/components/DateToText/DateToText.svelte';

	export let task: TaskProps;
</script>

<Draggable
	card={task}
	on:onDragEnd
	bind:draggedElement={$draggedTaskStore.dragged}
	bind:endCard={$draggedTaskStore.end}
	bind:endPosition={$draggedTaskStore.endPosition}
	class="flex card card-hover w-72 h-28 text-sm draggable p-2"
>
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
						<button class="btn variant-filled-error btn-sm">Delete</button>
					</div>
				</div>
			</footer>
		</div>
	</div>
</Draggable>
