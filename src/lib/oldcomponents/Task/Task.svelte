<script lang="ts" context="module">
	export interface TaskProps {
		id: number;
		title: string;
		description?: string;
		markdownDescription?: string;
		createdAt: Date;
		updatedAt: Date;
		taskStatusId?: number;
		done: boolean;
	}
</script>

<script lang="ts">
	import './Task.scss';
	import Button, { ButtonSize, ButtonStyle } from '$lib/components/Button/Button.svelte';
	import { enhance } from '$app/forms';
	import TaskStatusSelect from '$lib/components/TaskStatusSelect/TaskStatusSelect.svelte';
	import HtmlEditor from '$lib/components/HTMLEditor/HTMLEditor.svelte';
	import MarkdownEditor from '../MarkdownEditor/MarkdownEditor.svelte';
	import { fieldUpdatedToast, errorToast } from '$lib/notifications';
	import { useQueryClient } from '@tanstack/svelte-query';

	// Get QueryClient from the context
	const queryClient = useQueryClient();

	export let task: TaskProps;
	export let status: number | undefined;

	// const tasksQuery = createQuery({ queryKey: ['tasks'], queryFn: () => fetch('api/tasks') });
	// $: if ($tasksQuery.data) setStore(tasksStore, $tasksQuery.data);
	let openDescription = false;
	let description: string = task.description || '';
	let markdownDescription: string = task.markdownDescription || '';
	let saveTimeout: NodeJS.Timeout;
	let title: string = task.title || '';
	let taskDone: boolean = task.done || false;
	function OpenDescription(_: any | null) {
		openDescription = !openDescription;
	}

	function handleChange(e) {
		if (saveTimeout) clearTimeout(saveTimeout);
		saveTimeout = setTimeout(saveData, 2000);
	}

	function resetChanges() {
		title = task.title;
		taskDone = task.done;
		description = task.description || '';
		markdownDescription = task.markdownDescription || '';
	}

	async function saveData() {
		await fetch('/api/tasks', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: title,
				done: taskDone,
				id: task.id
			})
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					resetChanges();
					errorToast(data.error);
					return;
				}
				queryClient.invalidateQueries('tasks');
				fieldUpdatedToast('La tâche');
			})
			.catch((err) => resetChanges());
	}

	function SaveMarkdownDescription() {
		return fetch('/api/tasks', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				markdownDescription: markdownDescription,
				id: task.id
			})
		})
			.then((res) => res.json())
			.then((data) => {
				queryClient.invalidateQueries('tasks');
			})
			.catch((err) => console.log(err));
	}

	function SaveDescription() {
		return fetch('/api/tasks', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				description: description,
				id: task.id
			})
		})
			.then((res) => res.json())
			.then((data) => {
				queryClient.invalidateQueries('tasks');
			})
			.catch((err) => console.log(err));
	}
	// $: console.log('Description: ', description);
</script>

<div class="flex flex-col lg:gap-4 gap-2 !border-b-2">
	<div
		class="flex lg:gap-4 gap-2 lg:p-4 p-2"
		on:click={OpenDescription}
		on:keydown={OpenDescription}
	>
		<div class="w-1/4 flex align-middle justify-center">
			<input
				class="checkbox border-2"
				type="checkbox"
				on:click|stopPropagation={() => {}}
				bind:checked={taskDone}
				on:change={handleChange}
			/>
		</div>
		<div class="w-1/3 flex align-middle justify-center">
			{#if openDescription}
				<label class="label">
					<input
						on:click|stopPropagation={() => {}}
						on:keydown={(e) => {
							if (e.key === 'Enter' || e.key === 'Escape') {
								SaveDescription().then(() => {
									openDescription = false;
								});
							}
							handleChange(e);
							e.stopPropagation();
						}}
						class="input variant-form-material"
						name="title"
						type="text"
						placeholder="Nom de la tâche"
						bind:value={title}
						on:change={handleChange}
					/></label
				>
			{:else}
				<p class="text-ellipsis overflow-hidden whitespace-nowrap">{task.title}</p>
			{/if}
		</div>
		<div class="w-1/4 flex align-middle justify-center">
			<div class="xl:w-48 lg:w-32" on:click|stopPropagation={() => {}}>
				<TaskStatusSelect statusId={status} taskId={task.id} status={undefined} />
			</div>
		</div>
		<div class="w-1/4">
			<form
				class="lg:ml-8 ml-4"
				method="POST"
				action="/api/tasks?/delete"
				use:enhance={() => {
					return async ({ result, update }) => {
						queryClient.invalidateQueries('tasks');
					};
				}}
			>
				<input type="hidden" name="id" value={task.id} />
				<Button type={ButtonStyle.Danger} size={ButtonSize.Small} isSubmit>Delete</Button>
			</form>
		</div>
	</div>
	{#if openDescription}
		<div class="lg:p-4 p-2">
			<h3 class="h3 mb-2">Description</h3>
			<HtmlEditor bind:value={description} saveCallback={SaveDescription} />
			<h3 class="h3 mb-2">Informations</h3>
			<MarkdownEditor bind:value={markdownDescription} saveCallback={SaveMarkdownDescription} />
		</div>
	{/if}
</div>
