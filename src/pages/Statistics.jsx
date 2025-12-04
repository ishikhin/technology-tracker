// Statistics.jsx
import React, { useState, useEffect } from 'react';
import './Statistics.css';

function Statistics({ technologies = [] }) {
    const [stats, setStats] = useState({
        total: 0,
        notStarted: 0,
        inProgress: 0,
        completed: 0
    });

    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        // Используем только пользовательские технологии (не из API)
        const userTechnologies = technologies.filter(tech => !tech.isFromApi);

        const newStats = {
            total: userTechnologies.length,
            notStarted: userTechnologies.filter(t => t.status === 'not-started').length,
            inProgress: userTechnologies.filter(t => t.status === 'in-progress').length,
            completed: userTechnologies.filter(t => t.status === 'completed').length
        };
        setStats(newStats);

    }, [technologies]);

    const calculatePercentage = (count) => {
        return stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
    };

    return (
        <div className="page">
            <div className="stats-header">
                <h1>Статистика прогресса</h1>
                <p>Анализ вашего обучения и достижений</p>
            </div>

            <div className="stats-tabs">
                <button
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                     Обзор
                </button>
            </div>

            {activeTab === 'overview' && (
                <>
                    {/* Карточки статистики как в Dashboard */}
                    <div className="stats-overview">
                        <div className="stat-card total">
                            <div className="stat-icon"></div>
                            <div className="stat-content">
                                <h3>{stats.total}</h3>
                                <p>Всего технологий</p>
                            </div>
                        </div>

                        <div className="stat-card not-started">
                            <div className="stat-icon"></div>
                            <div className="stat-content">
                                <h3>{stats.notStarted}</h3>
                                <p>Не начато</p>
                            </div>
                        </div>

                        <div className="stat-card in-progress">
                            <div className="stat-icon"></div>
                            <div className="stat-content">
                                <h3>{stats.inProgress}</h3>
                                <p>В процессе</p>
                            </div>
                        </div>

                        <div className="stat-card completed">
                            <div className="stat-icon"></div>
                            <div className="stat-content">
                                <h3>{stats.completed}</h3>
                                <p>Завершено</p>
                            </div>
                        </div>
                    </div>

                    {/* Прогресс бар как в Dashboard */}
                    <div className="progress-summary">
                        <h4>Ваш прогресс</h4>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                            ></div>
                        </div>
                        <div className="progress-text">
                            {stats.completed} из {stats.total} завершено ({stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%)
                        </div>
                    </div>

                </>
            )}

            {stats.total === 0 && (
                <div className="empty-state">
                    <p>Нет данных для отображения статистики.</p>
                    <p>Добавьте технологии для отслеживания прогресса.</p>
                </div>
            )}
        </div>
    );
}

export default Statistics;