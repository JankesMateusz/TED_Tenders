import React from 'react';
import styles from './AwaySummary.module.css';
import { useAwaySummaryContext } from '../context/AwaySummaryContext';
import { AwayEvent, formatAway, pluralPl, statusLabel } from '../utils/awaySummary';

const MAX_LISTED = 5;

const tenderTitle = (event: AwayEvent): string => event.title ?? event.tenderId;

const EventList: React.FC<{ events: AwayEvent[]; describe: (event: AwayEvent) => string }> = ({ events, describe }) => (
    <ul className={styles.list}>
        {events.slice(0, MAX_LISTED).map((event) => (
            <li key={event.id}>
                <span className={styles.title}>{tenderTitle(event)}</span> <span className={styles.detail}>{describe(event)}</span>
            </li>
        ))}
        {events.length > MAX_LISTED && <li className={styles.detail}>i {events.length - MAX_LISTED} więcej</li>}
    </ul>
);

/** Baner „od Twojej ostatniej wizyty”: nowe przetargi, zmiany statusu od innych osób i nowo dostępne dokumenty. */
const AwaySummary: React.FC = () => {
    const { summary, dismiss } = useAwaySummaryContext();
    if (!summary) return null;

    const { newTenders, statusChanges, docsAvailable, since } = summary;
    return (
        <aside className={styles.banner} role="status" aria-label="Zmiany od ostatniej wizyty">
            <div className={styles.header}>
                <strong>Od Twojej ostatniej wizyty ({formatAway(since, new Date())} temu):</strong>
                <button type="button" className={styles.close} onClick={dismiss} aria-label="Zamknij podsumowanie">×</button>
            </div>
            {newTenders > 0 && (
                <p className={styles.line}>
                    {newTenders} {pluralPl(newTenders, 'nowy przetarg', 'nowe przetargi', 'nowych przetargów')}
                </p>
            )}
            {statusChanges.length > 0 && (
                <div>
                    <p className={styles.line}>
                        {statusChanges.length} {pluralPl(statusChanges.length, 'przetarg oznaczony', 'przetargi oznaczone', 'przetargów oznaczonych')} przez innych
                    </p>
                    <EventList events={statusChanges} describe={(e) => `${statusLabel(e.status)} (${e.actorEmail ?? 'ktoś'})`} />
                </div>
            )}
            {docsAvailable.length > 0 && (
                <div>
                    <p className={styles.line}>
                        {docsAvailable.length} {pluralPl(docsAvailable.length, 'przetarg z nowymi dokumentami', 'przetargi z nowymi dokumentami', 'przetargów z nowymi dokumentami')}
                    </p>
                    <EventList events={docsAvailable} describe={() => ''} />
                </div>
            )}
        </aside>
    );
};

export default AwaySummary;
