<script lang="ts" context="module">
	export interface HTMLEditorProps {}
</script>

<script lang="ts">
	import './HTMLEditor.scss';
	import Editor from '@tinymce/tinymce-svelte';
	import { toastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { fieldUpdatedToast } from '$lib/notifications';

	let conf = {
		height: 300,
		skin: 'oxide-dark',
		content_css: 'dark',
		promotion: false,
		plugins: [
			// 'a11ychecker',
			'advlist',
			'code',
			'autolink',
			// 'checklist',
			// 'export',
			'lists',
			'link',
			'image',
			'charmap',
			'preview',
			'anchor',
			'searchreplace',
			'visualblocks',
			// 'powerpaste',
			'fullscreen',
			// 'formatpainter',
			'insertdatetime',
			'media',
			'table',
			'help',
			'wordcount'
		],
		toolbar:
			'undo redo | casechange blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | ' +
			'bullist numlist outdent indent | removeformat | code table help'
	};
	export let value: string;
	let oldVal = value;
	export let saveCallback: () => Promise<void> | undefined;
	let saveTimeout: NodeJS.Timeout;
	function handleChange(e) {
		if (value === oldVal) return;
		oldVal = value;
		if (saveTimeout) clearTimeout(saveTimeout);
		saveTimeout = setTimeout(saveData, 1000);
	}

	function saveData() {
		saveTimeout = setTimeout(() => {
			if (!saveCallback) return;
			saveCallback().then(() => {
				fieldUpdatedToast('La description');
			});
		}, 1000);
	}
</script>

<div>
	<Editor
		{conf}
		bind:value
		on:change={handleChange}
		on:keydown={handleChange}
		scriptSrc="/home/flo/workspace/todone/node_modules/tinymce/tinymce.min.js"
	/>
</div>
