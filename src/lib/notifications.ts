import { toastStore } from '@skeletonlabs/skeleton';
import type { ToastSettings } from '@skeletonlabs/skeleton';

export function fieldUpdatedToast(fieldName: string): ToastSettings {
    const toastSettings: ToastSettings = {
        message: `${fieldName} a été mis à jour`,
        timeout: 3000,
    };
    toastStore.trigger(toastSettings);
    return toastSettings;
}


export function errorToast(error: string): ToastSettings {
    const toastSettings: ToastSettings = {
        message: error,
        background: 'bg-red-600',
    };
    toastStore.trigger(toastSettings);
    return toastSettings;
}