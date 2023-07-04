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
	import {
		faSave,
		faEdit,
		faTrash,
		faCancel,
		faBackspace
	} from '@fortawesome/free-solid-svg-icons';

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

<div class="container p-6 space-y-4 w-full md:max-w-[1024px] lg:max-w-none bg-surface-700 h-full">
	{#if task}
		<div class="border-primary-800 border-2 rounded-md p-4 flex gap-3 flex-col bg-surface-800">
			<div class="flex gap-4">
				<button
					class="btn variant-ghost btn-sm"
					on:click={() => {
						goBack();
						window.history.back();
					}}><Fa class="mr-2" icon={faBackspace} />Retour</button
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
					<button
						class="btn btn-sm"
						on:click={() => {
							prepareEditTask();
							isEdit = false;
						}}
						><Fa class="mr-2" icon={faCancel} />Annuler
					</button>
				{/if}
			</div>
			<div class="flex gap-4 flex-col">
				<!-- Name -->
				{#if isEdit}
					<div class="flex gap-2 align-middle">
						<h3 class="h3">Tâche :</h3>
						<input class="input w-[85%] input-custom" type="text" bind:value={editedTask.title} />
					</div>
				{:else}
					<div class="flex gap-2 items-baseline">
						<h3 class="h3">Tâche :</h3>
						<p class="cursor-pointer" on:click={setEditable}>{task.title}</p>
					</div>
				{/if}
				<!-- Is Done -->
				{#if isEdit}
					<button
						class="flex gap-2 items-center"
						on:click|preventDefault={() => {
							setTaskDone(task, !task?.done, queryClient);
						}}
					>
						<input class="checkbox input-custom" type="checkbox" bind:checked={editedTask.done} />
						<p>Marquer comme terminé</p></button
					>
				{:else}
					<button
						class="flex gap-2 items-center"
						on:click|preventDefault={() => {
							setTaskDone(task, !task?.done, queryClient);
						}}
					>
						<input class="checkbox border-2" type="checkbox" checked={task.done} />
						<p>Marquer comme terminé</p></button
					>
				{/if}
			</div>
			<!-- Due Date -->
			{#if isEdit}
				<div class="flex gap-2 items-center">
					<p>A terminer pour :</p>
					<input
						type="date"
						name="dueDate"
						class="input w-64 input-custom"
						bind:value={editedTask.dueDate}
					/>
				</div>
			{/if}
			<p on:click={setEditable} class="flex gap-2 items-center cursor-pointer">
				Temps restant :<DateToText
					startDate={new Date()}
					endDate={task.dueDate ? task.dueDate : new Date()}
				/>
			</p>
			{#if isEdit}
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
			{:else}
				<p>Description :</p>
				{#if task.description == ''}
					<p class="italic cursor-pointer" on:click={setEditable}>Aucune description</p>
				{:else}
					<p on:click={setEditable}>{task.description}</p>
				{/if}
			{/if}
		</div>
	{:else}
		<h1>Task not found</h1>
	{/if}
</div>
