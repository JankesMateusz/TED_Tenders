import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { setShortcutsEnabled, useShortcutsEnabled } from './useShortcutsSetting';

const Probe: React.FC = () => <span>{useShortcutsEnabled() ? 'włączone' : 'wyłączone'}</span>;

afterEach(() => {
    act(() => setShortcutsEnabled(true));
    window.localStorage.clear();
});

describe('useShortcutsEnabled', () => {
    it('domyślnie skróty są włączone', () => {
        render(<Probe />);
        expect(screen.getByText('włączone')).toBeTruthy();
    });

    it('wyłączenie jest widoczne od razu i zapamiętane w przeglądarce', () => {
        render(<Probe />);
        act(() => setShortcutsEnabled(false));
        expect(screen.getByText('wyłączone')).toBeTruthy();
        expect(window.localStorage.getItem('keyboardShortcuts')).toBe('off');
    });
});
