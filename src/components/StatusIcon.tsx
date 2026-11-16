import React from 'react';
import { TenderStatus } from '../types/TenderStatus';

const PATHS: Record<TenderStatus, React.ReactNode> = {
    toEnter: <path d="M4 20l1-4L16 5l3 3L8 19l-4 1z" />,
    entered: <path d="M5 12.5l4.5 4.5L19 7" />,
    toClarify: (
        <>
            <path d="M9.2 9a2.8 2.8 0 1 1 3.9 2.6c-.7.4-1.1 1-1.1 1.8" />
            <path d="M12 17.2v.1" />
        </>
    ),
    notToEnter: <path d="M6 6l12 12M18 6L6 18" />,
};

/** Kształt statusu rysowany w jednym obrysie (ołówek, ptaszek, znak zapytania, krzyżyk); kolor bierze z tekstu. */
const StatusIcon: React.FC<{ status: TenderStatus; className?: string }> = ({ status, className }) => (
    <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
        focusable="false"
    >
        {PATHS[status]}
    </svg>
);

export default StatusIcon;
