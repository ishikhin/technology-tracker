import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Получаем полный объект location из state
    const from = location.state?.from || { pathname: '/' };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Имитация задержки аутентификации
        setTimeout(() => {
            // Простая проверка - в реальном приложении здесь был бы запрос к API
            if (username && password) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);

                // Вызываем колбэк для обновления состояния в App
                onLogin(username);

                // Перенаправляем на сохраненную страницу или на главную
                navigate(from.pathname, { replace: true });
            } else {
                alert('Пожалуйста, заполните все поля');
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="page">
            <div className="login-container">
                <div className="login-card">
                    <h1>Вход в систему</h1>
                    <p className="login-subtitle">Трекер технологий</p>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="username">Имя пользователя:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Введите имя пользователя"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Пароль:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Введите пароль"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-primary login-btn ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Вход...' : 'Войти'}
                        </button>
                    </form>

                    <div className="login-demo">
                        <p><strong>Доступ:</strong></p>
                        <p>Любое имя пользователя и пароль</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;