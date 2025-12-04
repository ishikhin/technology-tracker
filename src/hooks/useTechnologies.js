// src/hooks/useTechnologies.js
import useLocalStorage from './useLocalStorage';

// Начальные данные для технологий
const initialTechnologies = [
    {
        id: 1,
        title: 'React Components',
        description: 'Изучение функциональных и классовых компонентов, их жизненного цикла и методов',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 2,
        title: 'JSX Syntax',
        description: 'Освоение синтаксиса JSX, работа с выражениями JavaScript в разметке',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 3,
        title: 'State Management',
        description: 'Работа с состоянием компонентов, использование useState и useEffect хуков',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 4,
        title: 'React Router',
        description: 'Навигация между страницами в SPA приложении',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 5,
        title: 'Node.js Basics',
        description: 'Основы серверного JavaScript',
        status: 'not-started',
        notes: '',
        category: 'backend'
    },
    {
        id: 6,
        title: 'Express.js',
        description: 'Создание серверных приложений на Node.js',
        status: 'not-started',
        notes: '',
        category: 'backend'
    },
    {
        id: 7,
        title: 'Database Concepts',
        description: 'Основы работы с базами данных',
        status: 'not-started',
        notes: '',
        category: 'backend'
    },
    {
        id: 8,
        title: 'REST API',
        description: 'Создание и использование RESTful API',
        status: 'not-started',
        notes: '',
        category: 'backend'
    }
];

function useTechnologies() {
    const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);

    // Функция для обновления статуса технологии
    const updateStatus = (techId, newStatus) => {
        setTechnologies(prev =>
            prev.map(tech =>
                tech.id === techId ? { ...tech, status: newStatus } : tech
            )
        );
    };

    // Функция для обновления заметок
    const updateNotes = (techId, newNotes) => {
        setTechnologies(prev =>
            prev.map(tech =>
                tech.id === techId ? { ...tech, notes: newNotes } : tech
            )
        );
    };

    // Функция для отметки всех как выполненных
    const markAllAsCompleted = () => {
        setTechnologies(prev =>
            prev.map(tech => ({ ...tech, status: 'completed' }))
        );
    };

    // Функция для сброса всех статусов
    const resetAllStatuses = () => {
        setTechnologies(prev =>
            prev.map(tech => ({ ...tech, status: 'not-started' }))
        );
    };

    // Функция для расчета общего прогресса
    const calculateProgress = () => {
        if (technologies.length === 0) return 0;
        const completed = technologies.filter(tech => tech.status === 'completed').length;
        return Math.round((completed / technologies.length) * 100);
    };

    // Функция для получения количества не начатых технологий
    const getNotStartedCount = () => {
        return technologies.filter(tech => tech.status === 'not-started').length;
    };

    // Функция для случайного выбора следующей технологии
    const randomNextTechnology = () => {
        const notStartedTech = technologies.filter(tech => tech.status === 'not-started');
        if (notStartedTech.length === 0) return null;

        const randomTech = notStartedTech[Math.floor(Math.random() * notStartedTech.length)];
        updateStatus(randomTech.id, 'in-progress');
        return randomTech;
    };

    return {
        technologies,
        updateStatus,
        updateNotes,
        markAllAsCompleted,
        resetAllStatuses,
        randomNextTechnology,
        progress: calculateProgress(),
        notStartedCount: getNotStartedCount()
    };
}

export default useTechnologies;