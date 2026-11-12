import React from "react";
import { Tender } from "../types/Tender";
import { TenderComment } from "../types/TenderComment";
import { MESSAGES } from "../constants";
import { pluralizeTenders } from "../utils/pluralPl";
import { isHiddenAdvertiser } from "../utils/advertisers";
import { useAdvertiserDecisions } from "../hooks/useAdvertiserDecisions";
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
    showQueueHint: boolean;
    isQueueEmpty: boolean;
    isFiltered: boolean;
    favoritesCount: number;
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

const AlertMessage: React.FC<{ message: string | null }> = ({ message }) =>
    message ? <p className={styles.message} role="alert">{message}</p> : null;

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
    showQueueHint,
    isQueueEmpty,
    isFiltered,
    favoritesCount,
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
    const isTendersTab = activeTab === "tenders";

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
                            {showQueueHint && <span className={styles.queueHint}>{MESSAGES.QUEUE_HINT}</span>}
                            <span className={`${styles.queueHint} ${styles.queueHintFull}`}>{MESSAGES.SHORTCUTS_HINT}</span>
                        </>
                    )}
                </div>
            )}
            {isTendersTab && isLoading && <TendersSkeleton />}
            {isTendersTab && <AlertMessage message={loadError} />}
            {isTendersTab && <AlertMessage message={refreshError} />}
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
                <p className={styles.message}>
                    {isQueueEmpty
                        ? MESSAGES.QUEUE_EMPTY
                        : isFiltered ? MESSAGES.NO_IT_TENDERS : MESSAGES.NO_TENDERS}
                </p>
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
