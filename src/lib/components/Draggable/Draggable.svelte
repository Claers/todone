<script lang="ts" context="module">
	export interface DraggableProps {}
	export enum DragDirection {
		Horizontal,
		Vertical
	}
	export enum DragPlaceholderPlace {
		Before,
		After
	}
</script>

<script lang="ts">
	import './Draggable.scss';
	import { draggedTaskStore } from '$lib/store';
	import { createEventDispatcher } from 'svelte';
	import Device from 'svelte-device-info';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

	let className: string;
	export let draggedElement: any;
	export let endCard: any;
	export let endPosition: { x: number; y: number; pos: DragPlaceholderPlace };

	export { className as class };
	export let card: any;
	export let dragDirection: DragDirection = DragDirection.Horizontal;

	const dispatch = createEventDispatcher();

	function onDragEnd() {
		dispatch('onDragEnd');
	}

	draggedTaskStore.subscribe((dragElements) => {
		if (dragElements.end == card) {
			if (!dragElements.endPosition) return;
			// Get component size
			let draggableComponent = document.querySelector('.draggable');
			if (!draggableComponent) return;
			let size = draggableComponent.getBoundingClientRect();
			if (dragDirection == DragDirection.Horizontal) {
				if (dragElements.endPosition?.x > size.x / 2) {
					dragElements.endPosition.pos = DragPlaceholderPlace.After;
				} else {
					dragElements.endPosition.pos = DragPlaceholderPlace.Before;
				}
			} else {
				
				if (dragElements.endPosition?.y > size.height / 2) {
					dragElements.endPosition.pos = DragPlaceholderPlace.After;
				} else {
					dragElements.endPosition.pos = DragPlaceholderPlace.Before;
				}
			}
		}
	});

	let size: number;
</script>

<svelte:window bind:innerWidth={size} />
<div
	draggable="true"
	class={className}
	on:dragover|preventDefault={(event) => {
		// If event don't have offsetX, offsetY, it's a touch event so calc
		// the position based on the clientX, clientY and the component position
		if (!event.offsetX) {
			let offsetX = event.clientX - event.target.getBoundingClientRect().left;
			let offsetY = event.clientY - event.target.getBoundingClientRect().top;
			endPosition = { x: offsetX, y: offsetY, pos: DragPlaceholderPlace.Before };
		} else {
			endPosition = { x: event.offsetX, y: event.offsetY, pos: DragPlaceholderPlace.Before };
		}
	}}
	on:dragstart={() => (draggedElement = card)}
	on:dragenter={() => {
		endCard = card;
	}}
	on:dragend={onDragEnd}
>
	{#if dragDirection == DragDirection.Horizontal && endCard == card && endPosition?.pos == DragPlaceholderPlace.Before && endCard != draggedElement}
		<div class="border-x-2 border-surface-500 rounded-sm h-full w-1" />
	{/if}
	{#if dragDirection == DragDirection.Vertical && endCard == card && endPosition?.pos == DragPlaceholderPlace.Before && endCard != draggedElement}
		<div class="border-y-2 border-surface-500 rounded-sm w-full h-1" />
	{/if}
	<slot />
	{#if dragDirection == DragDirection.Horizontal && endCard == card && endPosition?.pos == DragPlaceholderPlace.After && endCard != draggedElement}
		<div class="border-x-2 border-surface-500 rounded-sm h-full w-1" />
	{/if}

	{#if dragDirection == DragDirection.Vertical && endCard == card && endPosition?.pos == DragPlaceholderPlace.After && endCard != draggedElement}
		<div class="border-y-2 border-surface-500 rounded-sm w-full h-1" />
	{/if}
</div>
