import { Queryable } from './db';
import {
  BuyerDetails,
  BuyerSearchItem,
  BuyerWithContacts,
  ContactDetails,
  LetterDetails,
  OrderDetails,
  OrderListItem,
  OrderListPage,
  PositionDetails,
} from './types';
import { BuyerSearchInput, OrderListFilters, encodeCursor } from './validation';

// Zapytania tylko do odczytu. Wszystkie wartości od użytkownika idą jako parametry ($n), nigdy przez sklejanie SQL.
// Usunięte miękko wiersze (deleted_at) są pomijane.

const LIKE_ESCAPE = /[\\%_]/g;
const escapeLike = (value: string): string => value.replace(LIKE_ESCAPE, (char) => `\\${char}`);
const containsPattern = (value: string): string => `%${escapeLike(value.toLowerCase())}%`;
const prefixPattern = (value: string): string => `${escapeLike(value.toLowerCase())}%`;

const iso = (value: Date | string | null): string | null =>
  value === null ? null : value instanceof Date ? value.toISOString() : value;

// --- Lista zamówień ------------------------------------------------------------------------------------------

export const listOrders = async (db: Queryable, filters: OrderListFilters): Promise<OrderListPage> => {
  const params: unknown[] = [];
  const param = (value: unknown): string => {
    params.push(value);
    return `$${params.length}`;
  };
  const where: string[] = [];

  if (filters.year !== undefined) where.push(`o.year = ${param(filters.year)}`);
  if (filters.status) where.push(`o.status = ${param(filters.status)}`);
  if (filters.accountType) where.push(`o.account_type = ${param(filters.accountType)}`);
  if (filters.buyerId !== undefined) where.push(`o.buyer_id = ${param(filters.buyerId)}`);
  if (filters.registeredFrom) where.push(`o.registered_on >= ${param(filters.registeredFrom)}::date`);
  if (filters.registeredTo) where.push(`o.registered_on <= ${param(filters.registeredTo)}::date`);
  if (filters.lobCategory || filters.positionStatus) {
    const positionConditions = ['p.order_id = o.id', 'p.deleted_at IS NULL'];
    if (filters.lobCategory) positionConditions.push(`p.lob_category = ${param(filters.lobCategory)}`);
    if (filters.positionStatus) positionConditions.push(`p.status = ${param(filters.positionStatus)}`);
    where.push(`EXISTS (SELECT 1 FROM positions p WHERE ${positionConditions.join(' AND ')})`);
  }
  if (filters.search) {
    const pattern = param(containsPattern(filters.search));
    const alternatives = [
      `lower(o.buyer_name) LIKE ${pattern}`,
      `lower(coalesce(o.town, '')) LIKE ${pattern}`,
      `lower(coalesce(o.end_user_bid_number, '')) LIKE ${pattern}`,
      `lower(coalesce(o.name, '')) LIKE ${pattern}`,
    ];
    if (/^\d{1,9}$/.test(filters.search)) alternatives.push(`o.mdp_number = ${param(Number(filters.search))}`);
    where.push(`(${alternatives.join(' OR ')})`);
  }
  if (filters.cursor) {
    where.push(`(o.registered_on, o.id) < (${param(filters.cursor.registeredOn)}::date, ${param(filters.cursor.id)})`);
  }

  // Pobieramy o jeden wiersz więcej, żeby wiedzieć, czy jest następna strona.
  const limit = param(filters.limit + 1);
  const sql = `
    SELECT o.id, o.year, o.mdp_id, o.end_user_bid_number, o.name, o.registered_on, o.publication_date, o.bid_date,
           o.status, o.account_type, o.budget, o.buyer_id, o.buyer_name, o.town, o.province, o.positions_count,
           lobs.lob_categories, lobs.with_winner, statuses.status_counts
      FROM v_orders o
      LEFT JOIN LATERAL (
        SELECT array_remove(array_agg(DISTINCT p.lob_category), NULL) AS lob_categories,
               count(p.winner_id) AS with_winner
          FROM positions p WHERE p.order_id = o.id AND p.deleted_at IS NULL
      ) lobs ON true
      LEFT JOIN LATERAL (
        SELECT coalesce(jsonb_object_agg(s.status, s.n), '{}'::jsonb) AS status_counts
          FROM (SELECT p.status, count(*) AS n FROM positions p
                 WHERE p.order_id = o.id AND p.deleted_at IS NULL GROUP BY p.status) s
      ) statuses ON true
     ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
     ORDER BY o.registered_on DESC, o.id DESC
     LIMIT ${limit}`;

  const { rows } = await db.query(sql, params);
  const hasMore = rows.length > filters.limit;
  const items: OrderListItem[] = rows.slice(0, filters.limit).map((row) => ({
    id: row.id,
    year: row.year,
    mdpId: row.mdp_id,
    endUserBidNumber: row.end_user_bid_number,
    name: row.name,
    registeredOn: row.registered_on,
    publicationDate: row.publication_date,
    bidDate: row.bid_date,
    status: row.status,
    accountType: row.account_type,
    budget: row.budget,
    buyer: { id: row.buyer_id, name: row.buyer_name, town: row.town, province: row.province },
    positionsCount: row.positions_count,
    lobCategories: row.lob_categories ?? [],
    positionStatusCounts: row.status_counts ?? {},
    positionsWithWinner: row.with_winner,
  }));
  const last = items[items.length - 1];
  return {
    items,
    nextCursor: hasMore && last ? encodeCursor({ registeredOn: last.registeredOn, id: last.id }) : null,
  };
};

