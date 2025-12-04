import { useState, useEffect, useRef } from 'react';
import './TechnologySearch.css';

function TechnologySearch({ technologies, onSearchResults }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const searchTimeoutRef = useRef(null);

    // Функция для поиска технологий
    const searchTechnologies = (query) => {
        if (!query.trim()) {
            onSearchResults(technologies);
            return;
        }

        setLoading(true);

        const filtered = technologies.filter(tech =>
            tech.title.toLowerCase().includes(query.toLowerCase()) ||
            tech.description.toLowerCase().includes(query.toLowerCase()) ||
            tech.category.toLowerCase().includes(query.toLowerCase())
        );

        onSearchResults(filtered);
        setLoading(false);
    };

    // Обработчик изменения поискового запроса с debounce
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Очищаем предыдущий таймер
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Устанавливаем новый таймер для debounce (300ms)
        searchTimeoutRef.current = setTimeout(() => {
            searchTechnologies(value);
        }, 300);
    };

    // Очистка при размонтировании
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="technology-search">
            <div className="search-box">
                <input
                    type="text"
                    placeholder="🔍 Поиск технологий по названию, описанию или категории..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                {loading && <div className="search-loading"></div>}
            </div>
        </div>
    );
}

export default TechnologySearch;