// _layout.js

// Import necessary components and providers
import React from 'react';
import { Slot } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { TaskProvider } from '../context/TaskContext';
import { DrawerProvider } from '../context/DrawerContext';

// Main layout component for the app
export default function Layout() {
  return (
    // Wrap the entire app with necessary providers
    <PaperProvider>
      <TaskProvider>
        <DrawerProvider>
          {/* Slot component from expo-router to render child routes */}
          <Slot />
        </DrawerProvider>
      </TaskProvider>
    </PaperProvider>
  );
}
