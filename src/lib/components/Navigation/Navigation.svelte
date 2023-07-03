<script lang="ts" context="module">
	export interface NavigationProps {}
</script>

<script lang="ts">
	import { breadcrumbsStore } from '$lib/store';

	import './Navigation.scss';
	import { drawerStore } from '@skeletonlabs/skeleton';

	function navigateTo() {
		breadcrumbsStore.set([]);
		drawerClose();
		if (window.location.pathname == '/') {
			window.location.reload();
		}
	}

	function drawerClose(): void {
		drawerStore.close();
	}
</script>

<nav class="list-nav p-4">
	<ul>
		<li><a href="/" on:click={navigateTo}>Homepage</a></li>
		<!-- <li><a href="/about" on:click={drawerClose}>About</a></li>
		<li><a href="/blog" on:click={drawerClose}>Blog</a></li>
		<li><a href="/contact" on:click={drawerClose}>Contact</a></li> -->
	</ul>
</nav>
