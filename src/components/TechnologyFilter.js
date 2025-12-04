import React from 'react';
import './TechnologyFilter.css';

function TechnologyFilter({ activeFilter, onFilterChange, technologies }) {
    const filterStats = {
        all: technologies.length,
        completed: technologies.filter(tech => tech.status === 'completed').length,
        'in-progress': technologies.filter(tech => tech.status === 'in-progress').length,
        'not-started': technologies.filter(tech => tech.status === 'not-started').length,
    };

    const filters = [
        { key: 'all', label: 'Все технологии', emoji: '📚' },
        { key: 'not-started', label: 'Не начатые', emoji: '⏳' },
        { key: 'in-progress', label: 'В процессе', emoji: '🔄' },
        { key: 'completed', label: 'Изучено', emoji: '✅' },
    ];

    return (
        <div className="technology-filter">
            <div className="technology-filter__tabs">
                {filters.map(filter => (
                    <button
                        key={filter.key}
                        className={`technology-filter__tab ${
                            activeFilter === filter.key ? 'technology-filter__tab--active' : ''
                        }`}
                        onClick={() => onFilterChange(filter.key)}
                    >
                        <span className="technology-filter__emoji">{filter.emoji}</span>
                        <span className="technology-filter__label">{filter.label}</span>
                        <span className="technology-filter__count">({filterStats[filter.key]})</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default TechnologyFilter;