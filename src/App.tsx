import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserPreferencesProvider } from './context/UserPreferencesContext';
import Tenders from './components/tenders';
import OrdersModule from './features/orders/OrdersModule';
import { useHashRoute } from './hooks/useHashRoute';
import { moduleForHash } from './modules';
import ScrollToTopButton from './components/ScrollToTopButton';
import AwaySummary from './components/AwaySummary';
import { AwaySummaryProvider } from './context/AwaySummaryContext';
import LoginScreen from './components/LoginScreen';
import NoAccessScreen from './components/NoAccessScreen';
import { MESSAGES } from './constants';
import styles from './components/Auth.module.css';
import './styles/theme.css';

/** Wybiera moduł aplikacji na podstawie hasha adresu (domyślnie przetargi). Przełączenie odmontowuje poprzedni moduł. */
const ModuleSwitch: React.FC = () => {
  const hash = useHashRoute();
  return moduleForHash(hash) === 'orders' ? <OrdersModule /> : <Tenders />;
};

/** Pokazuje aplikację tylko zalogowanym użytkownikom, którzy mają nadaną rolę. */
const AuthGate: React.FC = () => {
  const { user, role, loading } = useAuth();

  if (loading) return <div className={styles.loadingScreen} role="status">{MESSAGES.LOADING}</div>;
  if (!user) return <LoginScreen />;
  if (!role) return <NoAccessScreen />;

  return (
    <UserPreferencesProvider>
      <AwaySummaryProvider>
        <ModuleSwitch />
        <ScrollToTopButton />
        <AwaySummary />
      </AwaySummaryProvider>
    </UserPreferencesProvider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
