import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: number;
    title: string;
    description?: string;
    type: ToastType;
}

const toasts = ref<Toast[]>([]);
let toastId = 0;

export function useToast() {
    function addToast(toast: Omit<Toast, 'id'>) {
        const id = ++toastId;
        toasts.value.push({ ...toast, id });

        // Auto remove after 3.5 seconds
        setTimeout(() => {
            removeToast(id);
        }, 3500);
    }

    function removeToast(id: number) {
        const index = toasts.value.findIndex(t => t.id === id);
        if (index > -1) {
            toasts.value.splice(index, 1);
        }
    }

    function success(title: string, description?: string) {
        addToast({ title, description, type: 'success' });
    }

    function error(title: string, description?: string) {
        addToast({ title, description, type: 'error' });
    }

    function info(title: string, description?: string) {
        addToast({ title, description, type: 'info' });
    }

    function warning(title: string, description?: string) {
        addToast({ title, description, type: 'warning' });
    }

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        info,
        warning
    };
}
