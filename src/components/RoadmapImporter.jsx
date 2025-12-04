import { useState } from 'react';
import './RoadmapImporter.css';

function RoadmapImporter({ onImport }) {
    const [importing, setImporting] = useState(false);
    const [error, setError] = useState(null);

    // Предопределенные дорожные карты
    const predefinedRoadmaps = {
        frontend: [
            {
                id: 1001,
                title: 'HTML5',
                description: 'Семантическая разметка и новые API',
                category: 'frontend',
                status: 'not-started',
                difficulty: 'beginner',
                resources: ['https://developer.mozilla.org/ru/docs/Web/HTML']
            },
            {
                id: 1002,
                title: 'CSS3',
                description: 'Современные стили и анимации',
                category: 'frontend',
                status: 'not-started',
                difficulty: 'beginner',
                resources: ['https://developer.mozilla.org/ru/docs/Web/CSS']
            },
            {
                id: 1003,
                title: 'JavaScript ES6+',
                description: 'Современный JavaScript с новыми возможностями',
                category: 'frontend',
                status: 'not-started',
                difficulty: 'intermediate',
                resources: ['https://learn.javascript.ru/']
            }
        ],
        backend: [
            {
                id: 2001,
                title: 'Node.js',
                description: 'Среда выполнения JavaScript на сервере',
                category: 'backend',
                status: 'not-started',
                difficulty: 'intermediate',
                resources: ['https://nodejs.org']
            },
            {
                id: 2002,
                title: 'Express.js',
                description: 'Веб-фреймворк для Node.js',
                category: 'backend',
                status: 'not-started',
                difficulty: 'intermediate',
                resources: ['https://expressjs.com']
            },
            {
                id: 2003,
                title: 'REST API',
                description: 'Проектирование RESTful API',
                category: 'backend',
                status: 'not-started',
                difficulty: 'intermediate',
                resources: ['https://restfulapi.net']
            }
        ],
        fullstack: [
            {
                id: 3001,
                title: 'MERN Stack',
                description: 'MongoDB, Express, React, Node.js',
                category: 'fullstack',
                status: 'not-started',
                difficulty: 'advanced',
                resources: ['https://www.mongodb.com/mern-stack']
            },
            {
                id: 3002,
                title: 'JWT Authentication',
                description: 'Аутентификация с JSON Web Tokens',
                category: 'fullstack',
                status: 'not-started',
                difficulty: 'intermediate',
                resources: ['https://jwt.io']
            }
        ]
    };

    const handleImportRoadmap = async (roadmapType) => {
        try {
            setImporting(true);
            setError(null);

            const roadmapData = predefinedRoadmaps[roadmapType];

            if (!roadmapData) {
                throw new Error('Неизвестный тип дорожной карты');
            }

            // Имитация задержки загрузки
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Передаем данные в родительский компонент
            onImport(roadmapData);

        } catch (err) {
            setError(err.message);
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className="roadmap-importer">
            <h3>🚀 Быстрый импорт дорожных карт</h3>

            <div className="roadmap-cards">
                <div className="roadmap-card" onClick={() => handleImportRoadmap('frontend')}>
                    <div className="roadmap-icon">🎨</div>
                    <h4>Frontend Разработка</h4>
                    <p>HTML, CSS, JavaScript, React</p>
                    <span className="tech-count">3 технологии</span>
                </div>

                <div className="roadmap-card" onClick={() => handleImportRoadmap('backend')}>
                    <div className="roadmap-icon">⚙️</div>
                    <h4>Backend Разработка</h4>
                    <p>Node.js, Express, REST API</p>
                    <span className="tech-count">3 технологии</span>
                </div>

                <div className="roadmap-card" onClick={() => handleImportRoadmap('fullstack')}>
                    <div className="roadmap-icon">🔗</div>
                    <h4>Fullstack Разработка</h4>
                    <p>MERN Stack, JWT, Базы данных</p>
                    <span className="tech-count">2 технологии</span>
                </div>
            </div>

            {importing && (
                <div className="importing-overlay">
                    <div className="spinner"></div>
                    <p>Импорт технологий...</p>
                </div>
            )}

            {error && (
                <div className="error-message">
                    ❌ {error}
                </div>
            )}
        </div>
    );
}

export default RoadmapImporter;