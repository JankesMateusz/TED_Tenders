import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ModuleMenu from './ModuleMenu';
import { AppModule } from '../modules';

const modules = (ordersEnabled = true): AppModule[] => [
    { id: 'tenders', label: 'Przetargi', hash: '', enabled: true },
    { id: 'orders', label: 'Zamówienia', hash: '#/zamowienia', enabled: ordersEnabled },
];

const trigger = () => screen.getByRole('button', { name: 'Menu modułów' });

beforeEach(() => {
    window.location.hash = '';
});

describe('ModuleMenu', () => {
    it('nic nie renderuje, gdy dostępny jest jeden moduł (nagłówek bez zmian)', () => {
        const { container } = render(<ModuleMenu current="tenders" modules={modules(false)} />);
        expect(container.innerHTML).toBe('');
    });

    it('przy domyślnym rejestrze modułów (flaga wyłączona) nic nie renderuje', () => {
        const { container } = render(<ModuleMenu current="tenders" />);
        expect(container.innerHTML).toBe('');
    });

    it('otwiera listę modułów i zaznacza bieżący', () => {
        render(<ModuleMenu current="orders" modules={modules()} />);
        expect(trigger().getAttribute('aria-expanded')).toBe('false');
        expect(screen.queryByRole('menu')).toBeNull();

        fireEvent.click(trigger());

        expect(trigger().getAttribute('aria-expanded')).toBe('true');
        const items = screen.getAllByRole('menuitem');
        expect(items.map((item) => item.textContent)).toEqual(['Przetargi', 'Zamówienia✓']);
        expect(items[1].getAttribute('aria-current')).toBe('page');
        expect(items[0].getAttribute('aria-current')).toBeNull();
        expect(document.activeElement).toBe(items[1]); // fokus na bieżącym module
    });

    it('Escape zamyka listę i oddaje fokus przyciskowi', () => {
        render(<ModuleMenu current="tenders" modules={modules()} />);
        fireEvent.click(trigger());
        fireEvent.keyDown(document, { key: 'Escape' });

        expect(screen.queryByRole('menu')).toBeNull();
        expect(document.activeElement).toBe(trigger());
    });

    it('kliknięcie poza menu zamyka listę', () => {
        render(<ModuleMenu current="tenders" modules={modules()} />);
        fireEvent.click(trigger());
        fireEvent.mouseDown(document.body);

        expect(screen.queryByRole('menu')).toBeNull();
    });

    it('wybór innego modułu zmienia adres i zamyka listę', () => {
        render(<ModuleMenu current="tenders" modules={modules()} />);
        fireEvent.click(trigger());
        fireEvent.click(screen.getByRole('menuitem', { name: 'Zamówienia' }));

        expect(window.location.hash).toBe('#/zamowienia');
        expect(screen.queryByRole('menu')).toBeNull();
    });

    it('wybór bieżącego modułu nie zmienia adresu', () => {
        window.location.hash = '#/zamowienia/5';
        render(<ModuleMenu current="orders" modules={modules()} />);
        fireEvent.click(trigger());
        fireEvent.click(screen.getByRole('menuitem', { name: /Zamówienia/ }));

        expect(window.location.hash).toBe('#/zamowienia/5');
    });

    it('strzałki przesuwają fokus cyklicznie, Home i End skaczą na krańce', () => {
        render(<ModuleMenu current="tenders" modules={modules()} />);
        fireEvent.click(trigger());
        const [first, second] = screen.getAllByRole('menuitem');
        expect(document.activeElement).toBe(first);

        fireEvent.keyDown(first, { key: 'ArrowDown' });
        expect(document.activeElement).toBe(second);
        fireEvent.keyDown(second, { key: 'ArrowDown' });
        expect(document.activeElement).toBe(first); // zawinięcie
        fireEvent.keyDown(first, { key: 'End' });
        expect(document.activeElement).toBe(second);
        fireEvent.keyDown(second, { key: 'Home' });
        expect(document.activeElement).toBe(first);
        fireEvent.keyDown(first, { key: 'ArrowUp' });
        expect(document.activeElement).toBe(second);
    });
});
