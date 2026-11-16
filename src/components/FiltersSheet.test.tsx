import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { FiltersSheet } from './FiltersSheet';

const setup = (overrides: Partial<React.ComponentProps<typeof FiltersSheet>> = {}) => {
    const onToggle = jest.fn();
    const onClearFilters = jest.fn();
    const onSortOrderChange = jest.fn();
    render(
        <FiltersSheet
            groups={[
                {
                    key: 'sources',
                    label: 'Źródło',
                    options: [
                        { key: 'TED', label: 'TED', count: 5, checked: true },
                        { key: 'EZ', label: 'eZamówienia', count: 0, checked: false }
                    ],
                    onToggle
                }
            ]}
            activeCount={2}
            hasActiveFilters
            onClearFilters={onClearFilters}
            sortOrder="publication"
            sortOptions={[
                { value: 'publication', label: 'Data publikacji (najnowsze)' },
                { value: 'buyer', label: 'Zamawiający (A–Z)' }
            ]}
            onSortOrderChange={onSortOrderChange}
            hiddenAdvertisersCount={0}
            showHiddenAdvertisers={false}
            onShowHiddenAdvertisersChange={jest.fn()}
            {...overrides}
        />
    );
    return { onToggle, onClearFilters, onSortOrderChange };
};

const trigger = () => screen.getByRole('button', { name: 'Filtry, aktywne: 2' });

describe('FiltersSheet', () => {
    it('pokazuje jeden przycisk z liczbą aktywnych filtrów, a arkusz jest zamknięty', () => {
        setup();
        expect(trigger().getAttribute('aria-expanded')).toBe('false');
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('otwiera arkusz z grupami filtrów, liczbami i sortowaniem', () => {
        setup();
        fireEvent.click(trigger());
        expect(screen.getByRole('dialog', { name: 'Filtry' })).toBeTruthy();
        expect(screen.getByRole('checkbox', { name: /TED/ })).toBeTruthy();
        expect(screen.getByRole('combobox', { name: 'Sortuj' })).toBeTruthy();
    });

    it('przekazuje wybór opcji i sortowania', () => {
        const { onToggle, onSortOrderChange } = setup();
        fireEvent.click(trigger());
        fireEvent.click(screen.getByRole('checkbox', { name: /eZamówienia/ }));
        expect(onToggle).toHaveBeenCalledWith('EZ');
        fireEvent.change(screen.getByRole('combobox', { name: 'Sortuj' }), { target: { value: 'buyer' } });
        expect(onSortOrderChange).toHaveBeenCalledWith('buyer');
    });

    it('wyczyść filtry jest tylko przy aktywnych filtrach', () => {
        const { onClearFilters } = setup();
        fireEvent.click(trigger());
        fireEvent.click(screen.getByRole('button', { name: 'Wyczyść filtry' }));
        expect(onClearFilters).toHaveBeenCalledTimes(1);
    });

    it('bez aktywnych filtrów nie pokazuje "Wyczyść filtry"', () => {
        setup({ hasActiveFilters: false, activeCount: 0 });
        fireEvent.click(screen.getByRole('button', { name: 'Filtry' }));
        expect(screen.queryByRole('button', { name: 'Wyczyść filtry' })).toBeNull();
    });

    it('Escape i "Gotowe" zamykają arkusz, a fokus wraca na przycisk', () => {
        setup();
        fireEvent.click(trigger());
        fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
        expect(screen.queryByRole('dialog')).toBeNull();
        expect(document.activeElement).toBe(trigger());

        fireEvent.click(trigger());
        fireEvent.click(screen.getByRole('button', { name: 'Gotowe' }));
        expect(screen.queryByRole('dialog')).toBeNull();
    });
});
