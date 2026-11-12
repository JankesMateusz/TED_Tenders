import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Statistics, calculateStatistics } from '../../utils/calculateStatistics';
import { TenderSource } from '../../types/TenderSource';
import { DeltaBadge } from './DeltaBadge';
import { SummaryCards } from './SummaryCards';
import type { StatisticsComparison } from './types';

const emptyStatistics = calculateStatistics([]);

/** Statystyki z podanymi sumami; reszta pól jak dla pustej listy. */
const statisticsWith = (overrides: Partial<Statistics>): Statistics => ({ ...emptyStatistics, ...overrides });

const current = statisticsWith({
    total: 10,
    byStatus: { ...emptyStatistics.byStatus, unmarked: 4, entered: 6 },
    bySource: { ...emptyStatistics.bySource, [TenderSource.TED]: 10 }
});

const ready = (previousTotal: number, isCurrentPeriodOngoing: boolean): StatisticsComparison => ({
    status: 'ready',
    label: 'wczoraj',
    isCurrentPeriodOngoing,
    statistics: statisticsWith({ total: previousTotal })
});

describe('DeltaBadge', () => {
    it('renders nothing without a previous value', () => {
        const { container } = render(<DeltaBadge current={5} previous={undefined} isPeriodOngoing={false} />);
        expect(container.innerHTML).toBe('');
    });

    it('shows the difference against the previous period', () => {
        render(<DeltaBadge current={5} previous={3} isPeriodOngoing={false} />);
        expect(screen.queryByText('+2')).not.toBeNull();
    });

    it('shows "bez zmian" when nothing changed', () => {
        render(<DeltaBadge current={3} previous={3} isPeriodOngoing={false} />);
        expect(screen.queryByText('bez zmian')).not.toBeNull();
    });

    it('shows the previous value instead of a difference while the current period is ongoing', () => {
        render(<DeltaBadge current={5} previous={30} isPeriodOngoing />);
        expect(screen.queryByText('poprzednio: 30')).not.toBeNull();
        expect(screen.queryByText(/^[+−]/)).toBeNull();
    });
});

describe('SummaryCards', () => {
    it('shows review progress only when there are tenders', () => {
        const { rerender } = render(<SummaryCards statistics={emptyStatistics} comparison={null} onDrillDown={jest.fn()} />);
        expect(screen.queryByRole('progressbar')).toBeNull();

        rerender(<SummaryCards statistics={current} comparison={null} onDrillDown={jest.fn()} />);
        const bar = screen.getByRole('progressbar');
        expect(bar.getAttribute('aria-valuenow')).toBe('6');
        expect(bar.getAttribute('aria-valuemax')).toBe('10');
        expect(screen.queryByText('60%')).not.toBeNull();
    });

    it('reports a status drill-down when a status card is clicked', () => {
        const onDrillDown = jest.fn();
        render(<SummaryCards statistics={current} comparison={null} onDrillDown={onDrillDown} />);
        fireEvent.click(screen.getByRole('button', { name: /Wpisany/ }));
        expect(onDrillDown).toHaveBeenCalledWith({ kind: 'status', status: 'entered' });
    });

    it('reports a source drill-down when a source row is clicked', () => {
        const onDrillDown = jest.fn();
        render(<SummaryCards statistics={current} comparison={null} onDrillDown={onDrillDown} />);
        fireEvent.click(screen.getAllByRole('button').filter((button) => button.textContent?.includes('TED'))[0]);
        expect(onDrillDown).toHaveBeenCalledWith({ kind: 'source', source: TenderSource.TED });
    });

    it('shows the delta of the total only when the comparison is ready', () => {
        const { rerender } = render(<SummaryCards statistics={current} comparison={null} onDrillDown={jest.fn()} />);
        expect(screen.queryByText('+3')).toBeNull();

        rerender(<SummaryCards statistics={current} comparison={{ status: 'loading' }} onDrillDown={jest.fn()} />);
        expect(screen.queryByText('+3')).toBeNull();

        rerender(<SummaryCards statistics={current} comparison={ready(7, false)} onDrillDown={jest.fn()} />);
        expect(screen.queryAllByText('+3').length).toBeGreaterThan(0);

        rerender(<SummaryCards statistics={current} comparison={ready(7, true)} onDrillDown={jest.fn()} />);
        expect(screen.queryAllByText('poprzednio: 7').length).toBeGreaterThan(0);
    });
});
