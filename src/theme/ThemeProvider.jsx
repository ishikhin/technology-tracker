// src/theme/ThemeProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Загружаем предпочтение темы из localStorage
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark' ||
            (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    // Сохраняем тему в localStorage при изменении
    useEffect(() => {
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');

        // Добавляем класс к body для поддержки CSS переменных
        document.body.classList.toggle('dark-mode', darkMode);
        document.body.classList.toggle('light-mode', !darkMode);
    }, [darkMode]);

    // Создаем тему Material-UI с новой цветовой гаммой темной темы
    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: darkMode ? '#6366f1' : '#3b82f6',
                light: darkMode ? '#818cf8' : '#60a5fa',
                dark: darkMode ? '#4f46e5' : '#2563eb',
                contrastText: darkMode ? '#1e293b' : '#ffffff',
            },
            secondary: {
                main: darkMode ? '#10b981' : '#059669',
                light: darkMode ? '#34d399' : '#10b981',
                dark: darkMode ? '#059669' : '#047857',
                contrastText: '#ffffff',
            },
            background: {
                default: darkMode ? '#0f172a' : '#f8fafc',
                paper: darkMode ? '#1e293b' : '#ffffff',
            },
            text: {
                primary: darkMode ? '#000000' : '#0f172a',
                secondary: darkMode ? '#cbd5e1' : '#475569',
                disabled: darkMode ? '#000000' : '#94a3b8',
            },
            error: {
                main: darkMode ? '#ef4444' : '#dc2626',
            },
            warning: {
                main: darkMode ? '#f59e0b' : '#d97706',
            },
            info: {
                main: darkMode ? '#0ea5e9' : '#0284c7',
            },
            success: {
                main: darkMode ? '#10b981' : '#059669',
            },
            divider: darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)',
            action: {
                active: darkMode ? '#94a3b8' : '#64748b',
                hover: darkMode ? 'rgba(148, 163, 184, 0.08)' : 'rgba(100, 116, 139, 0.04)',
                selected: darkMode ? 'rgba(148, 163, 184, 0.16)' : 'rgba(100, 116, 139, 0.08)',
                disabled: darkMode ? 'rgba(148, 163, 184, 0.3)' : 'rgba(100, 116, 139, 0.26)',
                disabledBackground: darkMode ? 'rgba(148, 163, 184, 0.12)' : 'rgba(100, 116, 139, 0.12)',
            },
        },
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontSize: 14,
            h1: {
                fontSize: '2.5rem',
                fontWeight: 500,
                letterSpacing: '-0.01562em',
            },
            h2: {
                fontSize: '2rem',
                fontWeight: 500,
                letterSpacing: '-0.00833em',
            },
            h3: {
                fontSize: '1.75rem',
                fontWeight: 500,
            },
            h4: {
                fontSize: '1.5rem',
                fontWeight: 500,
            },
            h5: {
                fontSize: '1.25rem',
                fontWeight: 500,
            },
            h6: {
                fontSize: '1rem',
                fontWeight: 500,
            },
            body1: {
                fontSize: '1rem',
                lineHeight: 1.5,
            },
            body2: {
                fontSize: '0.875rem',
                lineHeight: 1.43,
            },
            button: {
                textTransform: 'none',
                fontWeight: 500,
            },
        },
        shape: {
            borderRadius: 8,
        },
        spacing: 8,
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 900,
                lg: 1200,
                xl: 1536,
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        textTransform: 'none',
                        fontWeight: 500,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 4,
                        },
                    },
                    contained: {
                        boxShadow: 2,
                    },
                    outlined: {
                        borderWidth: 2,
                        '&:hover': {
                            borderWidth: 2,
                        },
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            transform: 'translateY(-4px)',
                        },
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: darkMode ? '#f8fafc' : '#3b82f6', // В темной теме белый фон
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        color: darkMode ? '#1e293b' : '#ffffff', // В темной теме темный текст
                    },
                },
            },
            MuiToolbar: {
                styleOverrides: {
                    root: {
                        '@media (min-width: 600px)': {
                            minHeight: '64px',
                        },
                    },
                },
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 8,
                        },
                    },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: 16,
                    },
                },
            },
            MuiSnackbar: {
                styleOverrides: {
                    root: {
                        '& .MuiAlert-root': {
                            borderRadius: 8,
                        },
                    },
                },
            },
            MuiLinearProgress: {
                styleOverrides: {
                    root: {
                        borderRadius: 4,
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 6,
                    },
                },
            },
            // Дополнительные стили для элементов в AppBar
            MuiIconButton: {
                styleOverrides: {
                    root: {
                        color: darkMode ? '#1e293b' : '#ffffff', // Цвет иконок в AppBar
                        '&:hover': {
                            backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.08)' : 'rgba(255, 255, 255, 0.1)',
                        },
                    },
                },
            },
            MuiTypography: {
                styleOverrides: {
                    root: {
                        '&.MuiTypography-h6': {
                            color: darkMode ? '#1e293b' : '#ffffff',
                        },
                    },
                },
            },
        },
    });

    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
};

// Кастомный хук для использования темы
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};