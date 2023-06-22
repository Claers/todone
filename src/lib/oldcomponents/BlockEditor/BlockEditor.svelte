<script lang="ts" context="module">
	export interface BlockEditorProps {}
</script>

<script lang="ts">
	import './BlockEditor.scss';
	import { createEditor } from 'svelte-editorjs';
	import { onMount } from 'svelte';
	let editor: any;
	let data: any;
	let isReady: any;
	let isEditorReady: boolean;
	onMount(async () => {
		console.log('Mounted');
		if (typeof window === 'undefined') return;
		let Header = (await import('@editorjs/header')).default;
		let Paragraph = (await import('@editorjs/paragraph')).default;
		let Quote = (await import('@editorjs/quote')).default;
		// const Header = require('@editorjs/header');
		isEditorReady = true;
		({ editor, data, isReady } = createEditor({
			tools: {
				header: Header,
				paragraph: {
					class: Paragraph,
					inlineToolbar: true
				},
				quote: Quote
			}
		}));
		await editor;
	});
	let saveTimeout: NodeJS.Timeout;
	function submitData(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			$editor.save();
		}
		if (saveTimeout) clearTimeout(saveTimeout);
	}

	function saveData() {
		saveTimeout = setTimeout(() => {
			$editor.save();
		}, 1000);
	}
</script>

<!-- {#await isEditorReady} -->
{#if isEditorReady}
	<div use:editor on:keydown={submitData} on:keyup={saveData} class="border-2" />
{/if}
<!-- {/await} -->
