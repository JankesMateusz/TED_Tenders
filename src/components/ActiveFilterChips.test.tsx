import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ActiveFilterChips } from './ActiveFilterChips';

const noop = () => undefined;

describe('ActiveFilterChips: chip domyślnej kolejki', () => {
    it('pokazuje chip kolejki z akcją "Pokaż też ocenione"', () => {
        const onShowRated = jest.fn();
        render(
            <ActiveFilterChips chips={[]} onRemove={noop} hasActiveFilters={false} onClearFilters={noop} queueActive onShowRated={onShowRated} />
        );
        expect(screen.getByText('Tylko nieocenione')).toBeTruthy();
        fireEvent.click(screen.getByRole('button', { name: 'Pokaż też ocenione ogłoszenia' }));
        expect(onShowRated).toHaveBeenCalledTimes(1);
    });

    it('bez kolejki nie pokazuje tego chipa', () => {
        render(<ActiveFilterChips chips={[]} onRemove={noop} hasActiveFilters={false} onClearFilters={noop} />);
        expect(screen.queryByText('Tylko nieocenione')).toBeNull();
    });
});
