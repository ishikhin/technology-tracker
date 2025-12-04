import React from 'react';
import './ProgressHeader.css';

function ProgressHeader({ technologies }) {
    const totalTechnologies = technologies.length;
    const completedTechnologies = technologies.filter(tech => tech.status === 'completed').length;
    const inProgressTechnologies = technologies.filter(tech => tech.status === 'in-progress').length;
    const notStartedTechnologies = technologies.filter(tech => tech.status === 'not-started').length;

    const completionPercentage = totalTechnologies > 0
        ? Math.round((completedTechnologies / totalTechnologies) * 100)
        : 0;

    const getProgressLevel = () => {
        if (completionPercentage >= 80) return 'excellent';
        if (completionPercentage >= 50) return 'good';
        if (completionPercentage >= 20) return 'average';
        return 'beginner';
    };

    const getProgressMessage = () => {
        switch (getProgressLevel()) {
            case 'excellent':
                return 'Отличный прогресс! 🎉';
            case 'good':
                return 'Хорошие результаты! 💪';
            case 'average':
                return 'Продолжайте в том же духе! 🔥';
            case 'beginner':
                return 'Время начинать! 🚀';
            default:
                return 'Начните свой путь! 📚';
        }
    };

    return (
        <div className="progress-header">
            <div className="progress-header__stats">
                <div className="stat-card">
                    <div className="stat-card__value">{totalTechnologies}</div>
                    <div className="stat-card__label">Всего технологий</div>
                </div>
                <div className="stat-card stat-card--completed">
                    <div className="stat-card__value">{completedTechnologies}</div>
                    <div className="stat-card__label">Изучено</div>
                </div>
                <div className="stat-card stat-card--in-progress">
                    <div className="stat-card__value">{inProgressTechnologies}</div>
                    <div className="stat-card__label">В процессе</div>
                </div>
                <div className="stat-card stat-card--not-started">
                    <div className="stat-card__value">{notStartedTechnologies}</div>
                    <div className="stat-card__label">Осталось</div>
                </div>
            </div>

            <div className="progress-header__progress">
                <div className="progress-info">
                    <div className="progress-info__header">
                        <span className="progress-info__percentage">{completionPercentage}%</span>
                        <span className="progress-info__message">{getProgressMessage()}</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className={`progress-bar__fill progress-bar__fill--${getProgressLevel()}`}
                            style={{ width: `${completionPercentage}%` }}
                        ></div>
                    </div>
                    <div className="progress-details">
                        <span>Вы изучили {completedTechnologies} из {totalTechnologies} технологий</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProgressHeader;