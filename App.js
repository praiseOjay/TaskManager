// App.js
import React, { useState, useEffect } from 'react';
import { ExpoRoot } from 'expo-router';
import { TaskProvider } from './context/TaskContext';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTaskContext } from './context/TaskContext';
import SplashScreen from './components/SplashScreen';

function AppContent() {
  const { isDarkMode } = useTaskContext();
  const ctx = require.context('./app');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show splash screen for 2 seconds
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <PaperProvider theme={isDarkMode ? MD3DarkTheme : MD3LightTheme}>
      <ExpoRoot context={ctx} />
    </PaperProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </GestureHandlerRootView>
  );
}
