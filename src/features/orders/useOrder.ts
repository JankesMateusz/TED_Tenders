import { useEffect, useState } from 'react';
import { OrderDetails } from '../../types/Orders';
import { getOrder } from './ordersApi';

export type OrderState =
    | { status: 'loading' }
    | { status: 'ready'; order: OrderDetails }
    | { status: 'notFound' }
    | { status: 'error'; message: string };

/** Szczegóły zamówienia; zmiana id zaczyna ładowanie od nowa, a spóźniona odpowiedź poprzedniego id jest ignorowana. */
export const useOrder = (id: number, reloadKey = 0): OrderState => {
    const [state, setState] = useState<OrderState>({ status: 'loading' });

    useEffect(() => {
        let active = true;
        setState({ status: 'loading' });
        getOrder(id).then(
            (order) => active && setState({ status: 'ready', order }),
            (error) => {
                if (!active) return;
                if (error?.code === 'functions/not-found') setState({ status: 'notFound' });
                else setState({ status: 'error', message: 'Nie udało się pobrać zamówienia.' });
            }
        );
        return () => {
            active = false;
        };
    }, [id, reloadKey]);

    return state;
};
