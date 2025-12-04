import { createContext, useContext, useState } from 'react';
import './NotificationSystem.css';

const NotificationContext = createContext();

// Провайдер уведомлений
export function NotificationProvider({ children }) {
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        type: 'info' // 'success', 'error', 'warning', 'info'
    });

    const showNotification = (message, type = 'info') => {
        setNotification({
            open: true,
            message,
            type
        });

        // Автоматическое закрытие через 5 секунд
        setTimeout(() => {
            setNotification(prev => ({ ...prev, open: false }));
        }, 5000);
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification.open && (
                <div className={`notification notification-${notification.type}`}>
                    <div className="notification-content">
                        <span className="notification-message">{notification.message}</span>
                        <button
                            className="notification-close"
                            onClick={hideNotification}
                            aria-label="Закрыть уведомление"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
}

// Хук для использования уведомлений
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};