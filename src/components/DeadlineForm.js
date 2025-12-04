import { useState, useEffect } from 'react';
import './DeadlineForm.css';

function DeadlineForm({ technology, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        deadline: '',
        priority: 'medium',
        estimatedHours: '',
        notes: ''
    });
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Инициализация формы данными технологии
    useEffect(() => {
        if (technology) {
            setFormData({
                deadline: technology.deadline || '',
                priority: technology.priority || 'medium',
                estimatedHours: technology.estimatedHours || '',
                notes: technology.notes || ''
            });
        }
    }, [technology]);

    // Валидация формы
    const validateForm = () => {
        const newErrors = {};

        // Валидация дедлайна
        if (!formData.deadline.trim()) {
            newErrors.deadline = 'Дедлайн обязателен для заполнения';
        } else {
            const deadlineDate = new Date(formData.deadline);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            deadlineDate.setHours(0, 0, 0, 0);

            if (deadlineDate < today) {
                newErrors.deadline = 'Дедлайн не может быть в прошлом';
            }

            // Максимум 2 года вперед
            const maxDate = new Date();
            maxDate.setFullYear(today.getFullYear() + 2);
            if (deadlineDate > maxDate) {
                newErrors.deadline = 'Дедлайн не может быть более чем на 2 года вперед';
            }
        }

        // Валидация предполагаемого времени
        if (formData.estimatedHours) {
            const hours = parseInt(formData.estimatedHours);
            if (isNaN(hours) || hours < 1 || hours > 1000) {
                newErrors.estimatedHours = 'Введите корректное количество часов (1-1000)';
            }
        }

        // Валидация приоритета
        if (!formData.priority || !['low', 'medium', 'high', 'critical'].includes(formData.priority)) {
            newErrors.priority = 'Выберите корректный приоритет';
        }

        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0);
    };

    // Запуск валидации при изменении данных
    useEffect(() => {
        validateForm();
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isFormValid && !isSubmitting) {
            setIsSubmitting(true);

            // Имитация задержки для реалистичности
            await new Promise(resolve => setTimeout(resolve, 500));

            onSave(formData);

            setSubmitSuccess(true);
            setIsSubmitting(false);

            // Автоматическое скрытие сообщения об успехе
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="deadline-form" noValidate>
            {/* Область для скринридера */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {isSubmitting && 'Отправка формы...'}
                {submitSuccess && 'Форма успешно отправлена!'}
                {Object.keys(errors).length > 0 && `Форма содержит ${Object.keys(errors).length} ошибок`}
            </div>

            <h3>⏰ Установка сроков изучения</h3>

            <div className="form-group">
                <label htmlFor="deadline">
                    Дедлайн изучения
                    <span className="required" aria-label="обязательное поле">*</span>
                </label>
                <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className={errors.deadline ? 'error' : ''}
                    aria-required="true"
                    aria-invalid={!!errors.deadline}
                    aria-describedby={errors.deadline ? 'deadline-error' : undefined}
                    disabled={isSubmitting}
                    min={new Date().toISOString().split('T')[0]}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0]}
                />
                {errors.deadline && (
                    <span id="deadline-error" className="error-message" role="alert">
                        {errors.deadline}
                    </span>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="priority">Приоритет изучения</label>
                <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className={errors.priority ? 'error' : ''}
                    aria-invalid={!!errors.priority}
                    aria-describedby={errors.priority ? 'priority-error' : undefined}
                    disabled={isSubmitting}
                >
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                    <option value="critical">Критический</option>
                </select>
                {errors.priority && (
                    <span id="priority-error" className="error-message" role="alert">
                        {errors.priority}
                    </span>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="estimatedHours">
                    Предполагаемое время изучения (часы)
                </label>
                <input
                    type="number"
                    id="estimatedHours"
                    name="estimatedHours"
                    value={formData.estimatedHours}
                    onChange={handleChange}
                    min="1"
                    max="1000"
                    step="1"
                    placeholder="Например: 40"
                    className={errors.estimatedHours ? 'error' : ''}
                    aria-invalid={!!errors.estimatedHours}
                    aria-describedby={errors.estimatedHours ? 'hours-error' : undefined}
                    disabled={isSubmitting}
                />
                {errors.estimatedHours && (
                    <span id="hours-error" className="error-message" role="alert">
                        {errors.estimatedHours}
                    </span>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="notes">Заметки и план изучения</label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Опишите ваш план изучения, ключевые темы для изучения..."
                    aria-describedby="notes-help"
                    disabled={isSubmitting}
                />
                <small id="notes-help" className="help-text">
                    Опишите шаги изучения, ключевые концепции и ресурсы
                </small>
            </div>

            {/* Сообщение об успехе */}
            {submitSuccess && (
                <div className="success-message" role="alert">
                    ✅ План успешно сохранен!
                </div>
            )}

            <div className="form-actions">
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!isFormValid || isSubmitting}
                    aria-busy={isSubmitting}
                >
                    {isSubmitting ? '⏳ Сохранение...' : '💾 Сохранить план'}
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Отмена
                </button>
            </div>
        </form>
    );
}

export default DeadlineForm;