import React from 'react';
import headerStyles from '../../components/Header.module.css';
import ModuleMenu from '../../components/ModuleMenu';
import UserMenu from '../../components/UserMenu';
import OrdersList from './OrdersList';
import styles from './OrdersModule.module.css';

/**
 * Moduł zamówień (POC). Nagłówek z menu modułów i lista zamówień (dane z bazy PostgreSQL przez funkcje z functions/orders).
 */
const OrdersModule: React.FC = () => (
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
            <OrdersList />
        </main>
    </div>
);

export default OrdersModule;
