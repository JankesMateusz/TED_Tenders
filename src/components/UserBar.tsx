import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOnlineUsers, useReportPresence } from '../hooks/usePresence';
import AdminPanel from './AdminPanel';
import LoginScreen from './LoginScreen';
import styles from './Auth.module.css';

const UserBar: React.FC = () => {
    const { user, role, logout } = useAuth();
    const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const isGuest = !user || user.isAnonymous;
    const isAdmin = role === 'admin';

    useReportPresence();
    const online = useOnlineUsers(isAdmin);

    return (
        <div className={styles.userBar}>
            {!isGuest && <span>{user?.email}</span>}
            {isAdmin && (
                <button className={styles.userBarButton} type="button" onClick={() => setIsAdminPanelOpen(true)}>
                    Użytkownicy ({online.length} online)
                </button>
            )}
            {isGuest ? (
                <button className={styles.userBarButton} type="button" onClick={() => setIsLoginOpen(true)}>
                    Zaloguj się
                </button>
            ) : (
                <button className={styles.userBarButton} type="button" onClick={logout}>
                    Wyloguj
                </button>
            )}
            {isAdminPanelOpen && <AdminPanel online={online} onClose={() => setIsAdminPanelOpen(false)} />}
            {isLoginOpen && isGuest && <LoginScreen onClose={() => setIsLoginOpen(false)} />}
        </div>
    );
};

export default UserBar;
