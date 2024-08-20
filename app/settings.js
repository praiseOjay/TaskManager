import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Switch, Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTaskContext } from '../context/TaskContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { clearAllTasks, isDarkMode, toggleDarkMode } = useTaskContext();

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
          text: "OK",
          onPress: () => {
            clearAllTasks();
            Alert.alert("Success", "All tasks have been cleared.");
          }
        }
      ]
    );
  };

  const containerStyle = {
    ...styles.container,
    backgroundColor: isDarkMode ? '#121212' : '#fff',
  };

  const textStyle = {
    color: isDarkMode ? '#fff' : '#000',
  };

  return (
    <View style={containerStyle}>
      <Appbar.Header style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }}>
        <Appbar.BackAction onPress={() => router.back()} color={isDarkMode ? '#fff' : '#000'} />
        <Appbar.Content title="Settings" titleStyle={textStyle} />
      </Appbar.Header>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, textStyle]}>Appearance</Text>

        <View style={styles.settingItem}>
          <Text style={textStyle}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>

        <TouchableOpacity style={styles.settingItem} onPress={handleClearAllTasks}>
          <View style={styles.clearTasksButton}>
            <MaterialCommunityIcons name="delete-outline" size={24} color="#FF0000" />
            <Text style={styles.clearTasksText}>Clear All Tasks</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  clearTasksButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearTasksText: {
    marginLeft: 8,
    color: '#FF0000',
  },
});
