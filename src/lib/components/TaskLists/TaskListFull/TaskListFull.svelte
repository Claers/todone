<script lang="ts" context="module">
	export interface TaskListFullProps {}
</script>

<script lang="ts">
	import Task, { TaskStyle, type TaskProps } from '$lib/components/Task/Task.svelte';
	import { flip } from 'svelte/animate';

	const dragDuration = 300;

	export let tasks: TaskProps[] | undefined = [];
</script>

<div class="flex flex-wrap gap-2">
	{#await tasks}
		<div class="flex justify-center items-center">
			<div class="animate-spin rounded-full h-32 w-32 border-b-2" />
		</div>
	{:then}
		{#if tasks}
			{#each tasks as task (task.id)}
				<div animate:flip={{ duration: dragDuration }}>
					<Task {task} style={TaskStyle.Full} on:onDragEnd />
				</div>
			{/each}
		{/if}
	{/await}
</div>
