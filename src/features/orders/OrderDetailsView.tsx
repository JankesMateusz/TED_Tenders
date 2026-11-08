import React, { useState } from 'react';
import { OrderDetails, PositionDetails } from '../../types/Orders';
import { ORDERS_HASH, safeHttpUrl } from './ordersRoute';
import { useOrder } from './useOrder';
import styles from './OrderDetailsView.module.css';

const NONE = 'brak';
const text = (value: string | number | null | undefined): string =>
    value === null || value === undefined || value === '' ? NONE : String(value);
const yesNo = (value: boolean): string => (value ? 'tak' : 'nie');

const ExternalLink: React.FC<{ url: string | null; label?: string }> = ({ url, label }) => {
    const safe = safeHttpUrl(url);
    if (!safe) return <>{text(url)}</>;
    return (
        <a href={safe} target="_blank" rel="noopener noreferrer">
            {label ?? safe}
        </a>
    );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className={styles.field}>
        <dt>{label}</dt>
        <dd>{children}</dd>
    </div>
);

const OrderSection: React.FC<{ order: OrderDetails }> = ({ order }) => (
    <section className={styles.section} aria-labelledby="order-section">
        <h3 id="order-section">Zamówienie</h3>
        <dl className={styles.fields}>
            <Field label="MDP ID">{order.mdpId}</Field>
            <Field label="Nr przetargu">{text(order.endUserBidNumber)}</Field>
            <Field label="Nazwa">{text(order.name)}</Field>
            <Field label="Status">{order.statusLabel}</Field>
            <Field label="Zarejestrowano">{text(order.registeredOn)}</Field>
            <Field label="Tydzień">{text(order.orderWeek)}</Field>
            <Field label="Publikacja">{text(order.publicationDate)}</Field>
            <Field label="Kwartał publikacji">{text(order.publicationQuarter)}</Field>
            <Field label="Termin ofert">{text(order.bidDate)}</Field>
            <Field label="SIWZ">
                <ExternalLink url={order.siwzUrl} />
            </Field>
            <Field label="Dodatkowe linki">
                {order.extraUrls.length === 0
                    ? NONE
                    : order.extraUrls.map((url) => (
                          <div key={url}>
                              <ExternalLink url={url} />
                          </div>
                      ))}
            </Field>
            <Field label="Finansowanie UE">{yesNo(order.financingEu)}</Field>
            <Field label="Budżet">{text(order.budget)}</Field>
            <Field label="Typ konta">{text(order.accountType)}</Field>
            <Field label="Poza UZP">{yesNo(order.outsideUzp)}</Field>
            <Field label="Lenovo top ten">{yesNo(order.lenovoTopTen)}</Field>
            {/* Wartość zamówienia celowo nie jest pokazywana: reguła jej liczenia nie jest ustalona (plan.md). */}
            <Field label="Komentarz">{text(order.comments)}</Field>
        </dl>
    </section>
);

const BuyerSection: React.FC<{ order: OrderDetails }> = ({ order }) => {
    const { buyer, contact } = order;
    const address = [buyer.street, [buyer.zipCode, buyer.town].filter(Boolean).join(' '), buyer.province]
        .filter(Boolean)
        .join(', ');
    return (
        <section className={styles.section} aria-labelledby="buyer-section">
            <h3 id="buyer-section">Zamawiający i kontakt</h3>
            <dl className={styles.fields}>
                <Field label="Zamawiający">{buyer.name}</Field>
                <Field label="Adres">{text(address)}</Field>
                <Field label="NIP">{text(buyer.nip)}</Field>
                {buyer.canonicalId !== null && (
                    <Field label="Grupa">Ten sam zamawiający co rekord nr {buyer.canonicalId}</Field>
                )}
                <Field label="Osoba kontaktowa">{contact ? text(contact.fullName) : NONE}</Field>
                <Field label="E-mail">
                    {contact?.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : NONE}
                </Field>
                <Field label="Drugi e-mail">
                    {contact?.email2 ? <a href={`mailto:${contact.email2}`}>{contact.email2}</a> : NONE}
                </Field>
                <Field label="Telefon">{text(contact?.phone)}</Field>
                <Field label="Fax">{text(contact?.fax)}</Field>
            </dl>
        </section>
    );
};

const attributesText = (attributes: Record<string, unknown>): string =>
    Object.entries(attributes)
        .map(([key, value]) => `${key}: ${String(value)}`)
        .join(', ');

