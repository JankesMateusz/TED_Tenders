import React from "react";
import { Tender } from "../types/Tender";
import { TenderComment } from "../types/TenderComment";
import { MESSAGES } from "../constants";
import { pluralizeTenders } from "../utils/pluralPl";
import { isHiddenAdvertiser } from "../utils/advertisers";
import { useAdvertiserDecisions } from "../hooks/useAdvertiserDecisions";
import { setShortcutsEnabled, useShortcutsEnabled } from "../hooks/useShortcutsSetting";
import { EmptyStateKind, getEmptyStateKind } from "../utils/emptyState";
import TenderCard from "./TenderCard";
import styles from "./Tenders.module.css";

const NO_SAVED_TENDERS_MESSAGE = "Nie masz jeszcze zapisanych przetargów. Oznacz przetarg gwiazdką, aby trafił do tej zakładki.";
const REFRESHING_MESSAGE = "Pobieranie nowych przetargów";
const SKELETON_CARDS = 3;

// Stała referencja, żeby karty bez komentarzy nie renderowały się od nowa przy każdej zmianie
const NO_COMMENTS: TenderComment[] = [];

type AdvertiserDecisions = ReturnType<typeof useAdvertiserDecisions>["advertiserDecisions"];
type CardProps = React.ComponentProps<typeof TenderCard>;

type Props = {
    activeTab: "tenders" | "saved";
    displayedTenders: Tender[];
    isLoading: boolean;
    isRefreshing: boolean;
    refreshProgress: { done: number; total: number } | null;
    /** Błędy wyświetlane nad listą; `loadError` i `refreshError` tylko w zakładce przetargów. */
    loadError: string | null;
    refreshError: string | null;
    actionError: string | null;
    commentsError: string | null;
    advertiserError: string | null;
    // Nagłówek kolejki i puste stany
    unmarkedCount: number;
    /** Ile ogłoszeń z wybranego zakresu może trafić na listę, zanim zadziałają filtry. */
    rangeCount: number;
    isQueueEmpty: boolean;
    isFiltered: boolean;
    /** Czy cokolwiek zawęża listę: chipy filtrów albo fraza wyszukiwania. */
    hasActiveFilters: boolean;
    favoritesCount: number;
    /** Akcje z pustych stanów i błędów. */
    canRefresh: boolean;
    onRefresh: () => void;
    onShowAllStatuses: () => void;
    onClearFilters: () => void;
    onShowNonIt: () => void;
    // Karty
    getDisplayedCpvCodes: (tender: Tender) => string[];
    liveTendersById: Map<string, Tender>;
    commentsByTender: Record<string, TenderComment[]>;
    onAddComment: CardProps["onAddComment"];
    onDeleteComment: CardProps["onDeleteComment"];
    advertiserDecisions: AdvertiserDecisions;
    onSetAdvertiserDecision: CardProps["onSetAdvertiserDecision"];
    activeTenderId: string | null;
    onActivateTender: CardProps["onActivate"];
};

const TendersSkeleton: React.FC = () => (
    <div className={styles.skeletonContainer}>
        {[...Array(SKELETON_CARDS)].map((_, index) => (
            <div key={index} className={styles.skeletonCard}>
                <div className={styles.skeletonHeader}>
                    <div className={styles.skeletonLine} style={{ width: "40%" }} />
                    <div className={styles.skeletonLine} style={{ width: "20%" }} />
                </div>
                <div className={styles.skeletonBadge} />
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonInfo}>
                    <div className={styles.skeletonLine} style={{ width: "30%" }} />
                    <div className={styles.skeletonLine} style={{ width: "30%" }} />
                    <div className={styles.skeletonLine} style={{ width: "30%" }} />
                </div>
            </div>
        ))}
    </div>
);

/** Komunikat o błędzie; z `action` ma przy sobie przycisk następnego kroku (np. "Spróbuj ponownie"). */
const AlertMessage: React.FC<{ message: string | null; action?: { label: string; onClick: () => void } }> = ({ message, action }) =>
    message ? (
        <div className={styles.emptyState} role="alert">
            <p className={styles.emptyText}>{message}</p>
            {action && (
                <button type="button" className={styles.emptyAction} onClick={action.onClick}>
                    {action.label}
                </button>
            )}
        </div>
    ) : null;

const EMPTY_MESSAGES: Record<EmptyStateKind, string> = {
    noData: MESSAGES.EMPTY_NO_DATA,
    queueEmpty: MESSAGES.EMPTY_QUEUE,
    filtered: MESSAGES.EMPTY_FILTERED,
    noIt: MESSAGES.EMPTY_NO_IT,
    other: MESSAGES.EMPTY_OTHER
};

