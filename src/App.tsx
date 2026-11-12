import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserPreferencesProvider } from './context/UserPreferencesContext';
import Tenders from './components/tenders';
import ScrollToTopButton from './components/ScrollToTopButton';
import AwaySummary from './components/AwaySummary';
import LoginScreen from './components/LoginScreen';
import NoAccessScreen from './components/NoAccessScreen';
import { MESSAGES } from './constants';
import styles from './components/Auth.module.css';
import './styles/theme.css';

/** Pokazuje aplikację tylko zalogowanym użytkownikom, którzy mają nadaną rolę. */
const AuthGate: React.FC = () => {
  const { user, role, loading } = useAuth();

  if (loading) return <div className={styles.loadingScreen} role="status">{MESSAGES.LOADING}</div>;
  if (!user) return <LoginScreen />;
  if (!role) return <NoAccessScreen />;

  return (
    <UserPreferencesProvider>
      <Tenders />
      <ScrollToTopButton />
      <AwaySummary />
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
