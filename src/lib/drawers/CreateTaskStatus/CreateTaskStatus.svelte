<script lang="ts" context="module">
	export interface CreateTaskStatusProps {}
</script>

<script lang="ts">
	import './CreateTaskStatus.scss';
	import { drawerStore } from '@skeletonlabs/skeleton';
	import { enhance } from '$app/forms';

</script>

<form method="POST" use:enhance action="/api/taskStatus?/create">
	<input name="name" type="text" placeholder="Nom du status" />
	<input name="isDefaultStatus" type="checkbox" />
	<input name="isDoneStatus" type="checkbox" />
	<input name="isArchivedStatus" type="checkbox" />
	<button type="submit">Créer</button>
</form>
