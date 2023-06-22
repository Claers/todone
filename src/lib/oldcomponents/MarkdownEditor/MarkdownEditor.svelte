<script lang="ts" context="module">
	export interface MarkdownEditorProps {}
</script>

<script lang="ts">
	import { Editor, Viewer } from 'bytemd';
	import gfm from '@bytemd/plugin-gfm';
	import highlight from '@bytemd/plugin-highlight-ssr';
	import gemoji from '@bytemd/plugin-gemoji';
	import mediumZoom from '@bytemd/plugin-medium-zoom';
	import 'highlight.js/styles/default.css';

	import { fieldUpdatedToast } from '$lib/notifications';

	export let value;
	export let saveCallback: () => Promise<void> | undefined;
	let saveTimeout: NodeJS.Timeout;
	const plugins = [
		gfm(),
		highlight(),
		gemoji(),
		mediumZoom()
		// Add more plugins here
	];

	function handleChange(e) {
		if (value === e.detail.value) return;
		value = e.detail.value;
		if (saveTimeout) clearTimeout(saveTimeout);
		saveTimeout = setTimeout(saveData, 1000);
	}

	function saveData() {
		saveTimeout = setTimeout(() => {
			if (!saveCallback) return;
			saveCallback().then(() => {
				fieldUpdatedToast('Les Informations');
			});
		}, 1000);
	}
</script>

<template>
	<div
		class="prose-h1:h1 prose-h2:h2 prose-h3:h3 prose-h4:h4 prose-h5:h5
		prose-blockquote:blockquote prose-pre:pre
		prose-li:list-item prose-ol:list-decimal prose-ol:list-inside prose-ul:list-disc prose-ul:list-inside
		prose-table:table dark:prose-invert prose-a:text-blue-500 hover:prose-a:text-blue-400
		prose-headings:mb-4 prose-headings:mt-2
		"
	>
		<Editor {value} {plugins} on:change={handleChange} />
	</div>
</template>
