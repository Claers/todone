<script lang="ts">
	import { Pages, addPathToBreadcrumbs, goBack } from '$lib/breadcrums';
	import { breadcrumbsStore, tasksStore } from '$lib/store';
	import { onMount } from 'svelte';
	import type { PageData } from '../$types';
	import { check } from 'prettier';
	import { deleteTask, editTask, setTaskDone } from '$lib/tasks';
	import DateToText from '$lib/components/DateToText/DateToText.svelte';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { formatDateForDateInput } from '$lib/utils';
	import type { TaskProps } from '$lib/components/Task/Task.svelte';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faSave, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

	const queryClient = useQueryClient();

	export let data: PageData;

	$: task = $tasksStore?.find((task) => task.id == data.task_id);
	let editedTask: TaskProps;
	$: if (task) prepareEditTask();
	function prepareEditTask() {
		editedTask = {
			id: task.id,
			title: task.title,
			done: task.done,
			dueDate: formatDateForDateInput(task.dueDate),
			description: task.description
		};
	}

	onMount(async () => {
		// task = await tasksStore?.find((task) => task.id == data.task_id);
		addPathToBreadcrumbs(
			'Tâche : ' + task.title,
			`/tasks/${task.id}`,
			Pages.TASK,
			$breadcrumbsStore
		);
		prepareEditTask();
	});

	function setEditable() {
		isEdit = true;
	}

	function setNotEditable() {
		isEdit = false;
	}

	let isEdit: bool = false;
	let resizeAreaStyle =
		'event.target.style.height = "";event.target.style.height = event.target.scrollHeight + "px"';
</script>

<div
	class="container w-full h-[3rem] shadow-sm flex p-2 border-primary-800 border-b-2 gap-2 bg-surface-700"
>
	<button
		class="btn bg-error-500 btn-sm"
		on:click={() =>
			deleteTask(task, queryClient).then(() => {
				goBack();
				window.history.back();
			})}><Fa class="mr-2" icon={faTrash} />Supprimer</button
	>
	{#if !isEdit}
		<button class="btn variant-filled-tertiary btn-sm" on:click={setEditable}
			><Fa class="mr-2" icon={faEdit} />Modifier</button
		>
	{:else}
		<button
			class="btn variant-filled-primary btn-sm"
			on:click={() =>
				editTask(editedTask, queryClient)
					.then(setNotEditable)
					.finally(() => prepareEditTask())}
			><Fa class="mr-2" icon={faSave} />Sauvegarder
		</button>
	{/if}
</div>
<div class="container p-6 space-y-4 w-full md:max-w-[1024px] lg:max-w-none bg-surface-700 h-full">
	{#if task}
		{#if isEdit}
			<div class="border-primary-800 border-2 rounded-md p-4 flex gap-3 flex-col bg-surface-800">
				<div class="flex gap-2 align-middle">
					<h3 class="h3">Tâche :</h3>
					<input class="input w-[85%] input-custom" type="text" bind:value={editedTask.title} />
				</div>
				<button
					class="flex gap-2 items-center"
					on:click|preventDefault={() => {
						setTaskDone(task, !task?.done, queryClient);
					}}
				>
					<input class="checkbox input-custom" type="checkbox" bind:checked={editedTask.done} />
					<p>Marquer comme terminé</p></button
				>
			</div>
			<div class="border-primary-800 border-2 rounded-md p-4 flex gap-3 flex-col bg-surface-800">
				<div class="flex gap-2 items-center">
					<p>A terminer pour :</p>
					<input
						type="date"
						name="dueDate"
						class="input w-64 input-custom"
						bind:value={editedTask.dueDate}
					/>
				</div>
				<p>Description :</p>
				<textarea
					class="input textarea input-custom"
					rows="4"
					name="description"
					bind:value={editedTask.description}
					placeholder="Description de la tâche"
					on:input={(event) => {
						eval(resizeAreaStyle);
					}}
				/>
			</div>
		{:else}
			<div class="border-primary-800 border-2 rounded-md p-4 flex gap-3 flex-col bg-surface-800">
				<div class="flex gap-2 items-baseline">
					<h3 class="h3">Tâche :</h3>
					<p on:click={setEditable}>{task.title}</p>
				</div>
				<button
					class="flex gap-2 items-center"
					on:click|preventDefault={() => {
						setTaskDone(task, !task?.done, queryClient);
					}}
				>
					<input class="checkbox border-2" type="checkbox" checked={task.done} />
					<p>Marquer comme terminé</p></button
				>
			</div>
			<div class="border-primary-800 border-2 rounded-md p-4 flex gap-3 flex-col bg-surface-800">
				<p on:click={setEditable} class="flex gap-2 items-center">
					Temps restant :<DateToText
						startDate={new Date()}
						endDate={task.dueDate ? task.dueDate : new Date()}
					/>
				</p>
				<p>Description :</p>
				{#if task.description == ''}
					<p class="italic" on:click={setEditable}>Aucune description</p>
				{:else}
					<p on:click={setEditable}>{task.description}</p>
				{/if}
				<!-- <p>{task.created_at}</p>
				<p>{task.updated_at}</p>
				<p>{task.deleted_at}</p> -->
			</div>
		{/if}
	{:else}
		<h1>Task not found</h1>
	{/if}
</div>