// --- Szczegóły zamówienia ------------------------------------------------------------------------------------

const mapBuyer = (row: any, prefix = ''): BuyerDetails => ({
  id: row[`${prefix}id`],
  name: row[`${prefix}name`],
  street: row.street,
  zipCode: row.zip_code,
  town: row.town,
  province: row.province,
  nip: row.nip,
  canonicalId: row.merged_into_id,
});

const mapContact = (row: any): ContactDetails => ({
  id: row.id,
  fullName: row.full_name,
  phone: row.phone,
  email: row.email,
  email2: row.email2,
  fax: row.fax,
});

export const getOrder = async (db: Queryable, id: number): Promise<OrderDetails | null> => {
  const [orderResult, positionsResult, lettersResult] = await Promise.all([
    db.query(
      `SELECT vo.id, vo.year, vo.mdp_id, vo.end_user_bid_number, vo.name, vo.registered_on, vo.order_week,
              vo.publication_date, vo.publication_quarter, vo.bid_date, vo.account_type, vo.financing_eu, vo.budget,
              vo.status, vo.value_total, vo.parts_count, vo.avg_part_value,
              o.siwz_url, o.extra_urls, o.outside_uzp, o.lenovo_top_ten, o.comments, o.source_tender_id, o.version,
              st.label AS status_label,
              b.id AS buyer_id, b.name AS buyer_name, b.street, b.zip_code, b.town, b.province, b.nip, b.merged_into_id,
              c.id AS contact_id, c.full_name, c.phone, c.email, c.email2, c.fax
         FROM v_orders vo
         JOIN orders o ON o.id = vo.id
         JOIN order_statuses st ON st.code = o.status
         JOIN buyers b ON b.id = o.buyer_id
         LEFT JOIN buyer_contacts c ON c.id = o.contact_id
        WHERE vo.id = $1`,
      [id]
    ),
    db.query(
      `SELECT p.id, p.position_number, p.legacy_id, p.part_label, p.lob_category, p.quantity, p.architecture, p.cpu_no,
              os.label AS os, oo.label AS office, p.initial_benchmark, af.label AS acquisition_form, p.remarks,
              p.attributes, p.status, ps.label AS status_label, w.id AS winner_id, w.name AS winner_name,
              v.id AS vendor_id, v.name AS vendor_name, p.award_letter_date, fo.label AS final_office,
              p.delivery_term, p.part_value, p.version
         FROM positions p
         JOIN position_statuses ps ON ps.code = p.status
         LEFT JOIN os_options os ON os.id = p.os_id
         LEFT JOIN office_options oo ON oo.id = p.office_id
         LEFT JOIN office_options fo ON fo.id = p.final_office_id
         LEFT JOIN acquisition_forms af ON af.id = p.acquisition_form_id
         LEFT JOIN winners w ON w.id = p.winner_id
         LEFT JOIN vendors v ON v.id = p.vendor_id
        WHERE p.order_id = $1 AND p.deleted_at IS NULL
        ORDER BY p.position_number`,
      [id]
    ),
    db.query(
      `SELECT id, sent_at, order_status, mail_to, mail_cc, confirmed_on, cancelled_at
         FROM letters WHERE order_id = $1 ORDER BY sent_at DESC, id DESC`,
      [id]
    ),
  ]);

  const row = orderResult.rows[0];
  if (!row) return null;

  const positions: PositionDetails[] = positionsResult.rows.map((p) => ({
    id: p.id,
    positionNumber: p.position_number,
    legacyId: p.legacy_id,
    partLabel: p.part_label,
    lobCategory: p.lob_category,
    quantity: p.quantity,
    architecture: p.architecture,
    cpuNo: p.cpu_no,
    os: p.os,
    office: p.office,
    initialBenchmark: p.initial_benchmark,
    acquisitionForm: p.acquisition_form,
    remarks: p.remarks,
    attributes: p.attributes ?? {},
    status: p.status,
    statusLabel: p.status_label,
    winner: p.winner_id === null ? null : { id: p.winner_id, name: p.winner_name },
    vendor: p.vendor_id === null ? null : { id: p.vendor_id, name: p.vendor_name },
    awardLetterDate: p.award_letter_date,
    finalOffice: p.final_office,
    deliveryTerm: p.delivery_term,
    partValue: p.part_value,
    version: p.version,
  }));

  const letters: LetterDetails[] = lettersResult.rows.map((l) => ({
    id: l.id,
    sentAt: iso(l.sent_at) as string,
    orderStatus: l.order_status,
    mailTo: l.mail_to,
    mailCc: l.mail_cc,
    confirmedOn: l.confirmed_on,
    cancelledAt: iso(l.cancelled_at),
  }));

  return {
    id: row.id,
    year: row.year,
    mdpId: row.mdp_id,
    endUserBidNumber: row.end_user_bid_number,
    name: row.name,
    registeredOn: row.registered_on,
    orderWeek: row.order_week,
    publicationDate: row.publication_date,
    publicationQuarter: row.publication_quarter,
    bidDate: row.bid_date,
    siwzUrl: row.siwz_url,
    extraUrls: row.extra_urls,
    financingEu: row.financing_eu,
    budget: row.budget,
    accountType: row.account_type,
    outsideUzp: row.outside_uzp,
    lenovoTopTen: row.lenovo_top_ten,
    comments: row.comments,
    status: row.status,
    statusLabel: row.status_label,
    valueTotal: row.value_total,
    partsCount: row.parts_count,
    avgPartValue: row.avg_part_value,
    sourceTenderId: row.source_tender_id,
    version: row.version,
    buyer: mapBuyer(row, 'buyer_'),
    contact: row.contact_id === null ? null : mapContact({ ...row, id: row.contact_id }),
    positions,
    letters,
  };
};

