import { useCallback } from 'react';

// Хук для удобного использования уведомлений

    // Показать успешное уведомление
    const showSuccess = useCallback((message) => {
        showNotification(message, 'success');
    }, [showNotification]);

    // Показать уведомление об ошибке
    const showError = useCallback((message) => {
        showNotification(message, 'error');
    }, [showNotification]);

    // Показать предупреждение
    const showWarning = useCallback((message) => {
        showNotification(message, 'warning');
    }, [showNotification]);

    // Показать информационное уведомление
    const showInfo = useCallback((message) => {
        showNotification(message, 'info');
    }, [showNotification]);

    return {
        showSuccess,
        showError,
        showWarning,
        showInfo
    };
};