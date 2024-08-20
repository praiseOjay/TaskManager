// components/CustomDrawerContent.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { useTaskContext } from '../context/TaskContext';
import { useDrawer } from '../context/DrawerContext';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function CustomDrawerContent(props) {
  const router = useRouter();
  const { isDarkMode } = useTaskContext();
  const { closeDrawer } = useDrawer();

  const containerStyle = {
    ...styles.container,
    backgroundColor: '#8e44ad', // Purple background
  };

  const textStyle = {
    color: '#fff', // White text
  };

  const handleNavigation = (route) => {
    closeDrawer();
    router.push(route);
  };

  return (
    <DrawerContentScrollView {...props} style={containerStyle}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={closeDrawer}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.drawerContent}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="checkmark-circle-outline" size={40} color="#fff" />
          </View>
        </View>
        <Text style={styles.title}>Task Management App</Text>
        <Text style={styles.subtitle}>Organize your tasks efficiently</Text>
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
