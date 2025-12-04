// src/contexts/NotificationProvider.jsx
import React, { createContext, useContext, useState } from 'react';
import {
    Snackbar,
    Alert,
    IconButton,
    useMediaQuery,
    useTheme,
    Box
} from '@mui/material';
import {
    Close as CloseIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
    Info as InfoIcon
} from '@mui/icons-material';

const NotificationContext = createContext();

// Иконки для разных типов уведомлений
const iconMap = {
    success: CheckCircleIcon,
    error: ErrorIcon,
    warning: WarningIcon,
    info: InfoIcon
};

// Цвета для разных типов уведомлений (Material Design)
const alertSeverity = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
};

export function NotificationProvider({ children }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        type: 'info', // 'success', 'error', 'warning', 'info'
        duration: 5000,
        vertical: 'bottom',
        horizontal: isMobile ? 'center' : 'right'
    });

    const showNotification = (message, type = 'info', duration = 5000) => {
        setNotification({
            open: true,
            message,
            type,
            duration,
            vertical: 'bottom',
            horizontal: isMobile ? 'center' : 'right'
        });
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    const IconComponent = iconMap[notification.type] || InfoIcon;

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <Snackbar
                open={notification.open}
                autoHideDuration={notification.duration}
                onClose={hideNotification}
                anchorOrigin={{
                    vertical: notification.vertical,
                    horizontal: notification.horizontal
                }}
                sx={{
                    '& .MuiSnackbarContent-root': {
                        borderRadius: 2,
                        boxShadow: 3
                    }
                }}
                ClickAwayListenerProps={{
                    onClickAway: hideNotification
                }}
            >
                <Alert
                    severity={alertSeverity[notification.type] || 'info'}
                    variant="filled"
                    onClose={hideNotification}
                    icon={<IconComponent />}
                    sx={{
                        width: '100%',
                        maxWidth: isMobile ? '90vw' : '400px',
                        alignItems: 'center',
                        '& .MuiAlert-icon': {
                            fontSize: 24,
                            alignItems: 'center'
                        },
                        '& .MuiAlert-message': {
                            flexGrow: 1,
                            display: 'flex',
                            alignItems: 'center',
                            minHeight: '40px'
                        }
                    }}
                    action={
                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={hideNotification}
                            aria-label="Закрыть уведомление"
                            sx={{ ml: 1 }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    <Box sx={{ py: 0.5 }}>
                        {notification.message}
                    </Box>
                </Alert>
            </Snackbar>
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