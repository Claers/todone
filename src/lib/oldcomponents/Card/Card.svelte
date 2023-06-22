<script lang="ts" context="module">
	export interface CardProps {}
</script>

<script lang="ts">
	import './Card.scss';
</script>

<div class={`card p-4 variant-ghost`}>
	<slot />
</div>
