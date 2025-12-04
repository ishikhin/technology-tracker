import React, { useState, useEffect } from 'react';
import useTechNews from '../hooks/useTechNews';
import '../pages/TechNews.css';


function TechNews() {
    const { news, loading, error, lastUpdated, searchNews, refetch } = useTechNews();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredNews, setFilteredNews] = useState([]);

    // Инициализируем фильтрованные новости при загрузке - ИСПРАВЛЕНО
    useEffect(() => {
        setFilteredNews(news);
    }, [news]);

    // Обработчик изменения поискового запроса
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim()) {
            const searchResults = searchNews(query);
            setFilteredNews(searchResults);
        } else {
            setFilteredNews(news);
        }
    };

    // Очистка поиска
    const clearSearch = () => {
        setSearchQuery('');
        setFilteredNews(news);
    };

    if (loading) {
        return (
            <div className="page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p> Загрузка технологических новостей...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="news-header">
                <h1> Технологические новости</h1>
                <p>Будьте в курсе последних трендов и обновлений в мире разработки</p>

                <div className="news-status">
                    {lastUpdated && (
                        <span className="last-updated">
                             Обновлено: {lastUpdated}
                        </span>
                    )}
                </div>
            </div>

            {error && (
                <div className="error-message">
                    ⚠️ {error}
                    <button onClick={refetch} className="refresh-btn">
                         Обновить
                    </button>
                </div>
            )}

            {/* Поисковая строка (как в Dashboard) */}
            <div className="search-section">
                <div className="search-container">
                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            placeholder=" Поиск по заголовку, описанию или источнику..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="search-clear-btn"
                                title="Очистить поиск"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Информация о результатах */}
                {searchQuery && (
                    <div className="search-results-info">
                        <p>
                            Найдено новостей: <strong>{filteredNews.length}</strong>
                            {filteredNews.length > 0 && (
                                <span className="search-query-info">
                                    по запросу "<strong>{searchQuery}</strong>"
                                </span>
                            )}
                        </p>
                    </div>
                )}
            </div>

            {/* Отображение новостей */}
            {filteredNews.length > 0 ? (
                <>
                    <div className="news-results-header">
                        <h2>
                             Технологические новости
                            {searchQuery ? (
                                <span className="results-count">
                                    ({filteredNews.length} найдено)
                                </span>
                            ) : (
                                <span className="results-count">
                                    ({filteredNews.length} всего)
                                </span>
                            )}
                        </h2>
                    </div>

                    <div className="news-grid">
                        {filteredNews.map(item => (
                            <div key={item.id} className="news-card">
                                <div className="news-content">
                                    <h3>{item.title}</h3>
                                    <p className="news-description">{item.description}</p>

                                    <div className="news-meta">
                                        <span className="news-source">{item.source}</span>
                                        <span className="news-date">{item.date}</span>
                                        {item.category && (
                                            <span className={`category-badge category-${item.category}`}>
                                                {item.category}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                >
                                     Читать статью
                                </a>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="empty-state">
                    {news.length === 0 ? (
                        <>
                            <p> Новости не загружены</p>
                            <p>Попробуйте обновить страницу или проверьте подключение к интернету</p>
                            <button onClick={refetch} className="btn btn-primary">
                                 Обновить новости
                            </button>
                        </>
                    ) : searchQuery ? (
                        <>
                            <p> По запросу "{searchQuery}" ничего не найдено</p>
                            <p>Попробуйте изменить поисковый запрос</p>
                            <button
                                onClick={clearSearch}
                                className="btn btn-primary"
                            >
                                Очистить поиск
                            </button>
                        </>
                    ) : (
                        <>
                            <p> Нет новостей для отображения</p>
                            <button onClick={refetch} className="btn btn-primary">
                                 Загрузить новости
                            </button>
                        </>
                    )}
                </div>
            )}

            <div className="news-info">
                <p> Новости загружаются из различных технологических блогов и источников</p>
                <button onClick={refetch} className="btn btn-secondary">
                     Обновить новости
                </button>
            </div>
        </div>
    );
}

export default TechNews;