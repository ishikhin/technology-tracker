import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BulkStatusEditor from '../components/BulkStatusEditor';
import './Dashboard.css';

function Dashboard({ technologies = [], onLocalTechnologiesUpdate }) {
    const [stats, setStats] = useState({
        total: 0,
        notStarted: 0,
        inProgress: 0,
        completed: 0
    });

    const [filteredTechnologies, setFilteredTechnologies] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [randomTech, setRandomTech] = useState(null);
    const [importError, setImportError] = useState(null);

    // Обновляем отфильтрованные технологии при изменении данных
    useEffect(() => {
        filterTechnologies(activeFilter);

        // Статистика по локальным технологиям
        const notStarted = technologies.filter(t => t.status === 'not-started').length;
        const inProgress = technologies.filter(t => t.status === 'in-progress').length;
        const completed = technologies.filter(t => t.status === 'completed').length;

        setStats({
            total: technologies.length,
            notStarted,
            inProgress,
            completed
        });
    }, [technologies, activeFilter, searchQuery]);

    // Функция фильтрации технологий
    const filterTechnologies = (filterType) => {
        setActiveFilter(filterType);

        let filtered = technologies;

        // Применяем поиск если есть запрос
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            filtered = technologies.filter(tech =>
                tech.title.toLowerCase().includes(searchLower) ||
                tech.description.toLowerCase().includes(searchLower) ||
                (tech.notes && tech.notes.toLowerCase().includes(searchLower))
            );
        }

        // Применяем фильтр по статусу
        switch (filterType) {
            case 'not-started':
                filtered = filtered.filter(tech => tech.status === 'not-started');
                break;
            case 'in-progress':
                filtered = filtered.filter(tech => tech.status === 'in-progress');
                break;
            case 'completed':
                filtered = filtered.filter(tech => tech.status === 'completed');
                break;
            case 'all':
            default:
                // Все технологии уже показаны
                break;
        }

        setFilteredTechnologies(filtered);
    };

    // Обработчик изменения поискового запроса
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    };

    // Очистка поиска
    const clearSearch = () => {
        setSearchQuery('');
    };

    // Обновление статуса технологии
    const updateStatus = (techId, newStatus) => {
        const updated = technologies.map(tech =>
            tech.id === techId ? { ...tech, status: newStatus } : tech
        );

        localStorage.setItem('technologies', JSON.stringify(updated));
        if (onLocalTechnologiesUpdate) {
            onLocalTechnologiesUpdate(updated);
        }
    };

    // Массовое обновление статусов
    const handleBulkStatusUpdate = (techIds, newStatus) => {
        const updated = technologies.map(tech =>
            techIds.includes(tech.id) ? { ...tech, status: newStatus } : tech
        );

        localStorage.setItem('technologies', JSON.stringify(updated));
        if (onLocalTechnologiesUpdate) {
            onLocalTechnologiesUpdate(updated);
        }

        alert(`Статусы ${techIds.length} технологий успешно обновлены!`);
    };

    // Обновление заметок
    const updateNotes = (techId, newNotes) => {
        const updated = technologies.map(tech =>
            tech.id === techId ? { ...tech, notes: newNotes } : tech
        );

        localStorage.setItem('technologies', JSON.stringify(updated));
        if (onLocalTechnologiesUpdate) {
            onLocalTechnologiesUpdate(updated);
        }
    };

    // Функция удаления технологии
    const deleteTechnology = (techId) => {
        const updated = technologies.filter(tech => tech.id !== techId);
        localStorage.setItem('technologies', JSON.stringify(updated));
        if (onLocalTechnologiesUpdate) {
            onLocalTechnologiesUpdate(updated);
        }
        setShowDeleteConfirm(null);
        alert('Технология удалена!');
    };

    // Функция: Отметить все как выполненные
    const markAllAsCompleted = () => {
        if (technologies.length === 0) {
            alert('Нет технологий для отметки!');
            return;
        }

        const updated = technologies.map(tech => ({
            ...tech,
            status: 'completed'
        }));

        localStorage.setItem('technologies', JSON.stringify(updated));
        if (onLocalTechnologiesUpdate) {
            onLocalTechnologiesUpdate(updated);
        }

        alert(`Все технологии (${updated.length}) отмечены как завершенные!`);
    };

    // Функция: Сбросить все статусы
    const resetAllStatuses = () => {
        if (technologies.length === 0) {
            alert('Нет технологий для сброса!');
            return;
        }

        const updated = technologies.map(tech => ({
            ...tech,
            status: 'not-started'
        }));

        localStorage.setItem('technologies', JSON.stringify(updated));
        if (onLocalTechnologiesUpdate) {
            onLocalTechnologiesUpdate(updated);
        }

        alert(`Статусы всех технологий (${updated.length}) сброшены!`);
    };

    // Функция: Случайный выбор следующей технологии
    const getRandomNextTechnology = () => {
        const notStartedTech = technologies.filter(tech => tech.status === 'not-started');

        if (notStartedTech.length === 0) {
            alert('Поздравляем! Все технологии уже начаты или завершены!');
            return;
        }

        const randomIndex = Math.floor(Math.random() * notStartedTech.length);
        const selectedTech = notStartedTech[randomIndex];

        setRandomTech(selectedTech);

        // Автоматически меняем статус на "в процессе"
        updateStatus(selectedTech.id, 'in-progress');

        alert(`Случайный выбор: "${selectedTech.title}"\nСтатус изменен на "В процессе"`);
    };

    // Функция экспорта данных
    const handleExportData = () => {
        if (technologies.length === 0) {
            alert('Нет данных для экспорта!');
            return;
        }

        try {
            const data = {
                exportedAt: new Date().toISOString(),
                version: '1.0',
                exportType: 'technologies',
                technologies: technologies
            };

            const dataStr = JSON.stringify(data, null, 2);

            // Проверяем валидность JSON
            JSON.parse(dataStr);

            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            alert(`Данные успешно экспортированы!\nФайл: ${a.download}`);

        } catch (error) {
            alert(`Ошибка при экспорте: ${error.message}`);
            console.error('Ошибка экспорта:', error);
        }
    };

    // Функция импорта данных
    const handleImportData = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Проверяем размер файла (максимум 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Файл слишком большой. Максимальный размер: 5MB');
            return;
        }

        // Проверяем расширение
        if (!file.name.endsWith('.json')) {
            alert('Неверный формат файла. Ожидается JSON файл (.json)');
            return;
        }

        setImportError(null);
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                let technologiesToImport;

                // Проверяем разные форматы файлов
                if (Array.isArray(imported)) {
                    // Просто массив технологий
                    technologiesToImport = imported;
                } else if (imported.technologies && Array.isArray(imported.technologies)) {
                    // Структурированный экспорт
                    technologiesToImport = imported.technologies;
                } else {
                    throw new Error('Неверный формат файла. Ожидается JSON с массивом технологий');
                }

                // Валидация каждой технологии
                technologiesToImport.forEach((tech, index) => {
                    if (!tech.title || typeof tech.title !== 'string') {
                        throw new Error(`Технология №${index + 1} не имеет корректного названия`);
                    }

                    if (tech.title.trim().length < 2) {
                        throw new Error(`Название технологии "${tech.title}" слишком короткое (минимум 2 символа)`);
                    }

                    if (!tech.description || typeof tech.description !== 'string') {
                        throw new Error(`Технология "${tech.title}" не имеет описания`);
                    }

                    // Проверяем статус
                    if (tech.status && !['not-started', 'in-progress', 'completed'].includes(tech.status)) {
                        throw new Error(`Технология "${tech.title}" имеет недопустимый статус: ${tech.status}`);
                    }

                    // Проверяем ID
                    if (tech.id && typeof tech.id !== 'number') {
                        throw new Error(`Технология "${tech.title}" имеет некорректный ID`);
                    }
                });

                // Преобразуем данные
                const processedTechnologies = technologiesToImport.map(tech => ({
                    id: tech.id || Date.now() + Math.floor(Math.random() * 1000),
                    title: tech.title.trim(),
                    description: tech.description.trim(),
                    status: tech.status || 'not-started',
                    notes: tech.notes || '',
                    category: tech.category || 'other',
                    difficulty: tech.difficulty || 'beginner',
                    priority: tech.priority || 'medium',
                    deadline: tech.deadline || '',
                    estimatedHours: tech.estimatedHours || '',
                    createdAt: tech.createdAt || new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    isFromApi: false
                }));

                // Вопрос пользователю: заменить или добавить?
                const shouldReplace = window.confirm(
                    `Найдено ${processedTechnologies.length} технологий.\n\n` +
                    'Нажмите:\n' +
                    '• OK - Заменить текущие данные\n' +
                    '• Отмена - Добавить к существующим'
                );

                let updatedTechnologies;
                if (shouldReplace) {
                    updatedTechnologies = processedTechnologies;
                } else {
                    const existing = JSON.parse(localStorage.getItem('technologies') || '[]');
                    updatedTechnologies = [...existing, ...processedTechnologies];
                }

                localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));
                if (onLocalTechnologiesUpdate) {
                    onLocalTechnologiesUpdate(updatedTechnologies);
                }

                alert(`Успешно импортировано ${processedTechnologies.length} технологий!\nВсего: ${updatedTechnologies.length}`);

                // Обновляем страницу
                setTimeout(() => {
                    window.location.reload();
                }, 1000);

            } catch (error) {
                const errorMessage = error.message || 'Неизвестная ошибка';
                setImportError(errorMessage);
                alert(`Ошибка импорта: ${errorMessage}`);
                console.error('Ошибка импорта:', error, error.stack);
            }
        };

        reader.onerror = () => {
            const errorMessage = 'Ошибка чтения файла. Файл может быть поврежден.';
            setImportError(errorMessage);
            alert(errorMessage);
        };

        reader.readAsText(file);
        event.target.value = ''; // Сбрасываем значение
    };

    // Подтверждение удаления
    const confirmDelete = (techId, techTitle) => {
        setShowDeleteConfirm({ id: techId, title: techTitle });
    };

    // Отмена удаления
    const cancelDelete = () => {
        setShowDeleteConfirm(null);
    };

    const getFilteredCount = () => {
        return filteredTechnologies.length;
    };

    return (
        <div className="page">
            <div className="dashboard-header">
                <h1>Панель управления</h1>
                <p>Управление вашими технологиями и отслеживание прогресса</p>
            </div>

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

            {/* Компонент массового редактирования с уменьшенной кнопкой */}
            <div className="bulk-edit-container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <BulkStatusEditor
                    technologies={technologies}
                    onStatusUpdate={handleBulkStatusUpdate}
                    className="bulk-edit-button"
                />
            </div>

            <div className="dashboard-sections">
                <div className="dashboard-section">
                    <div className="section-header">
                        <div className="filter-section">
                            <h2>
                                Ваши технологии
                                <span className="filter-count">({getFilteredCount()})</span>
                                {searchQuery && (
                                    <span className="search-results-count">
                                        по запросу "{searchQuery}"
                                    </span>
                                )}
                            </h2>

                            {/* Поисковая строка */}
                            <div className="search-container">
                                <div className="search-input-wrapper">
                                    <input
                                        type="text"
                                        placeholder="Поиск по названию, описанию или заметкам..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="search-input"
                                        aria-label="Поиск технологий"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={clearSearch}
                                            className="search-clear-btn"
                                            title="Очистить поиск"
                                            aria-label="Очистить поиск"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="filter-tabs">
                                <button
                                    className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                                    onClick={() => filterTechnologies('all')}
                                    aria-pressed={activeFilter === 'all'}
                                >
                                    Все
                                </button>
                                <button
                                    className={`filter-tab ${activeFilter === 'not-started' ? 'active' : ''}`}
                                    onClick={() => filterTechnologies('not-started')}
                                    aria-pressed={activeFilter === 'not-started'}
                                >
                                    Не начато
                                </button>
                                <button
                                    className={`filter-tab ${activeFilter === 'in-progress' ? 'active' : ''}`}
                                    onClick={() => filterTechnologies('in-progress')}
                                    aria-pressed={activeFilter === 'in-progress'}
                                >
                                    В процессе
                                </button>
                                <button
                                    className={`filter-tab ${activeFilter === 'completed' ? 'active' : ''}`}
                                    onClick={() => filterTechnologies('completed')}
                                    aria-pressed={activeFilter === 'completed'}
                                >
                                    Завершено
                                </button>
                            </div>
                        </div>
                        <Link to="/add-technology" className="btn btn-primary">
                            + Добавить технологию
                        </Link>
                    </div>

                    {filteredTechnologies.length > 0 ? (
                        <div className="all-technologies">
                            {filteredTechnologies.map(tech => (
                                <div key={tech.id} className="tech-card">
                                    <div className="tech-header">
                                        <div className="tech-info">
                                            <h4>{tech.title}</h4>
                                            <p className="tech-description">{tech.description}</p>
                                        </div>
                                        <div className="tech-actions">
                                            <div className="status-selector">
                                                <select
                                                    value={tech.status}
                                                    onChange={(e) => updateStatus(tech.id, e.target.value)}
                                                    className={`status-select status-${tech.status}`}
                                                    aria-label={`Изменить статус для ${tech.title}`}
                                                >
                                                    <option value="not-started">Не начато</option>
                                                    <option value="in-progress">В процессе</option>
                                                    <option value="completed">Завершено</option>
                                                </select>
                                            </div>
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => confirmDelete(tech.id, tech.title)}
                                                    className="btn-delete"
                                                    title="Удалить технологию"
                                                    aria-label={`Удалить технологию ${tech.title}`}
                                                >
                                                    Удалить
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="tech-notes">
                                        <textarea
                                            placeholder="Добавьте заметки к этой технологии..."
                                            value={tech.notes || ''}
                                            onChange={(e) => updateNotes(tech.id, e.target.value)}
                                            onBlur={() => {
                                                if (tech.notes !== undefined) {
                                                    updateNotes(tech.id, tech.notes);
                                                }
                                            }}
                                            rows="2"
                                            aria-label={`Заметки для ${tech.title}`}
                                        />
                                        <div className="notes-hint">
                                            Заметки сохраняются автоматически
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            {technologies.length === 0 ? (
                                <>
                                    <p>У вас пока нет своих технологий</p>
                                    <Link to="/add-technology" className="btn btn-primary">
                                        Добавить первую технологию
                                    </Link>
                                </>
                            ) : searchQuery ? (
                                <>
                                    <p>По запросу "{searchQuery}" ничего не найдено</p>
                                    <p>Попробуйте изменить поисковый запрос или сбросить фильтры</p>
                                    <div className="empty-state-actions">
                                        <button
                                            onClick={clearSearch}
                                            className="btn btn-secondary"
                                        >
                                            Очистить поиск
                                        </button>
                                        <button
                                            onClick={() => filterTechnologies('all')}
                                            className="btn btn-primary"
                                        >
                                            Показать все технологии
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p>Нет технологий с выбранным статусом</p>
                                    <p>Попробуйте выбрать другой фильтр или изменить статус существующих технологий</p>
                                    <button
                                        onClick={() => filterTechnologies('all')}
                                        className="btn btn-secondary"
                                    >
                                        Показать все технологии
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {/* Модальное окно подтверждения удаления */}
                    {showDeleteConfirm && (
                        <div className="modal-overlay">
                            <div className="delete-confirm-modal">
                                <h3>Подтверждение удаления</h3>
                                <p>Вы уверены, что хотите удалить технологию <strong>"{showDeleteConfirm.title}"</strong>?</p>
                                <p className="warning-text">Это действие нельзя отменить!</p>
                                <div className="modal-actions">
                                    <button
                                        onClick={() => deleteTechnology(showDeleteConfirm.id)}
                                        className="btn btn-danger"
                                    >
                                        Удалить
                                    </button>
                                    <button
                                        onClick={cancelDelete}
                                        className="btn btn-secondary"
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>Быстрые действия</h2>
                    </div>
                    <div className="quick-actions">
                        <button
                            onClick={markAllAsCompleted}
                            className="quick-action-card quick-action-btn"
                            disabled={technologies.length === 0}
                        >
                            <div className="action-icon"></div>
                            <h4>Отметить все как выполненные</h4>
                            <p>Установить статус "Завершено" для всех ваших технологий</p>
                        </button>

                        <button
                            onClick={resetAllStatuses}
                            className="quick-action-card quick-action-btn"
                            disabled={technologies.length === 0}
                        >
                            <div className="action-icon"></div>
                            <h4>Сбросить все статусы</h4>
                            <p>Вернуть все технологии к статусу "Не начато"</p>
                        </button>

                        <button
                            onClick={getRandomNextTechnology}
                            className="quick-action-card quick-action-btn"
                            disabled={technologies.filter(t => t.status === 'not-started').length === 0}
                        >
                            <div className="action-icon"></div>
                            <h4>Случайный выбор следующей технологии</h4>
                            <p>Выбрать случайную технологию для изучения и начать её</p>
                        </button>

                        <button
                            onClick={handleExportData}
                            className="quick-action-card quick-action-btn"
                            disabled={technologies.length === 0}
                        >
                            <div className="action-icon"></div>
                            <h4>Экспорт данных</h4>
                            <p>Скачать все ваши технологии в JSON файл</p>
                        </button>

                        <label className="quick-action-card quick-action-btn">
                            <div className="action-icon"></div>
                            <h4>Импорт данных</h4>
                            <p>Загрузить технологии из JSON файла</p>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImportData}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>

                    {/* Сообщение об ошибке импорта */}
                    {importError && (
                        <div className="error-message">
                            <strong>Ошибка импорта:</strong> {importError}
                        </div>
                    )}

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

                    <div className="news-link-section">
                        <h4>Следите за трендами</h4>
                        <p>Будьте в курсе последних технологических новостей</p>
                        <Link to="/tech-news" className="btn btn-primary">
                            Читать новости
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;