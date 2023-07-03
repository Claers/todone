import type { TaskProps } from "$lib/components/Task/Task.svelte";
import { modalStore } from '@skeletonlabs/skeleton';
import type { ModalSettings } from '@skeletonlabs/skeleton';
import { useQueryClient } from '@tanstack/svelte-query';

export async function setTaskDone(task: TaskProps, isTaskDone: boolean, queryClient:ReturnType<typeof useQueryClient>): Promise<void> {
    await fetch(`/api/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: task.id,
            done: isTaskDone
        })
    })
        .then((res) => res.json())
        .then((res) => {
        })
        .catch((err) => console.error(err));
    queryClient.refetchQueries('tasks');
}

export async function deleteTask(task: TaskProps, queryClient: ReturnType<typeof useQueryClient>) {
    return new Promise<boolean>((resolve) => {
        const modal: ModalSettings = {
            type: 'confirm',
            title: 'Etes-vous sûr de vouloir supprimer cette tâche ?',
            body: 'Cette action est irréversible',
            modalClasses: 'card shadow-md rounded-md',
            backdropClasses: 'bg-gray-500 bg-opacity-30',
            buttonTextConfirm: 'Supprimer',
            buttonPositive: "bg-error-500",
            response: (r: boolean) => {
                if (!r) return;
                fetch(`/api/tasks`, {
                    method: 'POST',
                    body: JSON.stringify({
                        id: task.id,
                        delete: true
                    })
                })
                .then((res) => res.json())
                .then((res) => {
                    queryClient.refetchQueries('tasks');
                })
                .catch((err) => console.error(err));
                resolve(r)
            }
        };
        modalStore.trigger(modal);
    });
}

export async function editTask(task: TaskProps, queryClient: ReturnType<typeof useQueryClient>) {
    if (task.dueDate) {
        task.dueDate = new Date(task.dueDate);
    }
    await fetch(`/api/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
        .then((res) => res.json())
        .then((res) => {
            queryClient.refetchQueries('tasks');
        })
        .catch((err) => console.error(err));
    await queryClient.refetchQueries('tasks');
}

export async function editTaskBatch(tasks: TaskProps[], queryClient: ReturnType<typeof useQueryClient>) {
    await fetch(`/api/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tasks)
    })
        .then((res) => res.json())
        .then((res) => {
            queryClient.refetchQueries('tasks');
        })
        .catch((err) => console.error(err));
    await queryClient.refetchQueries('tasks');
}