<script lang="ts" context="module">
	export interface BreadcrumsProps {}
</script>

<script lang="ts">
	import './Breadcrums.scss';
	import { breadcrumbsStore } from '$lib/store';
	import { removeBreadcrumbsAfterID } from '$lib/breadcrums';
	import { page } from '$app/stores';
	function removeBreadcrumb(id: string): void {
		removeBreadcrumbsAfterID(id, $breadcrumbsStore);
	}
</script>

<ol class="breadcrumb hidden md:block">
	{#if $breadcrumbsStore}
		{#if $breadcrumbsStore.length > 0}
			{#each $breadcrumbsStore as breadcrumb (breadcrumb)}
				{#if breadcrumb != $breadcrumbsStore[0]}
					<li class="crumb-separator" aria-hidden>&rsaquo;</li>
				{/if}
				<li class="crumb">
					<a
						on:click={() => removeBreadcrumb(breadcrumb.id)}
						class={`anchor no-underline  hover:!text-secondary-300 ${
							$page.url.pathname == breadcrumb.path ? '!text-warning-400' : '!text-primary-400'
						}`}
						href={breadcrumb.path}>{breadcrumb.name}</a
					>
				</li>
			{/each}
		{/if}
	{/if}
</ol>
