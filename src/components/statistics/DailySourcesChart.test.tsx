import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { TenderSource } from '../../types/TenderSource';
import { DailySourcesChart } from './DailySourcesChart';

const day = (ted: number, ezam: number, baza: number) => ({
    [TenderSource.TED]: ted,
    [TenderSource.E_ZAMOWIENIA]: ezam,
    [TenderSource.BAZA_KONKURENCYJNOSCI]: baza
});

describe('DailySourcesChart', () => {
    it('renders nothing for a single day', () => {
        const { container } = render(<DailySourcesChart distribution={{ '10-11-2026': day(1, 2, 3) }} />);
        expect(container.innerHTML).toBe('');
    });

    it('renders the legend with all three sources for several days', () => {
        render(<DailySourcesChart distribution={{ '10-11-2026': day(1, 2, 3), '11-11-2026': day(0, 4, 0) }} />);
        expect(screen.queryByText('TED')).not.toBeNull();
        expect(screen.queryByText('eZamówienia')).not.toBeNull();
        expect(screen.queryByText('Baza Konkurencyjności')).not.toBeNull();
    });

    it('shows per-source counts and the total in the tooltip on hover, skipping empty sources', () => {
        render(<DailySourcesChart distribution={{ '10-11-2026': day(1, 2, 0), '11-11-2026': day(0, 4, 0) }} />);
        expect(screen.queryByText('Łącznie: 3')).toBeNull();

        fireEvent.mouseEnter(screen.getByText('10').parentElement as HTMLElement);
        expect(screen.queryByText('TED: 1')).not.toBeNull();
        expect(screen.queryByText('eZamówienia: 2')).not.toBeNull();
        expect(screen.queryByText(/^Baza:/)).toBeNull();
        expect(screen.queryByText('Łącznie: 3')).not.toBeNull();

        fireEvent.mouseLeave(screen.getByText('10').parentElement as HTMLElement);
        expect(screen.queryByText('Łącznie: 3')).toBeNull();
    });
});
