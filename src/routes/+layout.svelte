<script lang="ts">
	import '@fontsource/outfit';
	// import '../theme.postcss';
	// import '@skeletonlabs/skeleton/styles/partials/variants.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import type { LayoutData } from './$types';

	// Your selected Skeleton theme:
	import '$lib/style.scss';
	// This contains the bulk of Skeletons required styles:
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import 'bytemd/dist/index.css';

	import { AppShell } from '@skeletonlabs/skeleton';
	import { Toast } from '@skeletonlabs/skeleton';
	import { AppBar } from '@skeletonlabs/skeleton';
	import { Drawer, drawerStore } from '@skeletonlabs/skeleton';
	import { swipe } from 'svelte-gestures';

	import Navigation from '$lib/components/Navigation/Navigation.svelte';
	import BurgerMenu from '$lib/components/BurgerMenu/BurgerMenu.svelte';
	import Logo from '$lib/components/Logo/Logo.svelte';
	import Breadcrums from '$lib/components/Breadcrums/Breadcrums.svelte';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { Modal } from '@skeletonlabs/skeleton';
	import { Drawers } from '$lib/drawers/drawers';
	import CreateTask from '$lib/drawers/CreateTask/CreateTask.svelte';
	import { goto } from '$app/navigation';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	export let data: LayoutData;
	// const tasksData = data.queryClient.fetchQuery('tasks', async () =>
	// 	(await fetch('api/tasks')).json()
	// );

	function swipeGestureHandler(event) {
		let direction = event.detail.direction;
		// If is on a mobile device or small screen
		if (window.innerWidth < 1024) {
			if (direction === 'right') {
				drawerStore.open({ id: 'nav' });
			} else if (direction === 'left') {
				drawerStore.close();
			}
		}
	}

	async function logOut() {
		// Clear the cookies
		await fetch('/api/logout');
		// Refresh the page
		window.location.reload();
	}
</script>

