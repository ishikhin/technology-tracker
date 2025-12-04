import { useState, useEffect } from 'react';
import './BulkStatusEditor.css';

function BulkStatusEditor({ technologies, onStatusUpdate }) {
    const [selectedTechs, setSelectedTechs] = useState([]);
    const [newStatus, setNewStatus] = useState('in-progress');
    const [isEditing, setIsEditing] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [applySuccess, setApplySuccess] = useState(false);

    // Фокус на кнопку при открытии редактора
    const editorRef = useState(null);

    // Обработчик выбора технологии
    const handleTechSelect = (techId) => {
        setSelectedTechs(prev =>
            prev.includes(techId)
                ? prev.filter(id => id !== techId)
                : [...prev, techId]
        );
    };

    // Выбор всех технологий
    const handleSelectAll = () => {
        setSelectedTechs(
            selectedTechs.length === technologies.length
                ? []
                : technologies.map(tech => tech.id)
        );
    };

    // Применение нового статуса ко всем выбранным технологиям
    const handleApplyStatus = async () => {
        if (selectedTechs.length === 0) {
            alert('Выберите хотя бы одну технологию');
            return;
        }

        setIsApplying(true);

        // Имитация задержки для реалистичности
        await new Promise(resolve => setTimeout(resolve, 500));

        onStatusUpdate(selectedTechs, newStatus);
        setSelectedTechs([]);
        setIsEditing(false);
        setIsApplying(false);
        setApplySuccess(true);

        // Автоматическое скрытие сообщения об успехе
        setTimeout(() => {
            setApplySuccess(false);
        }, 3000);
    };

    // Обработчик клавиш для доступности
    const handleKeyDown = (e, techId) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTechSelect(techId);
        }
    };

    // Обработчик для кнопки выбора всех
    const handleSelectAllKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelectAll();
        }
    };

    // Область для скринридера
    const getStatusMessage = () => {
        if (isApplying) return 'Применение статуса...';
        if (applySuccess) return 'Статусы успешно обновлены!';
        if (selectedTechs.length > 0) return `Выбрано ${selectedTechs.length} технологий`;
        return '';
    };

    return (
        <div className="bulk-status-editor" role="region" aria-label="Массовое редактирование статусов">
            {/* Область для скринридера */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {getStatusMessage()}
            </div>

            <div className="editor-header">
                <h3 id="bulk-editor-title"> Массовое редактирование статусов</h3>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn btn-outline"
                    aria-expanded={isEditing}
                    aria-controls="bulk-editor-content"
                    aria-labelledby="bulk-editor-title"
                >
                    {isEditing ? ' Закрыть' : ' Массовое редактирование'}
                </button>
            </div>

            {isEditing && (
                <div id="bulk-editor-content" className="editor-content">
                    <div className="selection-controls">
                        <button
                            onClick={handleSelectAll}
                            onKeyDown={handleSelectAllKeyDown}
                            className="btn btn-sm btn-outline"
                            aria-label={selectedTechs.length === technologies.length ? 'Снять выделение со всех технологий' : 'Выбрать все технологии'}
                        >
                            {selectedTechs.length === technologies.length ? ' Снять все' : ' Выбрать все'}
                        </button>
                        <span className="selected-count" id="selected-count">
                            Выбрано: {selectedTechs.length}
                            <span className="sr-only"> из {technologies.length}</span>
                        </span>
                    </div>

                    <div
                        className="techs-grid"
                        role="group"
                        aria-labelledby="bulk-editor-title"
                    >
                        {technologies.map(tech => (
                            <div key={tech.id} className="tech-checkbox">
                                <label className="tech-label">
                                    <input
                                        type="checkbox"
                                        checked={selectedTechs.includes(tech.id)}
                                        onChange={() => handleTechSelect(tech.id)}
                                        onKeyDown={(e) => handleKeyDown(e, tech.id)}
                                        aria-label={`Выбрать ${tech.title}, текущий статус: ${tech.status === 'completed' ? 'Завершено' : tech.status === 'in-progress' ? 'В процессе' : 'Не начато'}`}
                                        className="tech-checkbox-input"
                                    />
                                    <span className="checkbox-custom" aria-hidden="true"></span>
                                    <span className="tech-title">{tech.title}</span>
                                    <span className={`status-badge status-${tech.status}`} aria-hidden="true">
                                        {tech.status === 'completed' ? 'Завершено' :
                                            tech.status === 'in-progress' ? 'В процессе' : 'Не начато'}
                                    </span>
                                    <span className="sr-only">
                                        {tech.status === 'completed' ? ' (Завершено)' :
                                            tech.status === 'in-progress' ? ' (В процессе)' : ' (Не начато)'}
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="status-controls">
                        <label htmlFor="bulk-status" id="bulk-status-label">
                            Новый статус для выбранных технологий:
                        </label>
                        <select
                            id="bulk-status"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            aria-labelledby="bulk-status-label"
                            aria-describedby="status-help"
                            disabled={isApplying}
                        >
                            <option value="not-started"> Не начато</option>
                            <option value="in-progress"> В процессе</option>
                            <option value="completed"> Завершено</option>
                        </select>
                        <small id="status-help" className="help-text">
                            Будет применен ко всем выбранным технологиям ({selectedTechs.length})
                        </small>
                    </div>

                    {/* Сообщение об успехе */}
                    {applySuccess && (
                        <div className="success-message" role="alert">
                            Статусы {selectedTechs.length} технологий успешно обновлены!
                        </div>
                    )}

                    <div className="action-buttons">
                        <button
                            onClick={handleApplyStatus}
                            disabled={selectedTechs.length === 0 || isApplying}
                            className="btn btn-primary"
                            aria-busy={isApplying}
                        >
                            {isApplying ? 'Применение...' : `Применить к ${selectedTechs.length} технологиям`}
                        </button>
                        <button
                            onClick={() => setSelectedTechs([])}
                            className="btn btn-secondary"
                            disabled={isApplying}
                        >
                            Очистить выбор
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BulkStatusEditor;