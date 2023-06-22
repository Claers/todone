import { readable, writable, type Writable } from "svelte/store";
import type { TaskProps } from "./components/Task/Task.svelte";
// import type { TaskStatusProps } from "$lib/components/TaskStatus/TaskStatusSelect.svelte";
import type { DragPlaceholderPlace } from "$lib/components/Draggable/Draggable.svelte";

// Create a store that will be used to store tasks status
// export const tasksStatusStore: Writable<TaskStatusProps[] | undefined> = writable();

export const tasksStore: Writable<TaskProps[] | undefined> = writable();

export const pageStatusStore: Writable<string> = writable();

export const draggedTaskStore: Writable<{ dragged: TaskProps | undefined, end: TaskProps | undefined,endPosition: {x: number, y: number, pos: DragPlaceholderPlace} | undefined }> = writable({dragged : undefined, end: undefined, endPosition: undefined});

export async function setStore(store: Writable<any>, data: Response) {
    let json = await data.json();
    store.set(json);
}