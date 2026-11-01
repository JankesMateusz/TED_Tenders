import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

const LOGIN_ERROR_MESSAGES: Record<string, string> = {
    'auth/invalid-credential': 'Nieprawidłowy email lub hasło.',
    'auth/invalid-email': 'Nieprawidłowy adres email.',
    'auth/user-disabled': 'To konto zostało wyłączone.',
    'auth/too-many-requests': 'Zbyt wiele prób. Spróbuj ponownie za chwilę.',
    'auth/network-request-failed': 'Brak połączenia z serwerem.'
};

const getErrorMessage = (error: unknown): string => {
    const code = (error as { code?: string })?.code ?? '';
    return LOGIN_ERROR_MESSAGES[code] ?? 'Nie udało się zalogować. Spróbuj ponownie.';
};

/** Bez `onClose` pełny ekran logowania; z `onClose` okno nad aplikacją (logowanie gościa). */
const LoginScreen: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
    const { login, resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setInfo(null);
        setIsSubmitting(true);
        try {
            await login(email.trim(), password);
            onClose?.();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetPassword = async () => {
        setError(null);
        setInfo(null);
        if (!email.trim()) {
            setError('Wpisz adres email, aby zresetować hasło.');
            return;
        }
        try {
            await resetPassword(email.trim());
        } catch (err) {
            // Celowo nie ujawniamy, czy konto istnieje; błędy sieci i walidacji pokazujemy zwykłym komunikatem.
            console.warn('Reset hasła nie powiódł się:', err);
        }
        setInfo('Jeśli konto istnieje, wysłaliśmy na ten adres link do zmiany hasła.');
    };

    return (
        <div className={onClose ? styles.overlay : styles.screen} onClick={onClose}>
            <form className={styles.card} onSubmit={handleSubmit} onClick={(event) => event.stopPropagation()}>
                <h1 className={styles.title}>Zamówienia TED</h1>
                <p className={styles.subtitle}>Zaloguj się, aby zobaczyć przetargi.</p>

                <label className={styles.label} htmlFor="login-email">Email</label>
                <input
                    id="login-email"
                    className={styles.input}
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <label className={styles.label} htmlFor="login-password">Hasło</label>
                <input
                    id="login-password"
                    className={styles.input}
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />

                {error && <p className={styles.error} role="alert">{error}</p>}
                {info && <p className={styles.info} role="status">{info}</p>}

                <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Logowanie...' : 'Zaloguj się'}
                </button>
                <button className={styles.linkButton} type="button" onClick={handleResetPassword}>
                    Nie pamiętam hasła
                </button>
                {onClose && (
                    <button className={styles.linkButton} type="button" onClick={onClose}>
                        Anuluj
                    </button>
                )}
            </form>
        </div>
    );
};

export default LoginScreen;
