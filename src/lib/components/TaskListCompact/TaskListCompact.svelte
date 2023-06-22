<script lang="ts" context="module">
	export interface TaskListCompactProps {}
</script>

<script lang="ts">
	import Task, { TaskStyle, type TaskProps } from '$lib/components/Task/Task.svelte';
	import './TaskListCompact.scss';
	export let tasks: TaskProps[] | undefined = [];
</script>

<div class="flex flex-wrap gap-2 w-full">
	{#await tasks}
		<div class="flex justify-center items-center">
			<div class="animate-spin rounded-full h-32 w-32 border-b-2" />
		</div>
	{:then}
		{#if tasks}
			{#each tasks as task}
				<Task {task} style={TaskStyle.Compact} />
			{/each}
		{/if}
	{/await}
</div>
