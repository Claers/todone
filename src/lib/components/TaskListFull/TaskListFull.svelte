<script lang="ts" context="module">
	export interface TaskListFullProps {}
</script>

<script lang="ts">
	import './TaskListFull.scss';
	import Task, { TaskStyle, type TaskProps } from '$lib/components/Task/Task.svelte';
	// Get QueryClient from the context

	export let tasks: TaskProps[] | undefined = [];
</script>

<div class="flex flex-wrap gap-2">
	{#await tasks}
		<div class="flex justify-center items-center">
			<div class="animate-spin rounded-full h-32 w-32 border-b-2" />
		</div>
	{:then}
		{#if tasks}
			{#each tasks as task}
				<Task {task} style={TaskStyle.Full} />
			{/each}
		{/if}
	{/await}
</div>
