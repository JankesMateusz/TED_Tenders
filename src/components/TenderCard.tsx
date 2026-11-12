import React, { useEffect, useRef, useState, memo } from 'react';
import { Tender } from '../types/Tender';
import { TenderComment } from '../types/TenderComment';
import { getSourceConfig, getOrderTypeConfig, getSourceAttribution, OrderType } from '../utils/tenderSources';
import { getCpvName } from '../utils/cpvMapping';
import { STATUS_CONFIG, statusAuthorCaption } from '../utils/tenderStatus';
import { isItRelatedCpv } from '../utils/cpvFilter';
import { useAuth } from '../context/AuthContext';
import { AdvertiserDecision } from '../utils/advertisers';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { useAwaySince } from '../context/AwaySummaryContext';
import { isNewSince } from '../utils/awaySummary';
import CommentsPopover from './CommentsPopover';
import StatusMenu from './StatusMenu';
import LabelMenu from './LabelMenu';
import CopyMenu, { CopyItem } from './CopyMenu';
import DocsBadge from './DocsBadge';
import ExternalIcon from './ExternalIcon';
import { docsLinkUrl } from '../utils/docsCheck';
import { LABEL_CONFIG } from '../utils/tenderLabels';
import styles from './Tenders.module.css';

type Props = {
    tender: Tender;
    cpvCodes: string[];
    /** False, gdy przetargu nie ma już w bazie wspólnej (kopia z zakładki "Zapisane"): wtedy statusu nie da się zmienić. */
    canSetStatus: boolean;
    comments: TenderComment[];
    /** False, gdy przetargu nie ma już w bazie wspólnej: komentarze są wtedy niedostępne, podobnie jak status. */
    canComment: boolean;
    onAddComment: (tender: Tender, text: string) => Promise<boolean>;
    onDeleteComment: (comment: TenderComment) => void;
    /** Czy zamawiający tego ogłoszenia jest ukryty (automatycznie lub ręcznie). */
    advertiserHidden: boolean;
    onSetAdvertiserDecision: (tender: Tender, decision: AdvertiserDecision) => void;
    /** Aktywna karta jest celem skrótów klawiszowych (J/K, 1–4, 0, S). */
    isActive: boolean;
    /** `toggle`: drugi klik w aktywną kartę ją wyłącza (nie dotyczy kliknięcia w przycisk lub odnośnik wewnątrz karty). */
    onActivate: (tenderId: string, toggle: boolean) => void;
};

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
    </svg>
);

/** Czy kliknięto element sterujący wewnątrz karty (przycisk, odnośnik, pole); taki klik nie ma wyłączać aktywnej karty. */
const isInteractiveTarget = (target: EventTarget): boolean =>
    target instanceof Element && target.closest('button, a, input, select, textarea, label') !== null;

/** Tyle nazw CPV widać od razu pod tytułem; reszta kodów jest pod przyciskiem "+N". */
const VISIBLE_CPV_CHIPS = 2;

const TenderCard: React.FC<Props> = ({ tender, cpvCodes, canSetStatus, comments, canComment, onAddComment, onDeleteComment, advertiserHidden, onSetAdvertiserDecision, isActive, onActivate }) => {
    const { user } = useAuth();
    const { isFavorite, toggleFavorite, toggleStatus, toggleLabel } = useUserPreferences();

    const awaySince = useAwaySince();
    const isNew = isNewSince(tender.fetchedAt, awaySince);

    const [expanded, setExpanded] = useState<boolean>(false);
    const cardRef = useRef<HTMLLIElement>(null);

    // Po przejściu klawiszami karta ma być widoczna; "nearest" nie przewija, gdy już jest na ekranie
    useEffect(() => {
        if (isActive) cardRef.current?.scrollIntoView({ block: 'nearest' });
    }, [isActive]);

    const srcCfg = getSourceConfig(tender.source);
    const attribution = getSourceAttribution(tender.source, tender.fetchedAt);
    const orderCfg = tender.orderType ? getOrderTypeConfig(tender.orderType as OrderType) : null;

    const fav = isFavorite(tender.id);
    const statusColor = tender.status ? STATUS_CONFIG[tender.status].color : undefined;

    const labelsCaption = statusAuthorCaption(tender.labelsByEmail, tender.labelsAt);

    // Kolejność chipów: kody IT pierwsze (to tylko kolejność, karta ich nie oznacza)
    const itCodes = cpvCodes.filter(isItRelatedCpv);
    const chipCodes = (itCodes.length > 0 ? itCodes : cpvCodes).slice(0, VISIBLE_CPV_CHIPS);
    const hiddenCpvCount = cpvCodes.length - chipCodes.length;

    // Gotowy opis do wklejenia: zamawiający, link do ogłoszenia i (jeśli jest) link do dokumentacji, każde w osobnej linii
    const docsUrl = docsLinkUrl(tender);
    const summary = [tender.buyerName, tender.link, docsUrl].filter(Boolean).join('\n');

    const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const summaryHtml = [
        escapeHtml(tender.buyerName),
        ...[tender.link, docsUrl].filter(Boolean).map((url) => `<a href="${escapeHtml(url as string)}">${escapeHtml(url as string)}</a>`),
    ].join('<br>');

    const copyItems: CopyItem[] = [
        { key: 'summary', label: 'Kopiuj zamawiającego i linki', value: summary, html: summaryHtml },
        { key: 'title', label: 'Kopiuj tytuł przetargu', value: tender.title },
        { key: 'link', label: 'Kopiuj link do ogłoszenia', value: tender.link },
        ...(docsUrl ? [{ key: 'docs', label: 'Kopiuj link do dokumentacji', value: docsUrl }] : []),
        { key: 'pubNo', label: 'Kopiuj numer publikacji', value: tender.publicationNumber },
        ...(tender.referenceNumber ? [{ key: 'refNo', label: 'Kopiuj numer referencyjny', value: tender.referenceNumber }] : []),
    ];

    return (
        <li
            ref={cardRef}
            data-tender-card=""
            onClick={(event) => onActivate(tender.id, !isInteractiveTarget(event.target))}
            className={`${styles.tenderCard} ${tender.status ? styles.tenderCardStatus : ''} ${isActive ? styles.tenderCardActive : ''}`}
            style={statusColor ? ({ '--status-color': statusColor } as React.CSSProperties) : undefined}
        >
            <div className={styles.cardHeader}>
                <div className={styles.badgesContainer}>
                    <span className={styles.sourceBadge} style={{ backgroundColor: srcCfg.backgroundColor, color: srcCfg.color }}>
                        {srcCfg.label}
                    </span>
                    {isNew && <span className={styles.newBadge} title="Pobrany po Twojej ostatniej wizycie">Nowy</span>}
                    {advertiserHidden && <span className={styles.hiddenAdvertiserBadge}>Ukryty zamawiający</span>}
                    {orderCfg && (
                        <span className={styles.orderTypeBadge} style={{ backgroundColor: orderCfg.backgroundColor, color: orderCfg.color }}>
                            {orderCfg.label}
                        </span>
                    )}
                    {(tender.labels ?? []).map((label) => (
                        <span
                            key={label}
                            className={styles.labelBadge}
                            style={{ backgroundColor: LABEL_CONFIG[label].color }}
                            title={labelsCaption}
                        >
                            {LABEL_CONFIG[label].label}
                        </span>
                    ))}
                </div>
                <div className={styles.cardActions}>
                    <StatusMenu
                        status={tender.status}
                        statusByEmail={tender.statusByEmail}
                        statusAt={tender.statusAt}
                        editable={canSetStatus}
                        onToggle={(status) => toggleStatus(tender, status)}
                    />
                    <LabelMenu
                        labels={tender.labels ?? []}
                        editable={canSetStatus}
                        onToggle={(label) => toggleLabel(tender, label)}
                    />
                    {canComment && (
                        <CommentsPopover
                            comments={comments}
                            currentUid={user?.uid ?? null}
                            onAdd={(text) => onAddComment(tender, text)}
                            onDelete={onDeleteComment}
                        />
                    )}
                    <button
                        className={`${styles.favoriteButton} ${fav ? styles.favoriteActive : ''}`}
                        onClick={() => toggleFavorite(tender)}
                        aria-label={fav ? 'Usuń z zapisanych' : 'Zapisz dla siebie'}
                        aria-pressed={fav}
                        title={fav ? 'Usuń z zapisanych (widoczne tylko dla Ciebie)' : 'Zapisz dla siebie (widoczne tylko dla Ciebie)'}
                    >
                        <StarIcon filled={fav} />
                    </button>
                    <CopyMenu items={copyItems} />
                </div>
            </div>

            <h2 className={styles.title}>{tender.title}</h2>

            <p className={styles.metaLine}>
                <span className={styles.metaBuyer}>{tender.buyerName}</span>
                {tender.buyerCity && <span> · {tender.buyerCity}</span>}
                <span>
                    {' · '}{tender.publicationDate}
                    {tender.publicationTime && tender.source === 'E_ZAMOWIENIA' && ` ${tender.publicationTime}`}
                </span>
            </p>

            {cpvCodes.length > 0 && (
                <div className={styles.cpvSection}>
                    <div className={styles.cpvChips}>
                        {chipCodes.map(cpv => (
                            <span key={cpv} className={styles.cpvChip} title={cpv}>
                                {getCpvName(cpv)}
                            </span>
                        ))}
                        {(hiddenCpvCount > 0 || expanded) && (
                            <button
                                type="button"
                                className={styles.cpvMore}
                                onClick={() => setExpanded(prev => !prev)}
                                aria-expanded={expanded}
                                data-disclosure
                            >
                                {expanded ? 'Zwiń kody CPV' : `+${hiddenCpvCount}`}
                            </button>
                        )}
                    </div>
                    {expanded && (
                        <div className={styles.cpvCodes}>
                            {cpvCodes.map(cpv => (
                                <div key={cpv} className={styles.cpvCodeContainer}>
                                    <span className={styles.cpvCode}>{cpv}</span>
                                    <span className={styles.cpvName}>{getCpvName(cpv)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className={styles.links}>
                <a href={tender.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    Zobacz ogłoszenie <ExternalIcon />
                </a>
                <DocsBadge tender={tender} canCheck={canSetStatus} />
                {tender.buyerNip && (
                    <button
                        type="button"
                        className={styles.advertiserButton}
                        onClick={() => onSetAdvertiserDecision(tender, advertiserHidden ? 'visible' : 'hidden')}
                        title={advertiserHidden
                            ? 'Pokazuje ogłoszenia tego zamawiającego na liście (dla wszystkich osób)'
                            : 'Ukrywa wszystkie ogłoszenia tego zamawiającego, także przyszłe (dla wszystkich osób)'}
                    >
                        {advertiserHidden ? 'Przywróć zamawiającego' : 'Ukryj zamawiającego'}
                    </button>
                )}
            </div>

            <p className={styles.cardFootnote}>
                <span>Nr publikacji: {tender.publicationNumber}</span>
                {tender.source === 'TED' && <span>Nr referencyjny: {tender.referenceNumber ?? 'brak'}</span>}
                {attribution && <span>{attribution}</span>}
            </p>
        </li>
    );
};

export default memo(TenderCard);