const PositionRow: React.FC<{ position: PositionDetails }> = ({ position: p }) => (
    <tr>
        <td>{p.positionNumber}</td>
        <td>{text(p.partLabel)}</td>
        <td>{text(p.lobCategory)}</td>
        <td>{text(p.quantity)}</td>
        <td>{text(p.architecture)}</td>
        <td>{text(p.cpuNo)}</td>
        <td>{text(p.os)}</td>
        <td>{text(p.office)}</td>
        <td>{text(p.initialBenchmark)}</td>
        <td>{text(p.acquisitionForm)}</td>
        <td>{text(p.remarks)}</td>
        <td>{Object.keys(p.attributes).length === 0 ? NONE : attributesText(p.attributes)}</td>
        <td title={p.statusLabel}>{p.status}</td>
        <td>{p.winner ? p.winner.name : NONE}</td>
        <td>{p.vendor ? p.vendor.name : NONE}</td>
        <td>{text(p.awardLetterDate)}</td>
        <td>{text(p.finalOffice)}</td>
        <td>{text(p.deliveryTerm)}</td>
        <td>{text(p.partValue)}</td>
    </tr>
);

const PositionsSection: React.FC<{ positions: PositionDetails[] }> = ({ positions }) => (
    <section className={styles.section} aria-labelledby="positions-section">
        <h3 id="positions-section">Pozycje ({positions.length})</h3>
        {positions.length === 0 ? (
            <p>Zamówienie nie ma pozycji.</p>
        ) : (
            <div className={styles.tableScroll}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th colSpan={11} scope="colgroup">Przed rozstrzygnięciem</th>
                            <th colSpan={8} scope="colgroup">Po rozstrzygnięciu</th>
                        </tr>
                        <tr>
                            {['Nr', 'Część', 'LoB', 'Ilość', 'Architektura', 'CPU', 'OS', 'Office', 'Benchmark', 'Forma nabycia', 'Uwagi'].map((h) => (
                                <th key={h} scope="col">{h}</th>
                            ))}
                            {['Parametry', 'Status', 'Zwycięzca', 'Vendor', 'Data listu', 'Final Office', 'Termin dostawy', 'Wartość części'].map((h) => (
                                <th key={h} scope="col">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {positions.map((p) => (
                            <PositionRow key={p.id} position={p} />
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </section>
);

const LettersSection: React.FC<{ order: OrderDetails }> = ({ order }) => (
    <section className={styles.section} aria-labelledby="letters-section">
        <h3 id="letters-section">Pisma ({order.letters.length})</h3>
        {order.letters.length === 0 ? (
            <p>Brak pism.</p>
        ) : (
            <ul className={styles.letters}>
                {order.letters.map((l) => (
                    <li key={l.id}>
                        {l.sentAt}: do {l.mailTo.length ? l.mailTo.join(', ') : NONE}
                        {l.mailCc.length > 0 && `, kopia: ${l.mailCc.join(', ')}`}
                        {l.confirmedOn && `, potwierdzono ${l.confirmedOn}`}
                        {l.cancelledAt && `, anulowano ${l.cancelledAt}`}
                    </li>
                ))}
            </ul>
        )}
    </section>
);

/** Szczegóły zamówienia (tylko odczyt). Adres `#/zamowienia/ID` pozwala wysłać link do konkretnego zamówienia. */
const OrderDetailsView: React.FC<{ id: number }> = ({ id }) => {
    const [reloadKey, setReloadKey] = useState(0);
    const state = useOrder(id, reloadKey);

    return (
        <article className={styles.view} aria-label="Szczegóły zamówienia">
            <a className={styles.back} href={ORDERS_HASH}>
                ← Wróć do listy
            </a>
            {state.status === 'loading' && <p role="status">Ładowanie zamówienia…</p>}
            {state.status === 'notFound' && <p role="alert">Nie znaleziono zamówienia.</p>}
            {state.status === 'error' && (
                <div className={styles.error} role="alert">
                    <span>{state.message}</span>
                    <button type="button" onClick={() => setReloadKey((n) => n + 1)}>
                        Spróbuj ponownie
                    </button>
                </div>
            )}
            {state.status === 'ready' && (
                <>
                    <h2 className={styles.heading}>
                        Zamówienie {state.order.mdpId}
                        {state.order.name ? `: ${state.order.name}` : ''}
                    </h2>
                    <OrderSection order={state.order} />
                    <BuyerSection order={state.order} />
                    <PositionsSection positions={state.order.positions} />
                    <LettersSection order={state.order} />
                </>
            )}
        </article>
    );
};

export default OrderDetailsView;
