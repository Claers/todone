<script lang="ts" context="module">
	export interface TaskFullProps {}
</script>

<script lang="ts">
	import Draggable from '$lib/components/Draggable/Draggable.svelte';
	import { draggedTaskStore } from '$lib/store';
	import DateToText from '$lib/components/DateToText/DateToText.svelte';
	export let task: TaskProps;
</script>

<Draggable
	class="flex card card-hover w-80 h-52 p-3 max-w-[20rem] min-w-[20rem] draggable"
	card={task}
	on:onDragEnd
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
