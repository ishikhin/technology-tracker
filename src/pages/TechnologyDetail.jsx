import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TechnologyDetail.css';

function TechnologyDetail({ technologies = [] }) {
    const { techId } = useParams();
    const navigate = useNavigate();
    const [technology, setTechnology] = useState(null);
    const [notes, setNotes] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const tech = technologies.find(t => t.id === parseInt(techId));
        setTechnology(tech);
        setNotes(tech?.notes || '');
    }, [techId, technologies]);

    const updateStatus = (newStatus) => {
        if (!technology) return;

        const saved = localStorage.getItem('technologies');
        if (saved) {
            const technologiesData = JSON.parse(saved);
            const updated = technologiesData.map(tech =>
                tech.id === parseInt(techId) ? { ...tech, status: newStatus } : tech
            );
            localStorage.setItem('technologies', JSON.stringify(updated));
            setTechnology({ ...technology, status: newStatus });
        }
    };

    const updateNotes = () => {
        if (technology && notes !== technology.notes) {
            const saved = localStorage.getItem('technologies');
            if (saved) {
                const technologiesData = JSON.parse(saved);
                const updated = technologiesData.map(tech =>
                    tech.id === parseInt(techId) ? { ...tech, notes } : tech
                );
                localStorage.setItem('technologies', JSON.stringify(updated));
                setTechnology({ ...technology, notes });
            }
        }
    };

    // Функция удаления технологии
    const deleteTechnology = () => {
        if (!technology) return;

        const saved = localStorage.getItem('technologies');
        if (saved) {
            const technologiesData = JSON.parse(saved);
            const updated = technologiesData.filter(tech => tech.id !== parseInt(techId));
            localStorage.setItem('technologies', JSON.stringify(updated));
            navigate('/dashboard');
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            'not-started': 'Не начато',
            'in-progress': 'В процессе',
            'completed': 'Завершено'
        };
        return statusMap[status] || status;
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    if (!technology) {
        return (
            <div className="page">
                <h1>Технология не найдена</h1>
                <p>Технология с ID {techId} не существует.</p>
                <button onClick={handleBackToDashboard} className="btn btn-primary">
                    ← Назад к панели управления
                </button>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <button onClick={handleBackToDashboard} className="back-link">
                    ← Назад к панели управления
                </button>
                <h1>{technology.title}</h1>
            </div>

            <div className="technology-detail">
                <div className="detail-section">
                    <h3>Описание</h3>
                    <p>{technology.description}</p>
                </div>

                <div className="detail-section">
                    <h3>Статус изучения</h3>
                    <div className="current-status">
                        Текущий статус: <span className={`status status-${technology.status}`}>
                            {getStatusText(technology.status)}
                        </span>
                    </div>
                    <div className="status-buttons">
                        <button
                            onClick={() => updateStatus('not-started')}
                            className={`status-btn ${technology.status === 'not-started' ? 'active' : ''}`}
                        >
                            <span className="status-icon">⏳</span>
                            Не начато
                        </button>
                        <button
                            onClick={() => updateStatus('in-progress')}
                            className={`status-btn ${technology.status === 'in-progress' ? 'active' : ''}`}
                        >
                            <span className="status-icon">🔄</span>
                            В процессе
                        </button>
                        <button
                            onClick={() => updateStatus('completed')}
                            className={`status-btn ${technology.status === 'completed' ? 'active' : ''}`}
                        >
                            <span className="status-icon">✅</span>
                            Завершено
                        </button>
                    </div>
                </div>

                <div className="detail-section">
                    <h3>Мои заметки</h3>
                    <div className="notes-editor">
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            onBlur={updateNotes}
                            placeholder="Добавьте ваши заметки по изучению этой технологии..."
                            rows="6"
                        />
                        <div className="notes-hint">
                            💡 Заметки сохраняются автоматически при потере фокуса
                        </div>
                    </div>
                </div>

                <div className="detail-section danger-zone">
                    <h3>⚡ Опасная зона</h3>
                    <div className="danger-content">
                        <p>Удаление технологии невозможно отменить. Все данные будут потеряны.</p>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="btn btn-danger"
                        >
                            🗑️ Удалить технологию
                        </button>
                    </div>
                </div>

                <div className="detail-actions">
                    <button onClick={handleBackToDashboard} className="btn btn-primary">
                        ← Вернуться к панели управления
                    </button>
                </div>
            </div>

            {/* Модальное окно подтверждения удаления */}
            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="delete-confirm-modal">
                        <h3>Подтверждение удаления</h3>
                        <p>Вы уверены, что хотите удалить технологию <strong>"{technology.title}"</strong>?</p>
                        <p className="warning-text">Это действие нельзя отменить! Все заметки и прогресс будут потеряны.</p>
                        <div className="modal-actions">
                            <button
                                onClick={deleteTechnology}
                                className="btn btn-danger"
                            >
                                🗑️ Удалить навсегда
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="btn btn-secondary"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TechnologyDetail;