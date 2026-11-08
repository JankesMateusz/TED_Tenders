import { useEffect, useState } from 'react';

/** Aktualny hash adresu (np. "#/zamowienia"), odświeżany przy każdej zmianie, także przyciskiem "wstecz". */
export const useHashRoute = (): string => {
    const [hash, setHash] = useState<string>(() => window.location.hash);

    useEffect(() => {
        const handleChange = () => setHash(window.location.hash);
        window.addEventListener('hashchange', handleChange);
        return () => window.removeEventListener('hashchange', handleChange);
    }, []);

    return hash;
};
