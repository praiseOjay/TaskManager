// _layout.js

// Import necessary components and providers
import React from 'react';
import { Slot } from 'expo-router';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { TaskProvider, useTaskContext } from '../context/TaskContext';
import { DrawerProvider } from '../context/DrawerContext';

// Inner layout to consume theme from TaskContext
function InnerLayout() {
  const { isDarkMode } = useTaskContext();
  const theme = isDarkMode ? MD3DarkTheme : MD3LightTheme;

  return (
    <PaperProvider theme={theme}>
      <DrawerProvider>
        <Slot />
      </DrawerProvider>
    </PaperProvider>
  );
}

// Main layout component for the app
export default function Layout() {
  return (
    <TaskProvider>
      <InnerLayout />
    </TaskProvider>
  );
}

