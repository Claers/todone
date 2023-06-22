<script lang="ts" context="module">
	export interface TaskListProps {}
</script>

<script lang="ts">
	import './TaskList.scss';
	import Task, { type TaskProps } from '$lib/components/Task/Task.svelte';
	import { tasksStore } from '$lib/store';
	import TaskStatusSelect from '../TaskStatusSelect/TaskStatusSelect.svelte';
	import { enhance } from '$app/forms';
	import { useQueryClient } from '@tanstack/svelte-query';
	import Button, { ButtonSize, ButtonStyle } from '$lib/components/Button/Button.svelte';
	import HtmlEditor from '$lib/components/HTMLEditor/HTMLEditor.svelte';
	import type { Option } from 'svelte-multiselect';
	import MarkdownEditor from '../MarkdownEditor/MarkdownEditor.svelte';
	// Get QueryClient from the context
	const queryClient = useQueryClient();

	let tasks: TaskProps[] | undefined = [];
	$: tasks = $tasksStore;

	let formTaskStatusId: Option;
	let formTaskDescription: string;
	let formTaskMarkdownDescription: string;
</script>

<div class="flex flex-col rounded-md shadow-md h-fit xl:w-1/2 m-4 h-full">
	<!-- <h1 class="text-2xl font-bold">Tasks</h1> -->
	{#await tasks}
		<div class="flex justify-center items-center">
			<div class="animate-spin rounded-full h-32 w-32 border-b-2" />
		</div>
	{:then}
		{#if tasks}
			<div class="flex lg:gap-4 gap-1 lg:p-4 !border-b-2">
				<h5 class="w-1/4 flex align-middle justify-center h5">Terminé ?</h5>
				<h5 class="w-1/3 flex align-middle justify-center h5">Nom</h5>
				<h5 class="w-1/4 flex align-middle justify-center h5">Etape</h5>
				<h5 class="w-1/4 h5"><div class="xl:ml-10 sm:ml-8 ml-4">Supprimer</div></h5>
			</div>
			<div class="flex flex-col">
				{#each tasks as task}
					<Task {task} status={task.taskStatusId ? task.taskStatusId : -1} />
				{/each}
			</div>
		{/if}
	{/await}
</div>

<div class="flex flex-col rounded-md shadow-md xl:w-1/2 m-4 h-full">
	<h2 class="h2 text-center mt-4">Nouvelle Tâche</h2>
	<form
		method="POST"
		action="/api/tasks?/create"
		use:enhance={({ formData }) => {
			formData.append('taskStatusId', formTaskStatusId.value);
			formData.append('description', formTaskDescription);
			return async ({ result, update }) => {
				await queryClient.invalidateQueries('tasks');
				// Empty the form
				update({ name: '' });
				formTaskStatusId = undefined;
				formTaskDescription = '';
				formTaskMarkdownDescription = '';
			};
		}}
	>
		<div class="flex flex-col justify-center gap-4 lg:m-4 lg:p-4">
			<Button type={ButtonStyle.Success} size={ButtonSize.Full} isSubmit>Créer</Button>
			<div class="flex gap-4">
				<label class="label">
					<span>Nom</span>
					<input
						class="input variant-form-material"
						name="name"
						type="text"
						placeholder="Nom de la tâche"
					/></label
				>
				<div class="label">
					<span>Status</span>
					<div>
						<TaskStatusSelect
							bind:status={formTaskStatusId}
							taskId={undefined}
							statusId={undefined}
						/>
					</div>
				</div>
			</div>

			<div class="label">
				<span>Description</span>
				<HtmlEditor bind:value={formTaskDescription} />
			</div>

			<div class="label">
				<span>Informations</span>
				<MarkdownEditor bind:value={formTaskMarkdownDescription} />
			</div>
		</div>
	</form>
</div>
