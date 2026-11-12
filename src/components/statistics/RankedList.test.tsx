import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { RankedList } from './RankedList';

const items = [
    { key: 'a', name: 'Alfa', count: 3 },
    { key: 'b', name: 'Beta', count: 1 }
];

describe('RankedList', () => {
    it('renders names and counts as plain rows when there is no click handler', () => {
        render(<RankedList items={items} />);
        expect(screen.queryByText('Alfa')).not.toBeNull();
        expect(screen.queryByText('3')).not.toBeNull();
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('renders buttons that report the clicked key', () => {
        const onSelect = jest.fn();
        render(<RankedList items={items} onSelect={onSelect} />);
        fireEvent.click(screen.getByRole('button', { name: /Beta/ }));
        expect(onSelect).toHaveBeenCalledWith('b');
    });

    it('shows rank numbers only when asked to', () => {
        const { rerender } = render(<RankedList items={items} />);
        expect(screen.queryByText('1.')).toBeNull();
        rerender(<RankedList items={items} showRank />);
        expect(screen.queryByText('1.')).not.toBeNull();
        expect(screen.queryByText('2.')).not.toBeNull();
    });

    it('shows share bars only when a total is given', () => {
        const { container, rerender } = render(<RankedList items={items} />);
        expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
        rerender(<RankedList items={items} shareTotal={4} />);
        expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
    });
});
