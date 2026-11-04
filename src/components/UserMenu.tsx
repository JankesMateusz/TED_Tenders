import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOnlineUsers, useReportPresence } from '../hooks/usePresence';
import AdminPanel from './AdminPanel';
import LoginScreen from './LoginScreen';
import styles from './Header.module.css';

/** Konto użytkownika w pasku aplikacji: e-mail, okno użytkowników (administrator), logowanie i wylogowanie. */
const UserMenu: React.FC = () => {
    const { user, role, logout } = useAuth();
    const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const isGuest = !user || user.isAnonymous;
    const isAdmin = role === 'admin';

    // Obecność jest zgłaszana raz, dla każdego zalogowanego (także gościa), dopóki pasek jest na ekranie
    useReportPresence();
    const online = useOnlineUsers(isAdmin);

    return (
        <div className={styles.userMenu}>
            {!isGuest && <span className={styles.userEmail} title={user?.email ?? undefined}>{user?.email}</span>}
            {isAdmin && (
                <button
                    className={styles.button}
                    type="button"
                    onClick={() => setIsAdminPanelOpen(true)}
                    aria-label={`Użytkownicy (${online.length} online)`}
                    title={`Użytkownicy (${online.length} online)`}
                >
                    <span className={styles.onlineDot} aria-hidden="true" />
                    {online.length} online
                </button>
            )}
            {isGuest ? (
                <button className={styles.button} type="button" onClick={() => setIsLoginOpen(true)}>
                    Zaloguj się
                </button>
            ) : (
                <button className={styles.button} type="button" onClick={logout}>
                    Wyloguj
                </button>
            )}
            {isAdminPanelOpen && <AdminPanel online={online} onClose={() => setIsAdminPanelOpen(false)} />}
            {isLoginOpen && isGuest && <LoginScreen onClose={() => setIsLoginOpen(false)} />}
        </div>
    );
};

export default UserMenu;
