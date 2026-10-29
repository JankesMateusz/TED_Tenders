import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminPanel from './AdminPanel';
import styles from './Auth.module.css';

const UserBar: React.FC = () => {
    const { user, role, logout } = useAuth();
    const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

    return (
        <div className={styles.userBar}>
            <span>{user?.email}</span>
            {role === 'admin' && (
                <button className={styles.userBarButton} type="button" onClick={() => setIsAdminPanelOpen(true)}>
                    Użytkownicy
                </button>
            )}
            <button className={styles.userBarButton} type="button" onClick={logout}>
                Wyloguj
            </button>
            {isAdminPanelOpen && <AdminPanel onClose={() => setIsAdminPanelOpen(false)} />}
        </div>
    );
};

export default UserBar;
