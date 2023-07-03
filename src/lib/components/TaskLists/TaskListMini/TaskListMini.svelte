<script lang="ts" context="module">
	export interface TaskListMiniProps {}
</script>

<script lang="ts">
	import Task, { TaskStyle, type TaskProps } from '$lib/components/Task/Task.svelte';
	import { flip } from 'svelte/animate';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import { drawerStore } from '@skeletonlabs/skeleton';
	import { Drawers } from '$lib/drawers/drawers';

	// Get QueryClient from the context
	const dragDuration = 300;

	export let tasks: TaskProps[] | undefined = [];
</script>

<div class="flex flex-col flex-wrap divide-y-2">
	{#await tasks}
		<div class="flex justify-center items-center">
			<div class="animate-spin rounded-full h-32 w-32 border-b-2" />
		</div>
	{:then}
		{#if tasks}
			{#each tasks as task (task.id)}
				<div animate:flip={{ duration: dragDuration }} class="border-dashed border-surface-500">
					<Task {task} style={TaskStyle.Mini} on:onDragEnd />
				</div>
			{/each}
		{/if}
		<button
			class="flex w-full justify-center items-center group border-none btn bg-primary-500"
			on:click={() => drawerStore.open({ id: Drawers.CreateTask })}
		>
			<Fa icon={faPlus} />
		</button>
	{/await}
</div>
