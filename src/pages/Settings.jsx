// Settings.jsx
import { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import './Settings.css';

function Settings() {
    const { darkMode, toggleDarkMode } = useTheme();
    const [settings, setSettings] = useState({
        userName: localStorage.getItem('username') || '',
        notifications: localStorage.getItem('notifications') === 'true' || true
    });

    // Загружаем настройки при монтировании
    useEffect(() => {
        const savedUserName = localStorage.getItem('username') || '';
        const savedNotifications = localStorage.getItem('notifications') === 'true' || true;

        setSettings({
            userName: savedUserName,
            notifications: savedNotifications
        });
    }, []);

    const handleSave = () => {
        // Сохраняем имя пользователя
        localStorage.setItem('username', settings.userName);
        localStorage.setItem('notifications', settings.notifications);

        // Обновляем страницу для применения изменений
        window.location.reload();
        alert('Настройки сохранены!');
    };

    const handleThemeChange = (isDark) => {
        if (isDark !== darkMode) {
            toggleDarkMode();
        }
    };

    const handleResetData = () => {
        if (window.confirm('Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.')) {
            localStorage.removeItem('technologies');
            alert('Все данные удалены!');
            window.location.reload();
        }
    };

    const handleExportData = () => {
        const data = localStorage.getItem('technologies');
        const blob = new Blob([data || '[]'], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'technologies-backup.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImportData = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    localStorage.setItem('technologies', JSON.stringify(data));
                    alert('Данные успешно импортированы!');
                    window.location.reload();
                } catch (error) {
                    alert('Ошибка при импорте данных. Проверьте формат файла.');
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="page">
            <h1>Настройки приложения</h1>

            <div className="settings-section">
                <h3>Основные настройки</h3>

                <div className="setting-item">
                    <label>Имя пользователя:</label>
                    <input
                        type="text"
                        value={settings.userName}
                        onChange={(e) => setSettings({...settings, userName: e.target.value})}
                        placeholder="Введите ваше имя"
                    />
                    <div className="setting-hint">
                         Имя будет отображаться в навигационной панели
                    </div>
                </div>

                <div className="setting-item">
                    <label>Тема оформления:</label>
                    <div className="theme-selector">
                        <button
                            className={`theme-option ${!darkMode ? 'active' : ''}`}
                            onClick={() => handleThemeChange(false)}
                        >
                            <div className="theme-preview light-theme"></div>
                            <span>Светлая</span>
                        </button>
                        <button
                            className={`theme-option ${darkMode ? 'active' : ''}`}
                            onClick={() => handleThemeChange(true)}
                        >
                            <div className="theme-preview dark-theme"></div>
                            <span>Темная</span>
                        </button>
                    </div>
                    <div className="setting-hint">
                         Текущая тема: {darkMode ? 'Темная' : 'Светлая'}
                    </div>
                </div>

                <div className="setting-item">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={settings.notifications}
                            onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                        />


                    </label>
                </div>
            </div>

            <div className="settings-section">
                <h3>Управление данными</h3>

                <div className="data-actions">
                    <button onClick={handleExportData} className="btn btn-secondary">
                         Экспорт данных
                    </button>

                    <label className="btn btn-secondary">
                         Импорт данных
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImportData}
                            style={{ display: 'none' }}
                        />
                    </label>

                    <button onClick={handleResetData} className="btn btn-danger">
                         Удалить все данные
                    </button>
                </div>
                <div className="setting-hint">
                     Удаление данных невозможно отменить. Будьте осторожны!
                </div>
            </div>

            <div className="settings-actions">
                <button onClick={handleSave} className="btn btn-primary">
                     Сохранить настройки
                </button>
            </div>

            <div className="app-info">
                <h3>О приложении</h3>
                <p> Трекер технологий</p>
            </div>
        </div>
    );
}

export default Settings;