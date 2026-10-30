import React, { useState, memo } from 'react';
import { Tender } from '../types/Tender';
import { TenderComment } from '../types/TenderComment';
import { getSourceConfig, getOrderTypeConfig, OrderType } from '../utils/tenderSources';
import { getCpvName } from '../utils/cpvMapping';
import { STATUS_CONFIG, TENDER_STATUSES, statusTooltip } from '../utils/tenderStatus';
import { useAuth } from '../context/AuthContext';
import { useUserPreferences } from '../context/UserPreferencesContext';
import CommentsPopover from './CommentsPopover';
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
};

const TenderCard: React.FC<Props> = ({ tender, cpvCodes, canSetStatus, comments, canComment, onAddComment, onDeleteComment }) => {
    const { user } = useAuth();
    const { isFavorite, toggleFavorite, toggleStatus } = useUserPreferences();

    const [expanded, setExpanded] = useState<boolean>(false);

    const srcCfg = getSourceConfig(tender.source);
    const orderCfg = tender.orderType ? getOrderTypeConfig(tender.orderType as OrderType) : null;

    const fav = isFavorite(tender.id);
    const statusColor = tender.status ? STATUS_CONFIG[tender.status].color : undefined;
    const statusHint = tender.status ? statusTooltip(tender.status, tender.statusByEmail, tender.statusAt) : undefined;

    return (
        <li
            className={`${styles.tenderCard} ${tender.status ? styles.tenderCardStatus : ''}`}
            style={statusColor ? ({ '--status-color': statusColor } as React.CSSProperties) : undefined}
            // Podpowiedź z autorem statusu pojawia się po chwili najechania, z opóźnieniem przeglądarki
            title={statusHint}
        >
            <div className={styles.cardHeader}>
                <div className={styles.publicationNumber}>Numer publikacji: {tender.publicationNumber}</div>
                <div className={styles.cardActions}>
                    {canSetStatus && TENDER_STATUSES.map((status) => {
                        const config = STATUS_CONFIG[status];
                        const active = tender.status === status;
                        const actionLabel = active ? `Usuń status: ${config.label}` : `Oznacz jako: ${config.label}`;
                        return (
                            <button
                                key={status}
                                className={styles.statusButton}
                                style={active ? { color: config.color } : undefined}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleStatus(tender, status);
                                }}
                                aria-label={actionLabel}
                                aria-pressed={active}
                                title={active ? statusHint : actionLabel}
                            >
                                {config.icon}
                            </button>
                        );
                    })}
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
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(tender);
                        }}
                        aria-label={fav ? 'Usuń z zapisanych' : 'Zapisz'}
                        title={fav ? 'Usuń z zapisanych' : 'Zapisz'}
                    >
                        {fav ? '★' : '☆'}
                    </button>
                </div>
            </div>

            <div className={styles.badgesContainer}>
                <span className={styles.sourceBadge} style={{ backgroundColor: srcCfg.backgroundColor, color: srcCfg.color }}>
                    {srcCfg.label}
                </span>
                {orderCfg && (
                    <span className={styles.orderTypeBadge} style={{ backgroundColor: orderCfg.backgroundColor, color: orderCfg.color }}>
                        {orderCfg.label}
                    </span>
                )}
            </div>

            <h2 className={styles.title}>{tender.title}</h2>

            <div className={styles.info}>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Data publikacji</span>
                    <span className={styles.infoValue}>
                        {tender.publicationDate}
                        {tender.publicationTime && tender.source === 'E_ZAMOWIENIA' && (
                            <span className={styles.publicationTime}> {tender.publicationTime}</span>
                        )}
                    </span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Termin składania</span>
                    <span className={styles.infoValue}>{tender.deadlineDate}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Miasto</span>
                    <span className={styles.infoValue}>{tender.buyerCity}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Zamawiający</span>
                    <span className={styles.infoValue}>{tender.buyerName}</span>
                </div>
            </div>

            {cpvCodes.length > 0 && (
                <div className={styles.cpvSection}>
                    <div className={styles.cpvContainer}>
                        <button
                            className={styles.cpvToggle}
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpanded(prev => !prev);
                            }}
                        >
                            Kody CPV ({cpvCodes.length}) {expanded ? ' ▼' : ' ▶'}
                        </button>
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
            </div>
        </li>
    );
};

export default memo(TenderCard);
