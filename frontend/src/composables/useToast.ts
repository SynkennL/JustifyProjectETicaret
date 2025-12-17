import { toast, type ToastOptions, type Id } from "vue3-toastify";

// Track active toasts by message to prevent duplicates
const activeToasts = new Map<string, Id>();

// Debounce timers for each message
const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

// Default options for all toasts
const defaultOptions: Partial<ToastOptions> = {
    autoClose: 3000,
    position: "top-right",
    closeOnClick: true,
    pauseOnHover: true,
    hideProgressBar: false,
};

// Maximum number of toasts that can be shown at once
const MAX_TOASTS = 3;
const DEBOUNCE_DELAY = 500; // ms

/**
 * Get the number of currently active toasts
 */
function getActiveToastCount(): number {
    return activeToasts.size;
}

/**
 * Clean up a toast from tracking when it closes
 */
function cleanupToast(message: string): void {
    activeToasts.delete(message);
}

/**
 * Show a toast with duplicate prevention and debouncing
 */
function showToast(
    type: "success" | "error" | "info" | "warning",
    message: string,
    options?: Partial<ToastOptions>
): Id | null {
    // Check if we've hit the maximum number of toasts
    if (getActiveToastCount() >= MAX_TOASTS) {
        // Find and remove the oldest toast
        const firstKey = activeToasts.keys().next().value;
        if (firstKey) {
            const oldToastId = activeToasts.get(firstKey);
            if (oldToastId) {
                toast.remove(oldToastId);
            }
            activeToasts.delete(firstKey);
        }
    }

    // If there's already an active toast with the same message, don't create a new one
    if (activeToasts.has(message)) {
        return activeToasts.get(message) || null;
    }

    // Clear any existing debounce timer for this message
    const existingTimer = debounceTimers.get(message);
    if (existingTimer) {
        clearTimeout(existingTimer);
        debounceTimers.delete(message);
    }

    // Create the toast with the unique ID based on message
    const toastId = `toast_${message.substring(0, 50).replace(/\s+/g, "_")}_${Date.now()}`;

    const mergedOptions: Partial<ToastOptions> = {
        ...defaultOptions,
        ...options,
        toastId,
        onClose: () => {
            cleanupToast(message);
            if (typeof options?.onClose === 'function') {
                (options.onClose as () => void)();
            }
        },
    };

    let id: Id;

    switch (type) {
        case "success":
            id = toast.success(message, mergedOptions);
            break;
        case "error":
            id = toast.error(message, mergedOptions);
            break;
        case "info":
            id = toast.info(message, mergedOptions);
            break;
        case "warning":
            id = toast.warning(message, mergedOptions);
            break;
        default:
            id = toast(message, mergedOptions);
    }

    // Track this toast
    activeToasts.set(message, id);

    return id;
}

/**
 * Show a toast with debouncing - useful for rapid actions
 */
function showToastDebounced(
    type: "success" | "error" | "info" | "warning",
    message: string,
    options?: Partial<ToastOptions>
): void {
    // Clear any existing debounce timer for this message
    const existingTimer = debounceTimers.get(message);
    if (existingTimer) {
        clearTimeout(existingTimer);
    }

    // Set a new debounce timer
    const timer = setTimeout(() => {
        showToast(type, message, options);
        debounceTimers.delete(message);
    }, DEBOUNCE_DELAY);

    debounceTimers.set(message, timer);
}

/**
 * Clear all active toasts
 */
function clearAll(): void {
    toast.clearAll();
    activeToasts.clear();
    debounceTimers.forEach((timer) => clearTimeout(timer));
    debounceTimers.clear();
}

/**
 * Remove a specific toast by message
 */
function removeByMessage(message: string): void {
    const toastId = activeToasts.get(message);
    if (toastId) {
        toast.remove(toastId);
        activeToasts.delete(message);
    }
}

/**
 * useToast composable - provides toast methods with spam protection
 */
export function useToast() {
    return {
        // Standard toast methods with duplicate prevention
        success: (message: string, options?: Partial<ToastOptions>) =>
            showToast("success", message, options),
        error: (message: string, options?: Partial<ToastOptions>) =>
            showToast("error", message, options),
        info: (message: string, options?: Partial<ToastOptions>) =>
            showToast("info", message, options),
        warning: (message: string, options?: Partial<ToastOptions>) =>
            showToast("warning", message, options),

        // Debounced toast methods - for rapid fire protection
        successDebounced: (message: string, options?: Partial<ToastOptions>) =>
            showToastDebounced("success", message, options),
        errorDebounced: (message: string, options?: Partial<ToastOptions>) =>
            showToastDebounced("error", message, options),
        infoDebounced: (message: string, options?: Partial<ToastOptions>) =>
            showToastDebounced("info", message, options),
        warningDebounced: (message: string, options?: Partial<ToastOptions>) =>
            showToastDebounced("warning", message, options),

        // Utility methods
        clearAll,
        removeByMessage,
        getActiveCount: getActiveToastCount,
    };
}

// Export a singleton instance for direct imports
export const toastService = {
    success: (message: string, options?: Partial<ToastOptions>) =>
        showToast("success", message, options),
    error: (message: string, options?: Partial<ToastOptions>) =>
        showToast("error", message, options),
    info: (message: string, options?: Partial<ToastOptions>) =>
        showToast("info", message, options),
    warning: (message: string, options?: Partial<ToastOptions>) =>
        showToast("warning", message, options),
    clearAll,
    removeByMessage,
};

export default useToast;
