<script lang="ts" context="module">
	export interface NewTaskFullProps {}
</script>

<script lang="ts">
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faPlus, faClose } from '@fortawesome/free-solid-svg-icons';
	import type { TaskProps } from '$lib/components/Task/Task.svelte';
	import { scale } from 'svelte/transition';
	import { formatDateForDateInput } from '$lib/utils';
	import { enhance } from '$app/forms';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { toastStore } from '@skeletonlabs/skeleton';
	import { errorToast } from '$lib/notifications';
	import ResisableTextArea from '$lib/components/ResisableTextArea/ResisableTextArea.svelte';
	const queryClient = useQueryClient();
	const emptyTask: TaskProps = {
		title: '',
		createdAt: new Date(),
		updatedAt: new Date(),
		done: false,
		dueDate: formatDateForDateInput(new Date(new Date().setDate(new Date().getDate() + 1)))
	};
	let newTask: TaskProps = { ...emptyTask };
	let isActive = false;

	let formErrors = [];
</script>

<div
	class={`flex card card-hover w-80 p-3 max-w-[20rem] min-w-[20rem] ${!isActive ? 'h-52' : 'h-80'}`}
	in:scale={{ duration: 500 }}
>
	{#if !isActive}
		<button
			class="flex w-full h-full justify-center items-center group"
			on:click={() => {
				isActive = true;
			}}
		>
			<div
				class="flex justify-center items-center rounded-lg outline-surface-400 outline-dashed outline-2 w-14 h-14 group-hover:bg-surface-600"
			>
				<Fa icon={faPlus} />
			</div>
		</button>
	{:else}
		<div class="flex flex-col w-full h-full">
			<button
				class="flex w-full mb-4 justify-end"
				on:click={() => {
					isActive = false;
				}}
			>
				<Fa icon={faClose} />
			</button>
			<form
				method="POST"
				action="/api/tasks?/create"
				class="contents"
				use:enhance={() => {
					return async ({ result, update }) => {
						// console.log(result);
						if (result.type === 'success') {
							queryClient.refetchQueries('tasks');
							newTask = emptyTask;
							isActive = false;
						} else {
							formErrors.push(result.data.fields);
							formErrors = formErrors.flat();
							errorToast(result.data.message);
						}
					};
				}}
			>
				<div class="w-full overflow-y-scroll">
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
									class="input input-custom"
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
				</div>
				<hr />

				<button class="btn variant-filled-primary" type="submit">
					<p>Créer</p>
				</button>
			</form>
		</div>
	{/if}
</div>
