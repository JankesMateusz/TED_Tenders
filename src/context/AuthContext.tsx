import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
    User,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInAnonymously,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { auth } from '../firebase';

export type Role = 'admin' | 'member';

/** Podpis w statusach i komentarzach osób bez adresu e-mail (logowanie anonimowe). */
export const GUEST_LABEL = 'Gość';

interface AuthContextType {
    user: User | null;
    /** Rola z custom claim; null, gdy konto nie ma jeszcze nadanego dostępu. */
    role: Role | null;
    /** True do czasu pierwszego ustalenia stanu zalogowania i roli. */
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    /** Pobiera od nowa rolę z serwera (po nadaniu dostępu przez admina). */
    refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readRole = async (user: User, forceRefresh: boolean): Promise<Role | null> => {
    // TYMCZASOWO (otwarty dostęp): odwiedzający zalogowany anonimowo jest członkiem
    if (user.isAnonymous) return 'member';
    const { claims } = await user.getIdTokenResult(forceRefresh);
    return claims.role === 'admin' || claims.role === 'member' ? claims.role : null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        return onAuthStateChanged(auth, async (nextUser) => {
            if (!nextUser) {
                // TYMCZASOWO (otwarty dostęp): bez ekranu logowania; po udanym logowaniu anonimowym
                // listener odpali się ponownie z użytkownikiem. Gdy się nie uda (np. wyłączone
                // logowanie anonimowe w Firebase), zostaje zwykły ekran logowania.
                try {
                    await signInAnonymously(auth);
                    return;
                } catch (error) {
                    console.error('Logowanie anonimowe nie powiodło się:', error);
                }
            }
            setUser(nextUser);
            try {
                setRole(nextUser ? await readRole(nextUser, false) : null);
            } catch (error) {
                console.error('Nie udało się odczytać roli użytkownika:', error);
                setRole(null);
            } finally {
                setLoading(false);
            }
        });
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    }, []);

    const logout = useCallback(async () => {
        await signOut(auth);
    }, []);

    const resetPassword = useCallback(async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    }, []);

    const refreshRole = useCallback(async () => {
        if (auth.currentUser) {
            setRole(await readRole(auth.currentUser, true));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, loading, login, logout, resetPassword, refreshRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