// --- Zamawiający i ich kontakty ------------------------------------------------------------------------------

export const searchBuyers = async (db: Queryable, input: BuyerSearchInput): Promise<BuyerSearchItem[]> => {
  const nip = /^\d{10}$/.test(input.query) ? input.query : null;
  const { rows } = await db.query(
    `SELECT b.id, b.name, b.street, b.zip_code, b.town, b.province, b.nip, b.merged_into_id,
            (SELECT count(*) FROM orders o WHERE o.buyer_id = b.id AND o.deleted_at IS NULL) AS orders_count,
            (SELECT count(*) FROM buyer_contacts c WHERE c.buyer_id = b.id AND c.deleted_at IS NULL) AS contacts_count
       FROM buyers b
      WHERE b.deleted_at IS NULL
        AND (lower(b.name) LIKE $1 OR lower(coalesce(b.town, '')) LIKE $1 OR coalesce(b.zip_code, '') LIKE $1 OR b.nip = $2)
      ORDER BY (lower(b.name) LIKE $3) DESC, orders_count DESC, b.name, b.id
      LIMIT $4`,
    [containsPattern(input.query), nip, prefixPattern(input.query), input.limit]
  );
  return rows.map((row) => ({
    ...mapBuyer(row),
    ordersCount: row.orders_count,
    contactsCount: row.contacts_count,
  }));
};

const RECENT_ORDERS_LIMIT = 10;

export const getBuyer = async (db: Queryable, id: number): Promise<BuyerWithContacts | null> => {
  const [buyerResult, contactsResult, ordersResult] = await Promise.all([
    db.query(
      `SELECT b.id, b.name, b.street, b.zip_code, b.town, b.province, b.nip, b.merged_into_id,
              (SELECT count(*) FROM orders o WHERE o.buyer_id = b.id AND o.deleted_at IS NULL) AS orders_count
         FROM buyers b WHERE b.id = $1 AND b.deleted_at IS NULL`,
      [id]
    ),
    db.query(
      `SELECT id, full_name, phone, email, email2, fax FROM buyer_contacts
        WHERE buyer_id = $1 AND deleted_at IS NULL ORDER BY full_name NULLS LAST, email, id`,
      [id]
    ),
    db.query(
      `SELECT id, year, mdp_id, registered_on, name FROM v_orders
        WHERE buyer_id = $1 ORDER BY registered_on DESC, id DESC LIMIT $2`,
      [id, RECENT_ORDERS_LIMIT]
    ),
  ]);
  const row = buyerResult.rows[0];
  if (!row) return null;
  return {
    ...mapBuyer(row),
    contacts: contactsResult.rows.map(mapContact),
    ordersCount: row.orders_count,
    recentOrders: ordersResult.rows.map((o) => ({
      id: o.id,
      year: o.year,
      mdpId: o.mdp_id,
      registeredOn: o.registered_on,
      name: o.name,
    })),
  };
};
