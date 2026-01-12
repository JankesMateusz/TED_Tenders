import React, { useState, memo } from 'react';
import { Tender } from '../types/Tender';
import { getSourceConfig, getOrderTypeConfig, OrderType } from '../utils/tenderSources';
import { getCpvName } from '../utils/cpvMapping';
import { useUserPreferences } from '../context/UserPreferencesContext';
import styles from './Tenders.module.css';

type Props = {
    tender: Tender;
    cpvCodes: string[];
    onToggleToBeEntered?: (id: string) => void;
    onToggleNotToBeEntered?: (id: string) => void;
    isToBeEntered?: (id: string) => boolean;
    isNotToBeEntered?: (id: string) => boolean;
};

const TenderCard: React.FC<Props> = ({ tender, cpvCodes, onToggleToBeEntered: propsOnToggleToBeEntered, onToggleNotToBeEntered: propsOnToggleNotToBeEntered, isToBeEntered: propsIsToBeEntered, isNotToBeEntered: propsIsNotToBeEntered }) => {
    const {
        addToFavorites,
        removeFromFavorites,
        isFavorite
    } = useUserPreferences();

    const [expanded, setExpanded] = useState<boolean>(false);

    const srcCfg = getSourceConfig(tender.source);
    const orderCfg = tender.orderType ? getOrderTypeConfig(tender.orderType as OrderType) : null;

    const fav = isFavorite(tender.publicationNumber);
    const toBe = propsIsToBeEntered ? propsIsToBeEntered(tender.publicationNumber) : false;
    const notToBe = propsIsNotToBeEntered ? propsIsNotToBeEntered(tender.publicationNumber) : false;

    return (
        <li
            key={tender.publicationNumber}
            className={`${styles.tenderCard} ${fav ? styles.tenderCardFavorite : ''} ${toBe ? styles.tenderCardToBeEntered : ''} ${notToBe ? styles.tenderCardNotToBeEntered : ''}`}
        >
            <div className={styles.cardHeader}>
                <div className={styles.publicationNumber}>Numer publikacji: {tender.publicationNumber}</div>
                <div className={styles.cardActions}>
                    {propsOnToggleToBeEntered && (
                        <button
                            className={`${styles.statusButton} ${toBe ? styles.toBeEnteredActive : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                propsOnToggleToBeEntered(tender.publicationNumber);
                            }}
                            aria-label={toBe ? 'Usuń z do wpisania' : 'Oznacz jako do wpisania'}
                            title={toBe ? 'Usuń z do wpisania' : 'Oznacz jako do wpisania'}
                        >
                            ✓
                        </button>
                    )}
                    {propsOnToggleNotToBeEntered && (
                        <button
                            className={`${styles.statusButton} ${notToBe ? styles.notToBeEnteredActive : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                propsOnToggleNotToBeEntered(tender.publicationNumber);
                            }}
                            aria-label={notToBe ? 'Usuń z nie do wpisania' : 'Oznacz jako nie do wpisania'}
                            title={notToBe ? 'Usuń z nie do wpisania' : 'Oznacz jako nie do wpisania'}
                        >
                            ✕
                        </button>
                    )}
                    <button
                        className={`${styles.favoriteButton} ${fav ? styles.favoriteActive : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            fav ? removeFromFavorites(tender.publicationNumber) : addToFavorites(tender);
                        }}
                        aria-label={fav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
                        title={fav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
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

            <a href={tender.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                Zobacz ogłoszenie
            </a>
        </li>
    );
};

export default memo(TenderCard);
