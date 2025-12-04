// Navigation.jsx (обновленная версия)
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation({ isLoggedIn, username, onLogout }) {
    const location = useLocation();

    // Получаем актуальное имя пользователя из localStorage
    const currentUsername = localStorage.getItem('username') || username || 'Пользователь';

    return (
        <nav className="main-navigation">
            <div className="nav-brand">
                <Link to="/">
                    <h2> Трекер технологий</h2>
                </Link>
            </div>

            <ul className="nav-menu">
                <li>
                    <Link
                        to="/"
                        className={location.pathname === '/' ? 'active' : ''}
                    >
                        Главная
                    </Link>
                </li>

                {isLoggedIn && (
                    <>
                        <li>
                            <Link
                                to="/dashboard"
                                className={location.pathname === '/dashboard' ? 'active' : ''}
                            >
                                Панель управления
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/tech-news"
                                className={location.pathname === '/tech-news' ? 'active' : ''}
                            >
                                Технологические новости
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/statistics"
                                className={location.pathname === '/statistics' ? 'active' : ''}
                            >
                                Статистика
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/settings"
                                className={location.pathname === '/settings' ? 'active' : ''}
                            >
                                Настройки
                            </Link>
                        </li>
                    </>
                )}
            </ul>

            <div className="nav-auth">
                {isLoggedIn ? (
                    <div className="user-menu">
                        <span className="username">Привет, {currentUsername}!</span>
                        <button onClick={onLogout} className="btn btn-outline logout-btn">
                            Выйти
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="btn btn-primary">
                        Войти
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navigation;