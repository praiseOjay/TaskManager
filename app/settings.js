// settings.js

// Import necessary React and React Native components
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Switch, Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTaskContext } from '../context/TaskContext';

// Main component for the Settings screen
export default function SettingsScreen() {
  // Initialize router and access task context
  const router = useRouter();
  const { isDarkMode, toggleDarkMode, clearAllTasks } = useTaskContext();

  // Handler for clearing all tasks
  const handleClearAllTasks = () => {
    Alert.alert(
      "Clear All Tasks",
      "Are you sure you want to delete all tasks? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear",
          onPress: () => {
            clearAllTasks();
            Alert.alert("Success", "All tasks have been deleted.");
          }
        }
      ]
    );
  };

  // Render the Settings screen
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#F5F5F5' }]}>
      {/* App header */}
      <Appbar.Header style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }}>
        <Appbar.BackAction onPress={() => router.back()} color={isDarkMode ? '#fff' : '#000'} />
        <Appbar.Content title="Settings" titleStyle={{ color: isDarkMode ? '#fff' : '#000' }} />
      </Appbar.Header>

      {/* Dark mode toggle */}
      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: isDarkMode ? '#fff' : '#000' }]}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>

      {/* Clear all tasks button */}
      <TouchableOpacity style={styles.settingItem} onPress={handleClearAllTasks}>
        <Text style={[styles.settingText, { color: isDarkMode ? '#fff' : '#000' }]}>Clear All Tasks</Text>
        <MaterialCommunityIcons name="delete" size={24} color={isDarkMode ? '#fff' : '#000'} />
      </TouchableOpacity>

      {/* App version information */}
      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: isDarkMode ? '#B0B0B0' : '#757575' }]}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingText: {
    fontSize: 16,
  },
  versionContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  versionText: {
    fontSize: 14,
  },
});
