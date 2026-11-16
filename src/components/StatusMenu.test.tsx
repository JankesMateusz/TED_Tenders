import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import StatusMenu from './StatusMenu';

const setup = () => {
    const onToggle = jest.fn();
    render(
        <>
            <StatusMenu
                status="entered"
                statusByEmail="anna@example.com"
                statusAt={new Date(2026, 9, 29, 14, 32)}
                editable
                onToggle={onToggle}
            />
            <button>poza menu</button>
        </>
    );
    return onToggle;
};

describe('StatusMenu: dostępność', () => {
    it('przycisk ma pełną nazwę ze statusem, autorem i czasem', () => {
        setup();
        expect(screen.getByRole('button', { name: 'Status: Wpisany, anna@example.com, 29.10 14:32' })).toBeTruthy();
    });

    it('pozycje menu mają numer skrótu klawiszowego', () => {
        setup();
        fireEvent.click(screen.getByRole('button', { name: /Status: Wpisany/ }));
        const items = screen.getAllByRole('menuitemradio');
        expect(items.map((item) => item.getAttribute('aria-keyshortcuts'))).toEqual(['1', '2', '3', '4']);
    });

    it('zamyka się, gdy fokus przejdzie na element poza menu', () => {
        setup();
        const trigger = screen.getByRole('button', { name: /Status: Wpisany/ });
        fireEvent.click(trigger);
        expect(screen.getByRole('menu')).toBeTruthy();

        const outside = screen.getByRole('button', { name: 'poza menu' });
        fireEvent.blur(screen.getAllByRole('menuitemradio')[0], { relatedTarget: outside });
        expect(screen.queryByRole('menu')).toBeNull();
    });

    it('nie zamyka się przy zdarzeniu bez nowego celu fokusu (przełączenie okna)', () => {
        setup();
        fireEvent.click(screen.getByRole('button', { name: /Status: Wpisany/ }));
        fireEvent.blur(screen.getAllByRole('menuitemradio')[0], { relatedTarget: null });
        expect(screen.getByRole('menu')).toBeTruthy();
    });
});
