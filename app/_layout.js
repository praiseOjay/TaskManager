import React from 'react';
import { Slot } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { TaskProvider } from '../context/TaskContext';
import { DrawerProvider } from '../context/DrawerContext'; // We'll create this

export default function Layout() {
  return (
    <PaperProvider>
      <TaskProvider>
        <DrawerProvider>
          <Slot />
        </DrawerProvider>
      </TaskProvider>
    </PaperProvider>
  );
}