export const TendersList: React.FC<Props> = ({
    activeTab,
    displayedTenders,
    isLoading,
    isRefreshing,
    refreshProgress,
    loadError,
    refreshError,
    actionError,
    commentsError,
    advertiserError,
    unmarkedCount,
    rangeCount,
    isQueueEmpty,
    isFiltered,
    hasActiveFilters,
    favoritesCount,
    canRefresh,
    onRefresh,
    onShowAllStatuses,
    onClearFilters,
    onShowNonIt,
    getDisplayedCpvCodes,
    liveTendersById,
    commentsByTender,
    onAddComment,
    onDeleteComment,
    advertiserDecisions,
    onSetAdvertiserDecision,
    activeTenderId,
    onActivateTender
}) => {
    const shortcutsEnabled = useShortcutsEnabled();
    const isTendersTab = activeTab === "tenders";
    const emptyKind = getEmptyStateKind({ rangeCount, isQueueEmpty, hasActiveFilters, isItOnly: isFiltered });

    // Następny krok zależy od przyczyny: pobranie danych, pokazanie ocenionych, wyczyszczenie filtrów albo wyjście z "Tylko IT"
    const emptyActions: Record<EmptyStateKind, { label: string; onClick: () => void } | null> = {
        noData: canRefresh ? { label: "Pobierz nowe ogłoszenia", onClick: onRefresh } : null,
        queueEmpty: { label: "Pokaż ocenione", onClick: onShowAllStatuses },
        filtered: { label: "Wyczyść filtry", onClick: onClearFilters },
        noIt: { label: "Pokaż także spoza IT", onClick: onShowNonIt },
        other: null
    };
    const emptyAction = emptyActions[emptyKind];

    return (
        <>
            {(activeTab === "saved" || (isTendersTab && !isLoading)) && (
                <div className={styles.queueHeader}>
                    {activeTab === "saved" ? (
                        <span className={styles.queueHint}>{MESSAGES.SAVED_HINT}</span>
                    ) : (
                        <>
                            <span>
                                <strong>{displayedTenders.length} {pluralizeTenders(displayedTenders.length)}</strong>
                                {" · "}do przejrzenia: <strong>{unmarkedCount}</strong>
                            </span>
                            <span className={`${styles.queueHint} ${styles.queueHintFull}`}>
                                {shortcutsEnabled ? MESSAGES.SHORTCUTS_HINT : MESSAGES.SHORTCUTS_OFF_HINT}
                                {" "}
                                <button type="button" className={styles.hintAction} onClick={() => setShortcutsEnabled(!shortcutsEnabled)}>
                                    {shortcutsEnabled ? "Wyłącz skróty" : "Włącz skróty"}
                                </button>
                            </span>
                        </>
                    )}
                </div>
            )}
            {isTendersTab && isLoading && <TendersSkeleton />}
            {isTendersTab && <AlertMessage message={loadError} action={{ label: "Wczytaj stronę ponownie", onClick: () => window.location.reload() }} />}
            {isTendersTab && <AlertMessage message={refreshError} action={canRefresh ? { label: "Spróbuj ponownie", onClick: onRefresh } : undefined} />}
            <AlertMessage message={actionError} />
            <AlertMessage message={commentsError} />
            <AlertMessage message={advertiserError} />
            {isTendersTab && isRefreshing && !isLoading && (
                <p className={styles.message}>
                    {REFRESHING_MESSAGE}
                    {refreshProgress && refreshProgress.total > 1
                        ? ` (${refreshProgress.done + 1}/${refreshProgress.total})`
                        : "..."}
                </p>
            )}
            {isTendersTab && displayedTenders.length === 0 && !isLoading && !isRefreshing && !loadError && (
                <div className={styles.emptyState}>
                    <p className={styles.emptyText}>{EMPTY_MESSAGES[emptyKind]}</p>
                    {emptyAction && (
                        <button type="button" className={styles.emptyAction} onClick={emptyAction.onClick}>
                            {emptyAction.label}
                        </button>
                    )}
                </div>
            )}
            {activeTab === "saved" && favoritesCount === 0 && (
                <p className={styles.message}>{NO_SAVED_TENDERS_MESSAGE}</p>
            )}
            {(activeTab === "saved" || !isLoading) && (
                <ul className={styles.tendersList}>
                    {displayedTenders.map((tender) => (
                        <TenderCard
                            key={tender.id}
                            tender={tender}
                            cpvCodes={getDisplayedCpvCodes(tender)}
                            canSetStatus={liveTendersById.has(tender.id)}
                            comments={commentsByTender[tender.id] ?? NO_COMMENTS}
                            canComment={liveTendersById.has(tender.id)}
                            onAddComment={onAddComment}
                            onDeleteComment={onDeleteComment}
                            advertiserHidden={isHiddenAdvertiser(tender, advertiserDecisions)}
                            onSetAdvertiserDecision={onSetAdvertiserDecision}
                            isActive={tender.id === activeTenderId}
                            onActivate={onActivateTender}
                        />
                    ))}
                </ul>
            )}
        </>
    );
};
