import React, { useCallback, useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import styles from './Auth.module.css';

interface UserProfile {
    uid: string;
    email: string;
    role: string;
}

interface InviteResult {
    email: string;
    role: string;
    link: string;
}

const inviteUser = httpsCallable<{ email: string }, InviteResult>(functions, 'inviteUser');

const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [listError, setListError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [isInviting, setIsInviting] = useState(false);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const [invite, setInvite] = useState<InviteResult | null>(null);
    const [copied, setCopied] = useState(false);

    const loadUsers = useCallback(async () => {
        try {
            const snapshot = await getDocs(query(collection(db, 'users'), orderBy('email')));
            setUsers(snapshot.docs.map((d) => ({ uid: d.id, email: d.data().email, role: d.data().role })));
            setListError(null);
        } catch (error) {
            console.error('Nie udało się pobrać listy użytkowników:', error);
            setListError('Nie udało się pobrać listy użytkowników.');
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleInvite = async (event: React.FormEvent) => {
        event.preventDefault();
        setInviteError(null);
        setInvite(null);
        setCopied(false);
        setIsInviting(true);
        try {
            const result = await inviteUser({ email: email.trim() });
            setInvite(result.data);
            setEmail('');
            await loadUsers();
        } catch (error) {
            console.error('Zaproszenie nie powiodło się:', error);
            setInviteError((error as { message?: string })?.message || 'Nie udało się wysłać zaproszenia.');
        } finally {
            setIsInviting(false);
        }
    };

    const handleCopy = async () => {
        if (!invite) return;
        try {
            await navigator.clipboard.writeText(invite.link);
            setCopied(true);
        } catch (error) {
            console.warn('Kopiowanie do schowka nie powiodło się:', error);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.panel} role="dialog" aria-label="Użytkownicy" onClick={(event) => event.stopPropagation()}>
                <div className={styles.panelHeader}>
                    <h2 style={{ margin: 0 }}>Użytkownicy</h2>
                    <button className={styles.userBarButton} type="button" onClick={onClose}>Zamknij</button>
                </div>

                <form className={styles.inviteRow} onSubmit={handleInvite}>
                    <input
                        className={styles.input}
                        type="email"
                        placeholder="Email zapraszanej osoby"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                    <button className={styles.primaryButton} style={{ margin: 0 }} type="submit" disabled={isInviting}>
                        {isInviting ? 'Zapraszanie...' : 'Zaproś'}
                    </button>
                </form>

                {inviteError && <p className={styles.error} role="alert">{inviteError}</p>}

                {invite && (
                    <div className={styles.linkBox}>
                        <strong>Konto {invite.email} gotowe.</strong> Przekaż tej osobie link do ustawienia hasła:
                        <code className={styles.linkText}>{invite.link}</code>
                        <button className={styles.userBarButton} type="button" onClick={handleCopy}>
                            {copied ? 'Skopiowano' : 'Kopiuj link'}
                        </button>
                    </div>
                )}

                {listError && <p className={styles.error} role="alert">{listError}</p>}
                <ul className={styles.userList}>
                    {users.map((u) => (
                        <li key={u.uid} className={styles.userItem}>
                            <span>{u.email}</span>
                            <span className={styles.role}>{u.role === 'admin' ? 'administrator' : 'członek'}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminPanel;
