import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home({ technologies = [] }) {
    const [stats, setStats] = useState({
        total: 0,
        completed: 0
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Проверяем авторизацию
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);

        // Загружаем статистику только если авторизован
        if (loggedIn) {
            // Используем только пользовательские технологии
            const userTechnologies = technologies.filter(tech => !tech.isFromApi);
            setStats({
                total: userTechnologies.length,
                completed: userTechnologies.filter(t => t.status === 'completed').length
            });
        }


    }, [technologies]);

    return (
        <div className="page">
            <div className="hero-section">
                <h1>Добро пожаловать в Трекер технологий</h1>
                <p>Отслеживайте ваш прогресс в изучении новых технологий и фреймворков</p>

                {isLoggedIn ? (
                    <>
                        <div className="quick-stats">
                            <div className="stat">
                                <h3>{stats.total}</h3>
                                <p>Всего технологий</p>
                            </div>
                            <div className="stat">
                                <h3>{stats.completed}</h3>
                                <p>Изучено</p>
                            </div>
                            <div className="stat">
                                <h3>{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</h3>
                                <p>Общий прогресс</p>
                            </div>
                        </div>

                        <div className="cta-buttons">
                            <Link to="/dashboard" className="btn btn-primary btn-large">
                                Панель управления
                            </Link>
                            <Link to="/add-technology" className="btn btn-secondary btn-large">
                                Добавить технологию
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="cta-buttons">
                        <Link to="/login" className="btn btn-primary btn-large">
                            Войти в систему
                        </Link>
                    </div>
                )}
            </div>



            <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon"></div>
                    <h3>Авторизация</h3>
                    <p>Система авторизации для защиты ваших данных и прогресса</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"></div>
                    <h3>Отслеживание прогресса</h3>
                    <p>Возможность отметки статуса изучения каждой технологии</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"></div>
                    <h3>Персональные заметки</h3>
                    <p>Возможность добавления заметок к каждой технологии</p>
                </div>
            </div>
        </div>
    );
}

export default Home;