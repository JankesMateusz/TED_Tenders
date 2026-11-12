import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import type { HourlyChartData } from './types';
import { HourlyActivityChart } from './HourlyActivityChart';

const hours = (byHour: Record<number, number>): number[] => Array.from({ length: 24 }, (_, hour) => byHour[hour] ?? 0);

const hourlyData = (overrides: Partial<HourlyChartData> = {}): HourlyChartData => ({
    days: ['11-11-2026', '10-11-2026'],
    distribution: {
        '11-11-2026': hours({ 9: 22, 10: 3 }),
        '10-11-2026': hours({ 8: 1 })
    },
    average: null,
    isLoading: false,
    error: null,
    onSelectDay: jest.fn(),
    ...overrides
});

const rangeDistribution = (hourly: HourlyChartData) => hourly.distribution;

const select = () => screen.getByRole('combobox') as HTMLSelectElement;

describe('HourlyActivityChart', () => {
    it('renders nothing when there are no days and no average', () => {
        const hourly = hourlyData({ days: [], distribution: {} });
        const { container } = render(<HourlyActivityChart hourly={hourly} rangeDistribution={{}} />);
        expect(container.innerHTML).toBe('');
    });

    it('selects the newest day of the range when there is no average, and reports it to the parent', () => {
        const hourly = hourlyData();
        render(<HourlyActivityChart hourly={hourly} rangeDistribution={rangeDistribution(hourly)} />);
        expect(select().value).toBe('11-11-2026');
        expect(hourly.onSelectDay).toHaveBeenLastCalledWith('11-11-2026');
        expect(screen.queryByText('Łącznie 25 ogłoszeń')).not.toBeNull();
    });

    it('prefers the average while the user has not picked a day, and reports no day to load', () => {
        const hourly = hourlyData({ average: { values: hours({ 9: 2.5 }), dayCount: 4, peakHour: 9 } });
        render(<HourlyActivityChart hourly={hourly} rangeDistribution={rangeDistribution(hourly)} />);
        expect(select().value).toBe('average');
        expect(hourly.onSelectDay).toHaveBeenLastCalledWith('');
        expect(screen.queryByText(/Średnio 2,5 dziennie · najlepsza godzina 09:00/)).not.toBeNull();
    });

    it('keeps the day the user picked and reports it to the parent', () => {
        const hourly = hourlyData({ average: { values: hours({ 9: 2.5 }), dayCount: 4, peakHour: 9 } });
        render(<HourlyActivityChart hourly={hourly} rangeDistribution={rangeDistribution(hourly)} />);
        fireEvent.change(select(), { target: { value: '10-11-2026' } });
        expect(select().value).toBe('10-11-2026');
        expect(hourly.onSelectDay).toHaveBeenLastCalledWith('10-11-2026');
        expect(screen.queryByText('Łącznie 1 ogłoszeń')).not.toBeNull();
    });

    it('shows a loading message instead of the total while the extra day is loading', () => {
        const hourly = hourlyData({ isLoading: true });
        render(<HourlyActivityChart hourly={hourly} rangeDistribution={rangeDistribution(hourly)} />);
        expect(screen.queryByText('Wczytywanie…')).not.toBeNull();
    });

    it('shows count and share in the tooltip on hover, with the right Polish plural', () => {
        const hourly = hourlyData();
        render(<HourlyActivityChart hourly={hourly} rangeDistribution={rangeDistribution(hourly)} />);
        expect(screen.queryByText('22 ogłoszenia')).toBeNull();
        // Etykieta godziny "09" jest tylko pod słupkiem; jej rodzic to opakowanie słupka z obsługą najechania
        fireEvent.mouseEnter(screen.getByText('09').parentElement as HTMLElement);
        expect(screen.queryByText('22 ogłoszenia')).not.toBeNull();
        expect(screen.queryByText('88.0%')).not.toBeNull();
        fireEvent.mouseLeave(screen.getByText('09').parentElement as HTMLElement);
        expect(screen.queryByText('22 ogłoszenia')).toBeNull();
    });
});
