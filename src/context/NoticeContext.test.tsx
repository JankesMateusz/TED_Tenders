import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { NoticeProvider, useNotice } from './NoticeContext';

type Api = ReturnType<typeof useNotice>;

/** Wystawia API kontekstu na zewnątrz, żeby testy mogły je wołać tak, jak robi to aplikacja (skrót U, kolejne zmiany). */
let api: Api;
const Capture: React.FC = () => {
    api = useNotice();
    return null;
};

const setup = () => {
    render(
        <NoticeProvider>
            <Capture />
        </NoticeProvider>
    );
};

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe('NoticeProvider: komunikaty', () => {
    it('pokazuje komunikat w regionie statusu', () => {
        setup();
        act(() => api.showNotice({ message: 'Status: Wpisany.' }));
        expect(screen.getByRole('status').textContent).toContain('Status: Wpisany.');
    });

    it('znika sam po kilku sekundach', () => {
        setup();
        act(() => api.showNotice({ message: 'Status: Wpisany.' }));
        act(() => {
            jest.advanceTimersByTime(8100);
        });
        expect(screen.queryByText('Status: Wpisany.')).toBeNull();
    });

    it('nie znika, dopóki wskaźnik jest nad komunikatem', () => {
        setup();
        act(() => api.showNotice({ message: 'Status: Wpisany.', onUndo: jest.fn() }));
        const button = screen.getByRole('button', { name: /Cofnij/ });
        fireEvent.mouseEnter(button);
        act(() => {
            jest.advanceTimersByTime(20000);
        });
        expect(screen.getByText('Status: Wpisany.')).toBeTruthy();
        fireEvent.mouseLeave(button);
        act(() => {
            jest.advanceTimersByTime(8100);
        });
        expect(screen.queryByText('Status: Wpisany.')).toBeNull();
    });

    it('komunikat bez cofnięcia nie ma przycisku "Cofnij"', () => {
        setup();
        act(() => api.showNotice({ message: 'Karta zniknęła z listy.' }));
        expect(screen.queryByRole('button', { name: /Cofnij/ })).toBeNull();
    });
});

describe('NoticeProvider: stos cofnięć', () => {
    it('przycisk "Cofnij" wykonuje cofnięcie i potwierdza je', () => {
        setup();
        const undo = jest.fn();
        act(() => api.showNotice({ message: 'Status: Wpisany.', onUndo: undo }));
        fireEvent.click(screen.getByRole('button', { name: /Cofnij/ }));
        expect(undo).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Cofnięto zmianę.')).toBeTruthy();
    });

    it('skrót cofa kolejne zmiany od najnowszej, także gdy komunikaty dawno zniknęły', () => {
        setup();
        const calls: string[] = [];
        act(() => api.showNotice({ message: 'pierwsza', onUndo: () => calls.push('pierwsza') }));
        act(() => api.showNotice({ message: 'druga', onUndo: () => calls.push('druga') }));
        act(() => api.showNotice({ message: 'trzecia', onUndo: () => calls.push('trzecia') }));
        act(() => {
            jest.advanceTimersByTime(10000);
        });
        expect(screen.queryByText('trzecia')).toBeNull();

        act(() => {
            api.undoLast();
        });
        act(() => {
            api.undoLast();
        });
        expect(calls).toEqual(['trzecia', 'druga']);
    });

    it('cofnięta zmiana nie wraca na stos', () => {
        setup();
        const undo = jest.fn();
        act(() => api.showNotice({ message: 'zmiana', onUndo: undo }));
        fireEvent.click(screen.getByRole('button', { name: /Cofnij/ }));
        let result = true;
        act(() => {
            result = api.undoLast();
        });
        expect(result).toBe(false);
        expect(undo).toHaveBeenCalledTimes(1);
    });

    it('bez zmian do cofnięcia mówi o tym i zwraca false', () => {
        setup();
        let result = true;
        act(() => {
            result = api.undoLast();
        });
        expect(result).toBe(false);
        expect(screen.getByText('Nie ma zmiany do cofnięcia.')).toBeTruthy();
    });

    it('zbyt stara zmiana nie jest cofana, żeby nie nadpisać nowszej decyzji kolegi', () => {
        setup();
        const undo = jest.fn();
        act(() => api.showNotice({ message: 'stara', onUndo: undo }));
        act(() => {
            jest.advanceTimersByTime(5 * 60 * 1000 + 1000);
        });
        act(() => {
            api.undoLast();
        });
        expect(undo).not.toHaveBeenCalled();
    });

    it('stos ma limit 20 ostatnich zmian', () => {
        setup();
        const undone: number[] = [];
        act(() => {
            for (let i = 1; i <= 25; i++) api.showNotice({ message: `zmiana ${i}`, onUndo: () => undone.push(i) });
        });
        act(() => {
            for (let i = 0; i < 30; i++) api.undoLast();
        });
        expect(undone).toHaveLength(20);
        expect(undone[0]).toBe(25);
        expect(undone[19]).toBe(6);
    });
});
