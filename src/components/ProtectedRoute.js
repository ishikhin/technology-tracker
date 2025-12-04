import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children, isLoggedIn, isChecking = false }) {
    const location = useLocation();

    // Если идет проверка авторизации - показываем загрузку
    if (isChecking) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Проверка доступа...</p>
            </div>
        );
    }

    // Если не авторизован - перенаправляем на логин с сохранением текущего пути
    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

export default ProtectedRoute;