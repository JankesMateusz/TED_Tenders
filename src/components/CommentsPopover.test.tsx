import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CommentsPopover from './CommentsPopover';
import { TenderComment } from '../types/TenderComment';

const comment: TenderComment = {
    id: 'c1',
    tenderId: 'TED_1',
    text: 'Sprawdzić termin',
    authorUid: 'me',
    authorEmail: 'ja@example.com',
    createdAt: new Date(),
};

const setup = (onDelete = jest.fn()) => {
    render(<CommentsPopover comments={[comment]} currentUid="me" onAdd={async () => true} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole('button', { name: 'Komentarze (1)' }));
    return onDelete;
};

describe('CommentsPopover: usuwanie komentarza', () => {
    it('pyta o potwierdzenie i nie usuwa od razu', () => {
        const onDelete = setup();
        fireEvent.click(screen.getByRole('button', { name: 'Usuń komentarz' }));
        expect(onDelete).not.toHaveBeenCalled();
        expect(screen.getByText('Usunąć ten komentarz?')).toBeTruthy();
    });

    it('usuwa po potwierdzeniu', () => {
        const onDelete = setup();
        fireEvent.click(screen.getByRole('button', { name: 'Usuń komentarz' }));
        fireEvent.click(screen.getByRole('button', { name: 'Usuń' }));
        expect(onDelete).toHaveBeenCalledWith(comment);
        expect(screen.queryByText('Usunąć ten komentarz?')).toBeNull();
    });

    it('anulowanie zostawia komentarz, a Escape wycofuje pytanie bez zamykania okienka', () => {
        const onDelete = setup();
        fireEvent.click(screen.getByRole('button', { name: 'Usuń komentarz' }));
        fireEvent.click(screen.getByRole('button', { name: 'Anuluj' }));
        expect(screen.queryByText('Usunąć ten komentarz?')).toBeNull();

        fireEvent.click(screen.getByRole('button', { name: 'Usuń komentarz' }));
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(screen.queryByText('Usunąć ten komentarz?')).toBeNull();
        expect(screen.getByRole('dialog')).toBeTruthy();
        expect(onDelete).not.toHaveBeenCalled();
    });
});
