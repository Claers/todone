<script lang="ts" context="module">
	export interface DraggableProps {}
	export enum DragPlaceholderPlace {
		Right,
		Left
	}
</script>

<script lang="ts">
	import { flip } from 'svelte/animate';
	import './Draggable.scss';
	import { draggedTaskStore } from '$lib/store';

	let className: string;
	const dragDuration = 300;
	export let draggedElement: any;
	export let endCard: any;
	export let endPosition: any;

	export { className as class };
	export let card: any;
	export let releaseCallback: any;

	draggedTaskStore.subscribe((dragElements) => {
		if (dragElements.end == card) {
			// Get component size
			let draggableComponent = document.querySelector('.draggable');
			let size = draggableComponent.getBoundingClientRect();
			if (dragElements.endPosition?.x > size.x / 2) {
				dragElements.endPosition.pos = DragPlaceholderPlace.Right;
			} else {
				dragElements.endPosition.pos = DragPlaceholderPlace.Left;
			}
		}
	});
</script>

{#if endPosition == DragPlaceholderPlace.Left}
	<div class="border-x-2" />
{/if}
<div
	draggable="true"
	class={className}
	on:dragover|preventDefault={(event) => {
		endPosition = { x: event.offsetX, y: event.offsetY, pos: DragPlaceholderPlace.Left };
	}}
	on:dragstart={() => (draggedElement = card)}
	on:dragenter={() => {
		endCard = card;
	}}
	on:dragend={releaseCallback(draggedElement, endCard)}
>
	<slot />
</div>
{#if endPosition == DragPlaceholderPlace.Right}
	<div class="border-x-2" />
{/if}
