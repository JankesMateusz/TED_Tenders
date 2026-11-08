import React from 'react';
import headerStyles from '../../components/Header.module.css';
import ModuleMenu from '../../components/ModuleMenu';
import UserMenu from '../../components/UserMenu';
import styles from './OrdersModule.module.css';

/**
 * Moduł zamówień (POC). Na razie szkielet: nagłówek z menu modułów i miejsce na listę zamówień, która
 * pojawi się w następnym kroku (dane z bazy PostgreSQL przez funkcje z functions/orders).
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
            <section className={styles.placeholder} aria-labelledby="orders-placeholder-title">
                <span className={styles.badge}>Wersja robocza</span>
                <h2 id="orders-placeholder-title">Lista zamówień pojawi się tutaj</h2>
                <p>
                    To szkielet nowego modułu. Kolejne kroki: lista zamówień z filtrami, szczegóły zamówienia
                    (zamawiający, kontakt, pozycje, pisma) i wprowadzanie danych.
                </p>
                <p>Przełączanie między modułami: przycisk z trzema kreskami po lewej stronie nagłówka.</p>
            </section>
        </main>
    </div>
);

export default OrdersModule;
