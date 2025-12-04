import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddTechnology.css';

function AddTechnology() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'not-started',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const newTechnology = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString(),
            isFromApi: false // Явно указываем, что это пользовательская технология
        };

        const existingTechnologies = JSON.parse(localStorage.getItem('technologies') || '[]');
        const updatedTechnologies = [...existingTechnologies, newTechnology];

        localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));

        // Показываем уведомление
        alert('Технология успешно добавлена!');

        // Перенаправляем на дашборд
        navigate('/dashboard');

        // Принудительно обновляем страницу для синхронизации данных
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Добавить технологию</h1>
            </div>

            <form onSubmit={handleSubmit} className="technology-form">
                <div className="form-group">
                    <label htmlFor="title">Название технологии *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Например: React, Node.js, Python..."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Описание *</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                        placeholder="Опишите технологию, для чего она используется..."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="status">Статус изучения</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="not-started"> Не начато</option>
                        <option value="in-progress"> В процессе</option>
                        <option value="completed"> Завершено</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="notes">Заметки</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Дополнительные заметки, ссылки на ресурсы, план изучения..."
                    />
                    <div className="form-hint">
                         Эти заметки будут прикреплены к технологии
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        Добавить технологию
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/dashboard')}
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddTechnology;