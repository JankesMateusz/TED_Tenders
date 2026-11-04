import React, { useEffect, useRef, useState, memo } from 'react';
import { Tender } from '../types/Tender';
import { TenderComment } from '../types/TenderComment';
import { getSourceConfig, getOrderTypeConfig, getSourceAttribution, OrderType } from '../utils/tenderSources';
import { getCpvName } from '../utils/cpvMapping';
import { STATUS_CONFIG } from '../utils/tenderStatus';
import { isItRelatedCpv } from '../utils/cpvFilter';
import { useAuth } from '../context/AuthContext';
import { AdvertiserDecision } from '../utils/advertisers';
import { useUserPreferences } from '../context/UserPreferencesContext';
import CommentsPopover from './CommentsPopover';
import StatusMenu from './StatusMenu';
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
    onActivate: (tenderId: string) => void;
};

/** Tyle nazw CPV widać od razu pod tytułem; reszta kodów jest pod przyciskiem "+N". */
const VISIBLE_CPV_CHIPS = 2;

const TenderCard: React.FC<Props> = ({ tender, cpvCodes, canSetStatus, comments, canComment, onAddComment, onDeleteComment, advertiserHidden, onSetAdvertiserDecision, isActive, onActivate }) => {
    const { user } = useAuth();
    const { isFavorite, toggleFavorite, toggleStatus } = useUserPreferences();

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

    // Kolejność chipów: kody IT pierwsze (to tylko kolejność, karta ich nie oznacza)
    const itCodes = cpvCodes.filter(isItRelatedCpv);
    const chipCodes = (itCodes.length > 0 ? itCodes : cpvCodes).slice(0, VISIBLE_CPV_CHIPS);
    const hiddenCpvCount = cpvCodes.length - chipCodes.length;

    return (
        <li
            ref={cardRef}
            onClick={() => onActivate(tender.id)}
            className={`${styles.tenderCard} ${tender.status ? styles.tenderCardStatus : ''} ${isActive ? styles.tenderCardActive : ''}`}
            style={statusColor ? ({ '--status-color': statusColor } as React.CSSProperties) : undefined}
        >
            <div className={styles.cardHeader}>
                <div className={styles.badgesContainer}>
                    <span className={styles.sourceBadge} style={{ backgroundColor: srcCfg.backgroundColor, color: srcCfg.color }}>
                        {srcCfg.label}
                    </span>
                    {advertiserHidden && <span className={styles.hiddenAdvertiserBadge}>Ukryty zamawiający</span>}
                    {orderCfg && (
                        <span className={styles.orderTypeBadge} style={{ backgroundColor: orderCfg.backgroundColor, color: orderCfg.color }}>
                            {orderCfg.label}
                        </span>
                    )}
                </div>
                <div className={styles.cardActions}>
                    <StatusMenu
                        status={tender.status}
                        statusByEmail={tender.statusByEmail}
                        statusAt={tender.statusAt}
                        editable={canSetStatus}
                        onToggle={(status) => toggleStatus(tender, status)}
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
                        {fav ? '★' : '☆'}
                    </button>
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
                    Zobacz ogłoszenie
                </a>
                {tender.documentsUrl && (
                    <a href={tender.documentsUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        Dokumentacja
                    </a>
                )}
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
                Nr publikacji: {tender.publicationNumber}
                {attribution && ` · ${attribution}`}
            </p>
        </li>
    );
};

export default memo(TenderCard);
