// App.js

// Import necessary dependencies and components
import React, { useState, useEffect } from 'react';
import { ExpoRoot } from 'expo-router';
import { TaskProvider } from './context/TaskContext';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTaskContext } from './context/TaskContext';
import SplashScreen from './components/SplashScreen';

// AppContent component to handle the main app logic
function AppContent() {
  // Access the dark mode state from the TaskContext
  const { isDarkMode } = useTaskContext();

  // Set up the context for expo-router
  const ctx = require.context('./app');

  // State to manage the loading status
  const [isLoading, setIsLoading] = useState(true);

  // Effect to simulate a loading time for the splash screen
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show splash screen for 2 seconds
  }, []);

  // If still loading, show the splash screen
  if (isLoading) {
    return <SplashScreen />;
  }

  // Render the main app content
  return (
    <PaperProvider theme={isDarkMode ? MD3DarkTheme : MD3LightTheme}>
      <ExpoRoot context={ctx} />
    </PaperProvider>
  );
}

// Main App component
export default function App() {
  return (
    // Wrap the entire app with GestureHandlerRootView for gesture handling
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Provide the TaskContext to the entire app */}
      <TaskProvider>
        {/* Render the main app content */}
        <AppContent />
      </TaskProvider>
    </GestureHandlerRootView>
  );
}
