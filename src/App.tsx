import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { UserPreferencesProvider } from './context/UserPreferencesContext';
import Tenders from './components/tenders';
import './styles/theme.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UserPreferencesProvider>
        <Tenders />
      </UserPreferencesProvider>
    </ThemeProvider>
  );
};

export default App;
