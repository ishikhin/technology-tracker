import { useState } from 'react';
import './ResourceLoader.css';

function ResourceLoader({ technology, onResourcesUpdate }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAdditionalResources = async () => {
        try {
            setLoading(true);
            setError(null);

            // Используем Google Custom Search API для поиска дополнительных ресурсов
            // В реальном приложении нужно заменить на ваш API ключ
            const searchQuery = encodeURIComponent(`${technology.title} tutorial documentation`);

            // Имитация запроса к API (в реальном приложении используйте реальный endpoint)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Мок данные дополнительных ресурсов
            const additionalResources = [
                `https://example.com/${technology.title.toLowerCase()}-official-docs`,
                `https://example.com/${technology.title.toLowerCase()}-tutorial`,
                `https://example.com/${technology.title.toLowerCase()}-best-practices`
            ];

            // Обновляем ресурсы технологии
            const updatedResources = [...(technology.resources || []), ...additionalResources];
            onResourcesUpdate(technology.id, updatedResources);

        } catch (err) {
            setError('Не удалось загрузить дополнительные ресурсы');
            console.error('Ошибка загрузки ресурсов:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="resource-loader">
            <button
                onClick={fetchAdditionalResources}
                disabled={loading}
                className="btn btn-outline btn-sm"
            >
                {loading ? '⏳ Загрузка...' : '📚 Загрузить дополнительные ресурсы'}
            </button>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
        </div>
    );
}

export default ResourceLoader;