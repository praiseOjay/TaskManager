// components/SplashScreen.js
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="check-circle-outline" size={80} color="white" />
      <Text style={styles.title}>Task Management App</Text>
      <Text style={styles.subtitle}>Organize your tasks efficiently</Text>
      <ActivityIndicator style={styles.loader} size="large" color="white" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8e44ad', // Purple color as shown in the image
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 10,
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;
