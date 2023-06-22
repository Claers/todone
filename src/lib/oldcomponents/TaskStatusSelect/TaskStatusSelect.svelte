<script lang="ts" context="module">
	export interface TaskStatusSelectProps {}
</script>

<script lang="ts">
	import './TaskStatusSelect.scss';
	import { tasksStatusStore } from '$lib/store';
	import MultiSelect from 'svelte-multiselect';
	import type { Option } from 'svelte-multiselect';

	// function changeStatus(event: Event) {
	// 	if (event.target.value !== -1) {
	// 		// Send post request to change the status
	// 		fetch('/api/tasks/setStatus', {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json'
	// 			},
	// 			body: JSON.stringify({
	// 				id: taskId,
	// 				taskStatusId: event.target.value
	// 			})
	// 		}).then((response) => {
	// 			if (response.ok) {
	// 				statusId = Number(event.target.value);
	// 			}
	// 		});
	// 	} else {
	// 		drawerStore.open(drawerSettings);
	// 	}
	// }

	function ChangeStatus(event: any) {
		if (event.detail.option && event.detail.option !== status) {
			fetch('/api/tasks/setStatus', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: taskId,
					taskStatusId: event.detail.option.value
				})
			}).then((response) => {
				if (response.ok) {
					statusId = Number(event.detail.option.value);
				}
			});
		}
	}

	export let taskId: number | undefined;
	export let status: Option | undefined | null;
	export let statusId: number | undefined | null;
	let statusSelected: [Option];

	// Get all the statuses from the store
	let statuses: Option[] | undefined = [];

	tasksStatusStore.subscribe((value) => {
		if (!value) return;
		statuses = value.map((status) => {
			return {
				value: status.id,
				label: status.name
			} as Option;
		});
		if (!statusId) {
			statusId = $tasksStatusStore?.find((status) => status.isDefaultStatus)?.id;
		}
		if (statusId) {
			statusSelected = statuses?.filter((status) => status.value === statusId);
		}
	});

	// Find the isDefaultStatus status
	// $: if (!statusId) {
	// 	statusId = $tasksStatusStore?.find((status) => status.isDefaultStatus)?.id;
	// }

	// $: statusSelected = [status];
</script>

{#if statuses}
	<MultiSelect
		options={statuses}
		bind:value={status}
		bind:selected={statusSelected}
		minSelect={1}
		maxSelect={1}
		on:add={ChangeStatus}
		let:idx
		let:option
		placeholder={'Changer le status'}
	>
		<div class="flex justify-between w-full" slot="option">
			{option.label}
			<!-- <div
					class="text-primary-500"
					on:click|stopPropagation={drawerStore.open(drawerSettings)}
					target="_blank"
					rel="noreferrer">Modifier</div
				> -->
		</div>
	</MultiSelect>
{:else}
	<div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
{/if}
