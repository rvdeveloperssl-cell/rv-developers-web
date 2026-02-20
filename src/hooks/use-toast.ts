import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant || 'default',
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);

    // Also log to console for debugging
    if (options.variant === 'destructive') {
      console.error(`[Toast] ${options.title}: ${options.description}`);
    } else {
      console.log(`[Toast] ${options.title}: ${options.description}`);
    }
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    toasts,
    toast,
    dismiss,
  };
}

// Simple toast function for non-React contexts
let toastCallback: ((options: ToastOptions) => void) | null = null;

export function setToastCallback(callback: (options: ToastOptions) => void) {
  toastCallback = callback;
}

export function showToast(options: ToastOptions) {
  if (toastCallback) {
    toastCallback(options);
  } else {
    // Fallback to console
    if (options.variant === 'destructive') {
      console.error(`[Toast] ${options.title}: ${options.description}`);
    } else {
      console.log(`[Toast] ${options.title}: ${options.description}`);
    }
  }
}
