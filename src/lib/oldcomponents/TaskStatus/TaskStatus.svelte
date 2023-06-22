<script lang="ts" context="module">
	export interface TaskStatusProps {
		id: number;
		name: string;
		isDefaultStatus: boolean;
		isArchivedStatus: boolean;
		isDoneStatus: boolean;
	}
</script>

<script lang="ts">
	import './TaskStatus.scss';
	import { enhance } from '$app/forms';
	import Button, { ButtonSize, ButtonStyle } from '$lib/components/Button/Button.svelte';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { fieldUpdatedToast } from '$lib/notifications';

	export let status: TaskStatusProps;
	const queryClient = useQueryClient();

	let saveTimeout: NodeJS.Timeout;

	function handleChange(e) {
		if (saveTimeout) clearTimeout(saveTimeout);
		saveTimeout = setTimeout(saveData, 2000);
	}

	async function saveData() {
		await fetch('/api/tasksStatus', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				isDefaultStatus: status.isDefaultStatus,
				isArchivedStatus: status.isArchivedStatus,
				isDoneStatus: status.isDoneStatus,
				id: status.id
			})
		})
			.then((res) => res.json())
			.then((data) => {
				queryClient.invalidateQueries('taskStatus');
			})
			.catch((err) => console.log(err));
		fieldUpdatedToast('Le status');
	}
</script>

<div class="flex flex-col lg:gap-4 gap-2 !border-b-2">
	<div class="flex lg:gap-4 gap-2 lg:p-4 p-2">
		<div class="w-1/4 flex align-middle justify-center">
			<p>{status.name}</p>
		</div>
		<div class="flex w-1/4 align-middle justify-center">
			<input
				class="checkbox border-2"
				type="checkbox"
				checked={status.isDefaultStatus}
				on:change={handleChange}
			/>
		</div>
		<div class="flex w-1/4 align-middle justify-center">
			<input
				class="checkbox border-2"
				type="checkbox"
				checked={status.isDoneStatus}
				on:change={handleChange}
			/>
		</div>
		<div class="flex w-1/4 align-middle justify-center">
			<input
				class="checkbox border-2"
				type="checkbox"
				checked={status.isArchivedStatus}
				on:change={handleChange}
			/>
		</div>

		<div class="w-1/4">
			<form
				class="lg:ml-8 ml-4"
				method="POST"
				action="/api/tasksStatus?/delete"
				use:enhance={() => {
					return async ({ result, update }) => {
						queryClient.invalidateQueries('taskStatus');
					};
				}}
			>
				<input type="hidden" name="id" value={status.id} />
				<Button type={ButtonStyle.Danger} size={ButtonSize.Small} isSubmit>Delete</Button>
			</form>
		</div>
	</div>
</div>

<!-- <div class="flex justify-between items-center p-4 w-full !border-b-2 lg:gap-12 sm:gap-6"> -->
<!-- <td class="w-1/6">{status.name}</td>
<td> <input class="checkbox" type="checkbox" checked={status.isDefaultStatus} /></td>
<td> <input class="checkbox" type="checkbox" checked={status.isDoneStatus} /></td>
<td> <input class="checkbox" type="checkbox" checked={status.isArchivedStatus} /></td>
<td>
	<form
		method="POST"
		action="/api/tasksStatus?/delete"
		use:enhance={() => {
			return async ({ result, update }) => {
				queryClient.invalidateQueries('taskStatus');
			};
		}}
	>
		<input type="hidden" name="id" value={status.id} />
		<Button type={ButtonStyle.Danger} size={ButtonSize.Small} isSubmit>Delete</Button>
	</form></td
> -->
<!-- </div> -->
