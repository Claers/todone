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
	import TaskFull from '$lib/components/Tasks/TaskFull/TaskFull.svelte';
	import TaskCompact from '$lib/components/Tasks/TaskCompact/TaskCompact.svelte';
	import TaskMini from '$lib/components/Tasks/TaskMini/TaskMini.svelte';

	export let style: TaskStyle = TaskStyle.Full;
	export let task: TaskProps;
</script>

{#if style === TaskStyle.Full}
	<TaskFull bind:task on:onDragEnd />
{:else if style === TaskStyle.Compact}
	<TaskCompact bind:task on:onDragEnd />
{:else if style === TaskStyle.Mini}
	<TaskMini bind:task on:onDragEnd />
{/if}
