import { TenderStatus } from '../types/TenderStatus';
import { TENDER_STATUSES } from './tenderStatus';

export interface FunnelRow {
    key: 'total' | 'reviewed' | 'unmarked' | TenderStatus;
    count: number;
    /** Udział w wszystkich przetargach, 0-100 (0, gdy lista jest pusta). */
    percent: number;
}

/**
 * Postęp przeglądania napływu: wszystkie przetargi, ile ma już jakiś status, ile czeka bez statusu
 * oraz podział na poszczególne statusy. Statusy nie tworzą ciągu zagnieżdżonych zbiorów, więc każdy
 * wiersz jest liczony względem wszystkich przetargów.
 */
export const buildStatusFunnel = (
    total: number,
    byStatus: Record<TenderStatus | 'unmarked', number>
): FunnelRow[] => {
    const percentOf = (count: number) => (total > 0 ? Math.round((count / total) * 1000) / 10 : 0);
    const row = (key: FunnelRow['key'], count: number): FunnelRow => ({ key, count, percent: percentOf(count) });
    return [
        row('total', total),
        row('reviewed', total - byStatus.unmarked),
        row('unmarked', byStatus.unmarked),
        ...TENDER_STATUSES.map((status) => row(status, byStatus[status]))
    ];
};
