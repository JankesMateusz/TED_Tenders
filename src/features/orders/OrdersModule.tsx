import React from 'react';
import headerStyles from '../../components/Header.module.css';
import ModuleMenu from '../../components/ModuleMenu';
import UserMenu from '../../components/UserMenu';
import { useHashRoute } from '../../hooks/useHashRoute';
import OrderDetailsView from './OrderDetailsView';
import OrdersList from './OrdersList';
import { orderIdFromHash } from './ordersRoute';
import styles from './OrdersModule.module.css';

/**
 * Moduł zamówień (POC). Nagłówek z menu modułów, lista zamówień i szczegóły wybranego zamówienia
 * (dane z bazy PostgreSQL przez funkcje z functions/orders). Wybór zamówienia jest w adresie: `#/zamowienia/ID`.
 */
const OrdersModule: React.FC = () => {
    const orderId = orderIdFromHash(useHashRoute());

    return (
        <div className={styles.app}>
            <header className={headerStyles.header}>
                <div className={headerStyles.headerInner}>
                    <div className={headerStyles.brand}>
                        <ModuleMenu current="orders" />
                        <span className={headerStyles.brandMark} aria-hidden="true">Z</span>
                        <h1 className={headerStyles.title}>Zamówienia</h1>
                    </div>
                    <div className={styles.account}>
                        <UserMenu />
                    </div>
                </div>
            </header>
            <main className={styles.content}>
                {/* Lista zostaje zamontowana (tylko ukryta), żeby po powrocie z zamówienia filtry i załadowane strony były na miejscu. */}
                <div hidden={orderId !== null}>
                    <OrdersList />
                </div>
                {orderId !== null && <OrderDetailsView id={orderId} />}
            </main>
        </div>
    );
};

export default OrdersModule;
