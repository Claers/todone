<script lang="ts" context="module">
	export interface ResisableTextAreaProps {}
</script>

<script lang="ts">
	let className = '';
	export { className as class };
	export let rows: string = '4';
	export let name = 'description';
	export let value: string = '';
	export let placeholder = 'Description';
	let resizeAreaStyle =
		'event.target.style.height = "";event.target.style.height = event.target.scrollHeight + "px"';
</script>

<textarea
	class={`input input-custom rounded-md ${className}`}
	{rows}
	{name}
	bind:value
	{placeholder}
	on:input={(event) => {
		eval(resizeAreaStyle);
	}}
/>
