import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  adaptNavigationTheme,
} from 'react-native-paper';
import { AppProvider, useApp } from './src/context/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { BottomTabBar } from './src/components/BottomTabBar';
import { COLORS } from './src/theme/theme';

const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.light.primary,
    secondary: COLORS.light.secondary,
    background: COLORS.light.background,
    surface: COLORS.light.surface,
    outline: COLORS.light.border,
  },
};

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS.dark.primary,
    secondary: COLORS.dark.secondary,
    background: COLORS.dark.background,
    surface: COLORS.dark.surface,
    outline: COLORS.dark.border,
  },
};

function AppContent() {
  const { theme } = useApp();
  const paperTheme = theme === 'dark' ? customDarkTheme : customLightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme === 'dark' ? '#0F172A' : '#FFFFFF'}
      />
      <AppNavigator />
      <BottomTabBar />
    </PaperProvider>
  );
}

import { Provider } from 'react-redux';
import { store } from './src/store';

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
