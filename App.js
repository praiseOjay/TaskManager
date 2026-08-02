// App.js

import React, { useState, useEffect } from 'react';
import { ExpoRoot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SplashScreen from './components/SplashScreen';

// AppContent component to handle splash screen and root router setup
function AppContent() {
  // Set up the context for expo-router
  const ctx = require.context('./app');

  // State to manage the splash loading status
  const [isLoading, setIsLoading] = useState(true);

  // Show splash screen for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Render splash screen while loading
  if (isLoading) {
    return <SplashScreen />;
  }

  // Render the root router
  return <ExpoRoot context={ctx} />;
}

// Main App entry point
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppContent />
    </GestureHandlerRootView>
  );
}

