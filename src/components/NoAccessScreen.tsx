import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

const NoAccessScreen: React.FC = () => {
    const { user, logout, refreshRole } = useAuth();
    const [isChecking, setIsChecking] = useState(false);

    const handleRecheck = async () => {
        setIsChecking(true);
        try {
            await refreshRole();
        } catch (error) {
            console.error('Nie udało się odświeżyć uprawnień:', error);
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className={styles.screen}>
            <div className={styles.card}>
                <h1 className={styles.title}>Brak dostępu</h1>
                <p className={styles.subtitle}>
                    Konto {user?.email} nie ma jeszcze nadanych uprawnień. Poproś administratora o zaproszenie.
                </p>
                <button className={styles.primaryButton} type="button" onClick={handleRecheck} disabled={isChecking}>
                    {isChecking ? 'Sprawdzanie...' : 'Sprawdź ponownie'}
                </button>
                <button className={styles.linkButton} type="button" onClick={logout}>
                    Wyloguj się
                </button>
            </div>
        </div>
    );
};

export default NoAccessScreen;
