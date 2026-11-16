import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase';
import { BuyerSearchItem, BuyerWithContacts, Dictionaries, OrderDetails, OrderListPage } from '../../types/Orders';

/** Filtry listy zamówień; pola odpowiadają parseListOrdersInput w functions/orders/validation.ts. */
export interface OrderListQuery {
    year?: number;
    status?: string;
    accountType?: string;
    lobCategory?: string;
    positionStatus?: string;
    buyerId?: number;
    search?: string;
    registeredFrom?: string;
    registeredTo?: string;
    limit?: number;
    cursor?: string;
}

const call =
    <In, Out>(name: string) =>
    async (data: In): Promise<Out> =>
        (await httpsCallable<In, Out>(functions, name)(data)).data;

// Nazwy funkcji zgodne z functions/index.ts (blok zamówień).
export const getDictionaries = () => call<Record<string, never>, Dictionaries>('getDictionaries')({});
export const listOrders = call<OrderListQuery, OrderListPage>('listOrders');
export const getOrder = (id: number) => call<{ id: number }, OrderDetails>('getOrder')({ id });
export const searchBuyers = call<{ query: string; limit?: number }, BuyerSearchItem[]>('searchBuyers');
export const getBuyer = (id: number) => call<{ id: number }, BuyerWithContacts>('getBuyer')({ id });
