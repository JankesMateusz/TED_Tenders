import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { NoticeProvider, useNotice } from './NoticeContext';

const Trigger: React.FC<{ onAction: () => void }> = ({ onAction }) => {
    const { showNotice } = useNotice();
    return (
        <button onClick={() => showNotice({ message: 'Status: Wpisany.', actionLabel: 'Cofnij', onAction })}>pokaż</button>
    );
};

const setup = (onAction = jest.fn()) => {
    render(
        <NoticeProvider>
            <Trigger onAction={onAction} />
        </NoticeProvider>
    );
    fireEvent.click(screen.getByText('pokaż'));
    return onAction;
};

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe('NoticeProvider', () => {
    it('pokazuje komunikat w regionie statusu', () => {
        setup();
        expect(screen.getByRole('status').textContent).toContain('Status: Wpisany.');
    });

    it('wykonuje akcję "Cofnij" i zamyka komunikat', () => {
        const onAction = setup();
        fireEvent.click(screen.getByRole('button', { name: 'Cofnij' }));
        expect(onAction).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('Status: Wpisany.')).toBeNull();
    });

    it('znika sam po kilku sekundach', () => {
        setup();
        act(() => {
            jest.advanceTimersByTime(8100);
        });
        expect(screen.queryByText('Status: Wpisany.')).toBeNull();
    });

    it('nie znika, dopóki wskaźnik jest nad komunikatem', () => {
        setup();
        const message = screen.getByRole('button', { name: 'Cofnij' });
        fireEvent.mouseEnter(message);
        act(() => {
            jest.advanceTimersByTime(20000);
        });
        expect(screen.getByText('Status: Wpisany.')).toBeTruthy();
        fireEvent.mouseLeave(message);
        act(() => {
            jest.advanceTimersByTime(8100);
        });
        expect(screen.queryByText('Status: Wpisany.')).toBeNull();
    });
});
