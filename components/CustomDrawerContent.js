// CustomDrawerContent.js

// Import necessary modules and components
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { useTaskContext } from '../context/TaskContext';
import { useDrawer } from '../context/DrawerContext';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function CustomDrawerContent(props) {
  // Initialize router and access context hooks
  const router = useRouter();
  const { isDarkMode } = useTaskContext();
  const { closeDrawer } = useDrawer();

  // Define container style with purple background
  const containerStyle = {
    ...styles.container,
    backgroundColor: '#8e44ad', // Purple background
  };

  // Define text style with white color
  const textStyle = {
    color: '#fff', // White text
  };

  // Handle navigation and close drawer
  const handleNavigation = (route) => {
    closeDrawer();
    router.push(route);
  };

  return (
    <DrawerContentScrollView {...props} style={containerStyle}>
      {/* Drawer header with close button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={closeDrawer}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Drawer content */}
      <View style={styles.drawerContent}>
        {/* App logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="checkmark-circle-outline" size={40} color="#fff" />
          </View>
        </View>

        {/* App title and subtitle */}
        <Text style={styles.title}>Task Management App</Text>
        <Text style={styles.subtitle}>Organize your tasks efficiently</Text>

        {/* Navigation menu items */}
        <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('/')}>
          <Ionicons name="home-outline" size={24} color="#fff" style={styles.menuIcon} />
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('/task-list')}>
          <Ionicons name="list-outline" size={24} color="#fff" style={styles.menuIcon} />
          <Text style={styles.menuText}>Task List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('/settings')}>
          <Ionicons name="settings-outline" size={24} color="#fff" style={styles.menuIcon} />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  closeButton: {
    padding: 8,
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    fontSize: 18,
    color: '#fff',
  },
});
