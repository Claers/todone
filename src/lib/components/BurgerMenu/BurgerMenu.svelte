<script lang="ts" context="module">
	export interface BurgerMenuProps {}
</script>

<script lang="ts">
	import './BurgerMenu.scss';
	import { drawerStore } from '@skeletonlabs/skeleton';
	import Logo from '$lib/components/Logo/Logo.svelte';

	function drawerOpen(): void {
		drawerStore.open({ id: 'nav' });
	}
</script>

<div class="flex items-center">
	<button class="lg:hidden btn btn-sm mr-4" on:click={drawerOpen}>
		<span>
			<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
				<rect width="100" height="20" />
				<rect y="30" width="100" height="20" />
				<rect y="60" width="100" height="20" />
			</svg>
		</span>
	</button>
	<Logo />
</div>