<!-- Make Invisble  -->
<QueryClientProvider client={data.queryClient}>
	<Toast />
	<Modal />
	<div
		id="swipe"
		use:swipe={{ timeframe: 300, minSwipeDistance: 10, touchAction: 'pan-y' }}
		on:swipe={swipeGestureHandler}
	>
		<AppBar
			gridColumns="grid-cols-3"
			border="border-primary-800 border-b-4 "
			slotDefault="place-self-center"
			slotTrail="place-content-end"
		>
			<svelte:fragment slot="lead">
				<BurgerMenu />
			</svelte:fragment>
			<Breadcrums />
			<svelte:fragment slot="trail">
				{#if data.session}
					<button class="btn variant-filled-surface" on:click={logOut}>Log Out</button>
				{:else}
					<button class="btn variant-filled-surface" on:click={() => goto('/login')}>Log In</button>
				{/if}
			</svelte:fragment>
		</AppBar>
	</div>

	<Drawer>
		{#if $drawerStore.id === 'nav'}
			<div
				use:swipe={{ timeframe: 300, minSwipeDistance: 10, touchAction: 'pan-y' }}
				on:swipe={swipeGestureHandler}
				class="w-full h-full"
			>
				<div class="m-4">
					<Logo />
				</div>
				<hr />
				<Navigation />
			</div>
		{/if}
		{#if $drawerStore.id === Drawers.CreateTask}
			<CreateTask />
		{/if}
	</Drawer>
	<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64 border-primary-800 border-r-4 ">
		<!-- (header) -->
		<svelte:fragment slot="sidebarLeft"><Navigation /></svelte:fragment>
		<!-- (sidebarRight) -->
		<!-- (pageHeader) -->
		<!-- Router Slot -->

		<div
			use:swipe={{ timeframe: 300, minSwipeDistance: 10, touchAction: 'pan-y' }}
			on:swipe={swipeGestureHandler}
			class="w-full h-full bg-surface-700"
		>
			<slot />
		</div>

		<!-- ---- / ---- -->
		<svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
		<!-- (footer) -->
	</AppShell>
</QueryClientProvider>

<style lang="scss">
	:global(div.multiselect) {
		/* top-level wrapper div */
	}
	:global(div.multiselect.open) {
		/* top-level wrapper div when dropdown open */
	}
	:global(div.multiselect.disabled) {
		/* top-level wrapper div when in disabled state */
	}
	:global(div.multiselect > ul.selected) {
		/* selected list */
	}
	:global(div.multiselect > ul.selected > li) {
		/* selected list items */
		background-color: var(--sms-selected-bg, rgba(0, 0, 0, 0)) !important;
	}
	:global(div.multiselect button) {
		/* target all buttons in this component */
	}
	:global(div.multiselect > ul.selected > li button, button.remove-all) {
		/* buttons to remove a single or all selected options at once */
	}
	:global(div.multiselect > input[autocomplete]) {
		/* input inside the top-level wrapper div */
	}
	:global(div.multiselect > ul.options) {
		/* dropdown options */
		background-color: rgb(var(--color-surface-700)) !important;
	}
	:global(div.multiselect > ul.options > li) {
		/* dropdown list items */
		background-color: rgb(var(--color-surface-700)) !important;
	}
	:global(div.multiselect > ul.options > li.selected) {
		/* selected options in the dropdown list */
	}
	:global(div.multiselect > ul.options > li:not(.selected):hover) {
		/* unselected but hovered options in the dropdown list */
	}
	:global(div.multiselect > ul.options > li.active) {
		/* active means item was navigated to with up/down arrow keys */
		/* ready to be selected by pressing enter */
	}
	:global(div.multiselect > ul.options > li.disabled) {
		/* options with disabled key set to true (see props above) */
	}

	:global(.bytemd) {
		background-color: rgb(var(--color-surface-700));
		color: rgba(var(--theme-font-color-dark));
		border-color: rgb(var(--color-surface-500));
	}

	:global(.bytemd-body),
	:global(.bytemd-toolbar),
	:global(.CodeMirror),
	:global(.bytemd-preview) {
		background-color: rgb(var(--color-surface-700));
		border-color: rgb(var(--color-surface-500));
	}

	:global(.bytemd-split .bytemd-preview) {
		border-left-color: rgb(var(--color-surface-500));
	}
	:global(.bytemd-status) {
		border-top-color: rgb(var(--color-surface-500));
	}

	:global(.CodeMirror-cursor) {
		border-color: rgb(var(--theme-font-color-dark));
	}

	:global(.CodeMirror-code),
	:global(.cm-s-default .cm-comment),
	:global(.cm-s-default .cm-meta, .cm-s-default .cm-qualifier),
	:global(.cm-s-default .cm-variable-2),
	:global(.cm-s-default .cm-header) {
		color: rgb(var(--theme-font-color-dark));
	}

	:global(.cm-s-default .cm-link) {
		color: #3b82f6;
	}
	:global(.cm-s-default .cm-url) {
		color: #f59e0b;
	}

	:global(code.hljs) {
		background-color: rgb(23 23 23 / 0.9);
		color: rgb(var(--theme-font-color-dark));
	}

	:global(.hljs-section),
	:global(.hljs-title) {
		color: #ef4444 !important;
	}

	:global(.hljs-deletion),
	:global(.hljs-number),
	:global(.hljs-quote),
	:global(.hljs-selector-class),
	:global(.hljs-selector-id),
	:global(.hljs-string),
	:global(.hljs-template-tag),
	:global(.hljs-type) {
		color: #f87171 !important;
	}

	:global(.cm-s-default .cm-builtin) {
		color: #3b82f6;
	}

	:global(.input-custom),
	:global(.dark .input-custom) {
		@apply overflow-hidden;
		@apply bg-secondary-800;
		@apply border-secondary-500;
		@apply border-2;
		&:placeholder {
			@apply text-gray-400;
		}
	}
</style>
