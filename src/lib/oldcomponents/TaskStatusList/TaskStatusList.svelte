<script lang="ts" context="module">
	export interface TaskStatusListProps {}
</script>

<script lang="ts">
	import './TaskStatusList.scss';
	import TaskStatus, { type TaskStatusProps } from '$lib/components/TaskStatus/TaskStatus.svelte';
	import { tasksStatusStore } from '$lib/store';
	import { enhance } from '$app/forms';
	import Button, { ButtonSize, ButtonStyle } from '$lib/components/Button/Button.svelte';
	import { useQueryClient } from '@tanstack/svelte-query';

	// Get QueryClient from the context
	const queryClient = useQueryClient();

	let statuses: TaskStatusProps[] | undefined = [];
	$: statuses = $tasksStatusStore;

	// let formStatusIsDefaultStatus = false;
	// let formStatusIsDoneStatus = false;
	// let formStatusIsArchivedStatus = false;
</script>

<div class="flex flex-col rounded-md shadow-md xl:w-1/2 m-4">
	<!-- <h1 class="text-2xl font-bold">Tasks</h1> -->
	{#await statuses}
		<div class="flex justify-center items-center">
			<div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
		</div>
	{:then}
		{#if statuses}
			<div class="flex lg:gap-4 gap-1 lg:p-4 !border-b-2">
				<h5 class="w-1/4 flex align-middle justify-center h5">Nom</h5>
				<h5 class="w-1/4 flex align-middle justify-center h5">Etape par défaut</h5>
				<h5 class="w-1/4 flex align-middle justify-center h5">Etape de fin</h5>
				<h5 class="w-1/4 flex align-middle justify-center h5">Etape d'archivage</h5>
				<h5 class="w-1/4 h5">
					<div class="xl:ml-10 sm:ml-8 ml-4">Supprimer</div>
				</h5>
			</div>
			<div class="bg-slate-800 flex flex-col">
				{#each statuses as status}
					<TaskStatus {status} />
				{/each}
			</div>
		{/if}
	{/await}
</div>

<div class="flex flex-col rounded-md shadow-md xl:w-1/2 m-4 bg-slate-800">
	<h2 class="h2 text-center mt-4">Nouvelle Etape</h2>
	<form
		method="POST"
		action="/api/tasksStatus?/create"
		use:enhance={({ formData }) => {
			return async ({ result, update }) => {
				await queryClient.invalidateQueries('taskStatus');
				// Empty the form
				update({ name: '', isDefaultStatus: false, isDoneStatus: false, isArchivedStatus: false });
			};
		}}
	>
		<div class="flex flex-col justify-center gap-4 lg:m-4 lg:p-4">
			<div class="flex gap-4 items-center space-y-6">
				<label class="label">
					<span>Nom</span>
					<input
						class="input variant-form-material"
						name="name"
						type="text"
						placeholder="Nom de la tâche"
					/></label
				>
				<label class="label items-center space-x-2">
					<input class="checkbox border-2" type="checkbox" name="isDefaultStatus" />
					<span>Is Default Status</span>
				</label>
				<label class="label items-center space-x-2">
					<input class="checkbox border-2" type="checkbox" name="isDoneStatus" />
					<span>Is Done Status</span>
				</label>
				<label class="label items-center space-x-2">
					<input class="checkbox border-2" type="checkbox" name="isArchivedStatus" />
					<span>Is Archived Status</span>
				</label>
			</div>

			<Button type={ButtonStyle.Success} size={ButtonSize.Large} isSubmit>Créer</Button>
		</div>
	</form>
</div>
