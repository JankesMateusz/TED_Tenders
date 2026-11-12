import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { StatisticsNotices } from './StatisticsNotices';

const noop = () => undefined;

describe('StatisticsNotices', () => {
    it('renders nothing without filters and without a comparison', () => {
        const { container } = render(<StatisticsNotices hasActiveFilters={false} onClearFilters={noop} comparison={null} />);
        expect(container.innerHTML).toBe('');
    });

    it('offers to clear the filters when some are active', () => {
        const onClearFilters = jest.fn();
        render(<StatisticsNotices hasActiveFilters onClearFilters={onClearFilters} comparison={null} />);
        fireEvent.click(screen.getByRole('button', { name: 'Wyczyść filtry' }));
        expect(onClearFilters).toHaveBeenCalledTimes(1);
    });

    it('explains why the comparison is unavailable', () => {
        render(
            <StatisticsNotices hasActiveFilters={false} onClearFilters={noop} comparison={{ status: 'unavailable', reason: 'zbyt długi okres' }} />
        );
        expect(screen.queryByText(/Porównanie niedostępne: zbyt długi okres/)).not.toBeNull();
    });

    it('shows the loading state', () => {
        render(<StatisticsNotices hasActiveFilters={false} onClearFilters={noop} comparison={{ status: 'loading' }} />);
        expect(screen.queryByText('Wczytywanie danych do porównania...')).not.toBeNull();
    });

    it('lets the user fetch missing data and disables the button while fetching', () => {
        const onFetch = jest.fn();
        const missing = { status: 'missing' as const, label: 'wczoraj', isFetching: false, error: null, onFetch };
        const { rerender } = render(<StatisticsNotices hasActiveFilters={false} onClearFilters={noop} comparison={missing} />);
        fireEvent.click(screen.getByRole('button', { name: 'Pobierz dane z tego okresu' }));
        expect(onFetch).toHaveBeenCalledTimes(1);

        rerender(<StatisticsNotices hasActiveFilters={false} onClearFilters={noop} comparison={{ ...missing, isFetching: true }} />);
        const button = screen.getByRole('button', { name: 'Pobieranie...' }) as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });
});
