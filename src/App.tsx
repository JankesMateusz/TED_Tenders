import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { UserPreferencesProvider } from './context/UserPreferencesContext';
import Tenders from './components/tenders';
import ScrollToTopButton from './components/ScrollToTopButton';
import './styles/theme.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UserPreferencesProvider>
        <Tenders />
        <ScrollToTopButton />
      </UserPreferencesProvider>
    </ThemeProvider>
  );
};

export default App;
