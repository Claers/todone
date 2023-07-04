<script lang="ts" context="module">
	export interface CreateTaskProps {}
</script>

<script lang="ts">
	import './CreateTask.scss';
	import { enhance } from '$app/forms';
	import { useQueryClient } from '@tanstack/svelte-query';
	import ResisableTextArea from '$lib/components/ResisableTextArea/ResisableTextArea.svelte';
	import { drawerStore } from '@skeletonlabs/skeleton';
	import { errorToast } from '$lib/notifications';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faClose } from '@fortawesome/free-solid-svg-icons';

	const queryClient = useQueryClient();
	let emptyTask = {
		title: '',
		description: '',
		dueDate: '',
		done: false
	};
	let newTask = { ...emptyTask };
	let formErrors = [];
</script>

<div>
	<form
		method="POST"
		action="/api/tasks?/create"
		class="contents"
		use:enhance={() => {
			return async ({ result, update }) => {
				// console.log(result);
				if (result.type === 'success') {
					queryClient.refetchQueries('tasks');
					newTask = { ...emptyTask };
					drawerStore.close();
				} else {
					formErrors = [];
					result.data.forEach((failed) => {
						formErrors.push(failed.fields);
						errorToast(failed.message);
					});
					formErrors = formErrors.flat();
				}
			};
		}}
	>
		<div class="w-full p-4">
			<div class="flex w-full mb-4 justify-between">
				<h3 class="h3 w-[75%] text-right">Créer une tache</h3>
				<button
					type="button"
					on:click={() => {
						drawerStore.close();
					}}
				>
					<Fa icon={faClose} />
				</button>
			</div>
			<header class="card-header flex justify-between">
				<label class="label">
					<span class="text-sm">Nom</span>
					<input
						class={`input input-custom ${
							formErrors.includes('title') ? '!bg-error-700 ' : '!bg-secondary-700'
						}`}
						type="text"
						name="title"
						bind:value={newTask.title}
						placeholder="Titre de la tâche"
					/>
				</label>
			</header>
			<section class="p-4 w-full h-fit">
				<label class="label">
					<span class="text-sm">Description</span>
					<ResisableTextArea
						rows="4"
						name="description"
						bind:value={newTask.description}
						placeholder="Description de la tâche"
					/>
				</label>
				<div class="w-full mb-4">
					<label class="label">
						<span class="text-sm">Date de fin</span>
						<input
							type="date"
							name="dueDate"
							class={`input input-custom ${
								formErrors.includes('dueDate') ? '!bg-error-700 ' : '!bg-secondary-700'
							}`}
							bind:value={newTask.dueDate}
						/>
					</label>
				</div>
				<div class="w-full mb-4">
					<div class="flex gap-2 justify-start">
						<input
							name="done"
							class="checkbox ml-4 !bg-secondary-700 !border-secondary-400 border-2"
							type="checkbox"
						/>
						<p>Marquer comme terminé</p>
					</div>
				</div>
			</section>

			<button class="btn variant-filled-primary w-full" type="submit">
				<p>Créer</p>
			</button>
		</div>
	</form>
</div>
