import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import { NotificationProvider } from './components/NotificationSystem';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TechNews from './pages/TechNews';
import NotFound from './pages/NotFound';
import './App.css';

function AppContent() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [localTechnologies, setLocalTechnologies] = useState([]);
    const [isAuthChecking, setIsAuthChecking] = useState(true); // Новое состояние

    // Функция для обновления локальных технологий
    const updateLocalTechnologies = (newTechnologies) => {
        setLocalTechnologies(newTechnologies);
    };

    // Загружаем локальные технологии при монтировании
    useEffect(() => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            try {
                const localTech = JSON.parse(saved);
                setLocalTechnologies(localTech);
            } catch (error) {
                console.error('Ошибка загрузки локальных технологий:', error);
            }
        }
    }, []);

    // Проверяем авторизацию при загрузке
    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const user = localStorage.getItem('username') || '';
        setIsLoggedIn(loggedIn);
        setUsername(user);
        setIsAuthChecking(false); // Завершаем проверку
    }, []);

    const handleLogin = (user) => {
        setIsLoggedIn(true);
        setUsername(user);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', user);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
    };

    // Функция для добавления новой технологии
    const handleAddTechnology = (newTechnology) => {
        const updatedTechnologies = [...localTechnologies, newTechnology];
        setLocalTechnologies(updatedTechnologies);
        localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));
    };

    // Пока идет проверка авторизации - показываем загрузку
    if (isAuthChecking) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Загрузка...</p>
            </div>
        );
    }

    return (
        <div className="app">
            <Navigation
                isLoggedIn={isLoggedIn}
                username={username}
                onLogout={handleLogout}
            />
            <main className="main-content">
                <Routes>
                    {/* Публичные маршруты */}
                    <Route
                        path="/"
                        element={<Home technologies={localTechnologies} />}
                    />
                    <Route
                        path="/login"
                        element={
                            isLoggedIn ?
                                <Navigate to="/" replace /> :
                                <Login onLogin={handleLogin} />
                        }
                    />

                    {/* Защищенные маршруты */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn} isChecking={isAuthChecking}>
                                <Dashboard
                                    technologies={localTechnologies}
                                    onLocalTechnologiesUpdate={updateLocalTechnologies}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tech-news"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn} isChecking={isAuthChecking}>
                                <TechNews />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/technology/:techId"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn} isChecking={isAuthChecking}>
                                <TechnologyDetail technologies={localTechnologies} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/add-technology"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn} isChecking={isAuthChecking}>
                                <AddTechnology onTechnologyAdd={handleAddTechnology} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/statistics"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn} isChecking={isAuthChecking}>
                                <Statistics technologies={localTechnologies} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn} isChecking={isAuthChecking}>
                                <Settings />
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback для несуществующих маршрутов */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <NotificationProvider>
                <Router>
                    <AppContent />
                </Router>
            </NotificationProvider>
        </ThemeProvider>
    );
}

export default App;