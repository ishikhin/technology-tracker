// src/hooks/useTechNews.js
import { useState, useEffect } from 'react';

// Демо-новости на случай если API не работает
const DEMO_NEWS = [
    {
        id: 1,
        title: 'React 19 Beta Released',
        description: 'Новая версия React включает серверные компоненты, действия и улучшенную производительность',
        category: 'frontend',
        source: 'React Blog',
        date: '2024',
        url: 'https://react.dev/blog/2024/04/25/react-19',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h-200&fit=crop'
    },
    {
        id: 2,
        title: 'TypeScript 5.5: Новые возможности',
        description: 'Последнее обновление TypeScript приносит улучшенный вывод типов и новые возможности для разработчиков',
        category: 'language',
        source: 'TypeScript Blog',
        date: '2024',
        url: 'https://devblogs.microsoft.com/typescript/announcing-typescript-5-5/',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop'
    },
    {
        id: 3,
        title: 'Next.js 15 с React 19',
        description: 'Интеграция React 19 в Next.js 15 приносит улучшенную производительность и новые возможности',
        category: 'framework',
        source: 'Next.js Blog',
        date: '2024',
        url: 'https://nextjs.org/blog/next-15',
        image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop'
    },
    {
        id: 4,
        title: 'Искусственный интеллект в веб-разработке',
        description: 'Как инструменты на базе AI меняют процесс разработки современных веб-приложений',
        category: 'ai',
        source: 'Tech Trends',
        date: '2024',
        url: '#',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop'
    },
    {
        id: 5,
        title: 'Node.js 22: Что нового',
        description: 'Последняя версия Node.js включает поддержку WebSocket API и улучшенную безопасность',
        category: 'backend',
        source: 'Node.js Blog',
        date: '2024',
        url: 'https://nodejs.org/en/blog/release/v22.0.0',
        image: 'https://images.unsplash.com/photo-1599508704512-2f292ef7c6c1?w=400&h=200&fit=crop'
    },
    {
        id: 6,
        title: 'Tailwind CSS v4 Анонсирован',
        description: 'Новая версия самого популярного CSS фреймворка обещает быть быстрее и удобнее',
        category: 'css',
        source: 'Tailwind CSS',
        date: '2024',
        url: 'https://tailwindcss.com/blog/tailwindcss-v4',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop'
    },
    {
        id: 7,
        title: 'Vue.js 3.4: Улучшения производительности',
        description: 'Значительное увеличение скорости рендеринга и новые возможности композиции',
        category: 'frontend',
        source: 'Vue.js Blog',
        date: '2024',
        url: 'https://blog.vuejs.org/posts/vue-3-4',
        image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=200&fit=crop'
    },
    {
        id: 8,
        title: 'Docker Desktop 5.0',
        description: 'Новая версия Docker с улучшенной производительностью и поддержкой новых функций',
        category: 'devops',
        source: 'Docker Blog',
        date: '2024',
        url: 'https://www.docker.com/blog/docker-desktop-5-0/',
        image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&h=200&fit=crop'
    }
];

// Функция для получения категории по ключевым словам
const getCategoryFromTitle = (title) => {
    const titleLower = title.toLowerCase();

    if (titleLower.includes('react') || titleLower.includes('vue') || titleLower.includes('angular')) {
        return 'frontend';
    }
    if (titleLower.includes('node') || titleLower.includes('express') || titleLower.includes('backend')) {
        return 'backend';
    }
    if (titleLower.includes('typescript') || titleLower.includes('javascript') || titleLower.includes('python')) {
        return 'language';
    }
    if (titleLower.includes('docker') || titleLower.includes('kubernetes') || titleLower.includes('devops')) {
        return 'devops';
    }
    if (titleLower.includes('ai') || titleLower.includes('искусственный интеллект') || titleLower.includes('машинное обучение')) {
        return 'ai';
    }
    if (titleLower.includes('css') || titleLower.includes('tailwind') || titleLower.includes('стили')) {
        return 'css';
    }
    return 'general';
};

const useTechNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchTechNews = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔄 Загрузка технологических новостей...');

            // Пробуем несколько источников RSS
            const sources = [
                'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ftechcrunch.com%2Ffeed%2F',
                'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fcss-tricks.com%2Ffeed%2F',
                'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fdev.to%2Ffeed'
            ];

            let allNews = [];

            // Пробуем загрузить из каждого источника
            for (const sourceUrl of sources) {
                try {
                    const response = await fetch(sourceUrl);

                    if (response.ok) {
                        const data = await response.json();

                        const formattedNews = data.items.slice(0, 3).map((item, index) => ({
                            id: `${Date.now()}-${index}`,
                            title: item.title,
                            description: item.description
                                ? item.description.replace(/<[^>]*>/g, '').substring(0, 120) + '...'
                                : 'Новость о технологиях и разработке',
                            category: getCategoryFromTitle(item.title),
                            source: data.feed?.title || 'Tech Source',
                            date: new Date(item.pubDate).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long'
                            }),
                            url: item.link,
                            image: item.enclosure?.link || `https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop&${index}`
                        }));

                        allNews = [...allNews, ...formattedNews];
                    }
                } catch (sourceError) {
                    console.warn(`⚠️ Ошибка загрузки из источника:`, sourceError);
                    continue;
                }
            }

            // Если удалось загрузить новости
            if (allNews.length > 0) {
                // Убираем дубликаты
                const uniqueNews = allNews.filter((item, index, self) =>
                    index === self.findIndex(t => t.title === item.title)
                );

                // Ограничиваем до 8 новостей
                const finalNews = uniqueNews.slice(0, 8);
                setNews(finalNews);
                setLastUpdated(new Date().toLocaleTimeString('ru-RU'));
                console.log(`✅ Загружено ${finalNews.length} новостей`);
            } else {
                // Используем демо-данные если API не сработали
                console.log('📝 Используем демо-новости');
                const demoWithCategories = DEMO_NEWS.map(item => ({
                    ...item,
                    category: getCategoryFromTitle(item.title)
                }));
                setNews(demoWithCategories);
                setLastUpdated('Демо-данные');
                setError('Используются демо-данные. Проверьте подключение к интернету.');
            }

        } catch (err) {
            console.error('❌ Ошибка загрузки новостей:', err);
            setError('Не удалось загрузить новости. Используются демо-данные.');
            setNews(DEMO_NEWS);
            setLastUpdated('Демо-данные');
        } finally {
            setLoading(false);
        }
    };

    // Фильтрация новостей по категории
    const getNewsByCategory = (category) => {
        if (category === 'all') return news;
        return news.filter(item => item.category === category);
    };

    // Поиск новостей
    const searchNews = (query) => {
        const queryLower = query.toLowerCase();
        return news.filter(item =>
            item.title.toLowerCase().includes(queryLower) ||
            item.description.toLowerCase().includes(queryLower) ||
            item.source.toLowerCase().includes(queryLower)
        );
    };

    useEffect(() => {
        fetchTechNews();

        // Обновляем новости каждые 10 минут
        const interval = setInterval(fetchTechNews, 10 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return {
        news,
        loading,
        error,
        lastUpdated,
        getNewsByCategory,
        searchNews,
        refetch: fetchTechNews
    };
};


export default useTechNews;