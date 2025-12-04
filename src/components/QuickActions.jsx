// src/components/QuickActions.jsx
import React, { useState } from 'react';
import Modal from './Modal';
import './QuickActions.css';

function QuickActions({ onMarkAllCompleted, onResetAll, onRandomNext, technologies }) {
    const [showExportModal, setShowExportModal] = useState(false);
    const notStartedCount = technologies.filter(tech => tech.status === 'not-started').length;

    const handleExport = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            technologies: technologies
        };
        const dataStr = JSON.stringify(data, null, 2);

        // Создаем blob для скачивания файла
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setShowExportModal(true);
    };

    return (
        <div className="quick-actions">
            <h3 className="quick-actions__title">Быстрые действия</h3>
            <div className="quick-actions__buttons">
                <button
                    className="quick-actions__button quick-actions__button--complete"
                    onClick={onMarkAllCompleted}
                >
                    ✅ Отметить все как выполненные
                </button>

                <button
                    className="quick-actions__button quick-actions__button--reset"
                    onClick={onResetAll}
                >
                    🔄 Сбросить все статусы
                </button>

                <button
                    className="quick-actions__button quick-actions__button--random"
                    onClick={onRandomNext}
                    disabled={notStartedCount === 0}
                >
                    🎲 Случайный выбор следующей технологии
                    {notStartedCount > 0 && (
                        <span className="quick-actions__count">{notStartedCount}</span>
                    )}
                </button>

                <button
                    className="quick-actions__button quick-actions__button--export"
                    onClick={handleExport}
                >
                    📤 Экспорт данных
                </button>
            </div>

            <Modal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                title="Экспорт данных"
            >
                <p>✅ Данные успешно экспортированы!</p>
                <p>Файл с вашими данными был скачан автоматически.</p>
                <div className="modal-actions">
                    <button
                        className="quick-actions__button quick-actions__button--complete"
                        onClick={() => setShowExportModal(false)}
                    >
                        Закрыть
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default QuickActions;