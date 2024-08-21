// context/DrawerContext.js

// Import necessary React hooks and functions
import React, { createContext, useContext, useState } from 'react';

// Create a new context for drawer functionality
const DrawerContext = createContext();

// DrawerProvider component to wrap the app and provide drawer state and functions
export function DrawerProvider({ children }) {
  // State to track whether the drawer is open or closed
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Function to toggle the drawer state
  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  // Function to explicitly close the drawer
  const closeDrawer = () => setIsDrawerOpen(false);

  // Provide the drawer state and functions to child components
  return (
    <DrawerContext.Provider value={{ isDrawerOpen, toggleDrawer, closeDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
}

// Custom hook to easily access drawer context in other components
export function useDrawer() {
  return useContext(DrawerContext);
}
