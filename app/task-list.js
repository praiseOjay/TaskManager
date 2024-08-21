// task-list.js

// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Animated, Dimensions, TouchableOpacity, StatusBar, Platform, Alert, Image, Modal } from 'react-native';
import { Text, Card, Menu } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTaskContext } from '../context/TaskContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDrawer } from '../context/DrawerContext';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { format } from 'date-fns';
import { Swipeable } from 'react-native-gesture-handler';
import PDFReader from 'react-native-view-pdf';

// Define constants for layout and styling
const DRAWER_WIDTH = Dimensions.get('window').width * 0.8;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const EXTRA_HEADER_PADDING = 20;
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function TaskListScreen() {
  // Access task context and router
  const { tasks, toggleTaskCompletion, filterBy, setFilterBy, sortBy, setSortBy, deleteTask, isDarkMode } = useTaskContext();
  const router = useRouter();
  const { isDrawerOpen, toggleDrawer } = useDrawer();

  // State variables
  const [slideAnim] = useState(new Animated.Value(-DRAWER_WIDTH));
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [priorityMenuVisible, setPriorityMenuVisible] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  // Handle attachment press
  const handleAttachmentPress = (attachment) => {
    setSelectedAttachment(attachment);
  };

  // Close attachment viewer
  const closeAttachmentViewer = () => {
    setSelectedAttachment(null);
  };

  // Animate drawer opening/closing
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isDrawerOpen ? 0 : -DRAWER_WIDTH,
      duration: 50,
      useNativeDriver: false,
    }).start();
  }, [isDrawerOpen]);

  // Confirm task deletion
  const confirmDelete = (taskId) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteTask(taskId), style: "destructive" }
      ]
    );
  };

  // Render right swipe actions (delete button)
  const renderRightActions = (taskId) => {
    return (
      <TouchableOpacity style={styles.deleteAction} onPress={() => confirmDelete(taskId)}>
        <Text style={styles.deleteActionText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  // Render individual task item
  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity onPress={() => router.push(`/edit-task/${item.id}`)}>
        <Card style={[styles.taskCard, { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }]}>
          <View style={styles.taskContent}>
            <View style={styles.taskMain}>
              <Text style={[styles.taskTitle, item.completed && styles.completedTask, { color: isDarkMode ? '#fff' : '#000' }]}>{item.title}</Text>
              <Text style={[styles.taskDescription, { color: isDarkMode ? '#B0B0B0' : '#757575' }]}>{item.description}</Text>
              <View style={styles.taskFooter}>
                <View style={styles.taskDate}>
                  <MaterialCommunityIcons name="calendar" size={16} color={isDarkMode ? '#64B5F6' : '#2196F3'} />
                  <Text style={[styles.taskDateText, { color: isDarkMode ? '#64B5F6' : '#2196F3' }]}>
                    {item.dueDate ? format(new Date(item.dueDate), 'MMM d, yyyy HH:mm') : 'No due date'}
                  </Text>
                </View>
                <View style={[styles.taskPriority, { backgroundColor: getPriorityColor(item.priority) }]}>
                  <Text style={styles.taskPriorityText}>{item.priority}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)} style={styles.checkbox}>
              <MaterialCommunityIcons
                name={item.completed ? "checkbox-marked-circle-outline" : "checkbox-blank-circle-outline"}
                size={24}
                color={item.completed ? "#4CAF50" : (isDarkMode ? '#B0B0B0' : '#757575')}
              />
            </TouchableOpacity>
          </View>
          <View horizontal style={styles.attachmentsContainer}>
            {item.attachments && item.attachments.map((attachment, index) => (
              <TouchableOpacity
                key={index}
                style={styles.attachmentItem}
                onPress={() => handleAttachmentPress(attachment)}
              >
                {attachment.type === 'image' ? (
                  <Image source={{ uri: attachment.uri }} style={styles.attachmentImage} />
                ) : (
                  <View style={styles.attachmentFile}>
                    <MaterialCommunityIcons name="file-document-outline" size={24} color={isDarkMode ? '#B0B0B0' : '#757575'} />
                    <Text style={[styles.attachmentFileName, { color: isDarkMode ? '#B0B0B0' : '#757575' }]} numberOfLines={1}>{attachment.name}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      </TouchableOpacity>
    </Swipeable>
  );

  // Get color based on task priority
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return '#FF5252';
      case 'medium': return '#FFC107';
      case 'low': return '#4CAF50';
      default: return '#757575';
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }]}>
          <TouchableOpacity onPress={toggleDrawer}>
            <MaterialCommunityIcons name="menu" size={24} color={isDarkMode ? '#fff' : '#333'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Task List</Text>
        </View>

        {/* Filter and Sort options */}
        <View style={styles.filterSortContainer}>
          <Menu
            visible={categoryMenuVisible}
            onDismiss={() => setCategoryMenuVisible(false)}
            anchor={
              <TouchableOpacity style={[styles.dropdown, { backgroundColor: isDarkMode ? '#333' : '#fff', borderColor: isDarkMode ? '#555' : '#e0e0e0' }]} onPress={() => setCategoryMenuVisible(true)}>
                <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>{filterBy}</Text>
                <MaterialCommunityIcons name="chevron-down" size={24} color={isDarkMode ? '#fff' : '#333'} />
              </TouchableOpacity>
            }
          >
            <Menu.Item onPress={() => { setFilterBy('All'); setCategoryMenuVisible(false); }} title="All" />
            <Menu.Item onPress={() => { setFilterBy('Work'); setCategoryMenuVisible(false); }} title="Work" />
            <Menu.Item onPress={() => { setFilterBy('Personal'); setCategoryMenuVisible(false); }} title="Personal" />
            <Menu.Item onPress={() => { setFilterBy('Shopping'); setCategoryMenuVisible(false); }} title="Shopping" />
            <Menu.Item onPress={() => { setFilterBy('Other'); setCategoryMenuVisible(false); }} title="Other" />
          </Menu>
          <Menu
            visible={priorityMenuVisible}
            onDismiss={() => setPriorityMenuVisible(false)}
            anchor={
              <TouchableOpacity style={[styles.dropdown, { backgroundColor: isDarkMode ? '#333' : '#fff', borderColor: isDarkMode ? '#555' : '#e0e0e0' }]} onPress={() => setPriorityMenuVisible(true)}>
                <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>{sortBy}</Text>
                <MaterialCommunityIcons name="chevron-down" size={24} color={isDarkMode ? '#fff' : '#333'} />
              </TouchableOpacity>
            }
          >
            <Menu.Item onPress={() => { setSortBy('All'); setPriorityMenuVisible(false); }} title="All" />
            <Menu.Item onPress={() => { setSortBy('High'); setPriorityMenuVisible(false); }} title="High" />
            <Menu.Item onPress={() => { setSortBy('Medium'); setPriorityMenuVisible(false); }} title="Medium" />
            <Menu.Item onPress={() => { setSortBy('Low'); setPriorityMenuVisible(false); }} title="Low" />
          </Menu>
        </View>

        {/* Task list */}
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.taskList}
        />
      </View>

      {/* Animated drawer */}
      <Animated.View style={[styles.drawer, { left: slideAnim, backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }]}>
        <CustomDrawerContent isDarkMode={isDarkMode} />
      </Animated.View>

      {/* Overlay when drawer is open */}
      {isDrawerOpen && (
        <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} activeOpacity={1} />
      )}

      {/* Modal for displaying attachments */}
      <Modal visible={selectedAttachment !== null} transparent={true} onRequestClose={closeAttachmentViewer}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeAttachmentViewer}>
            <MaterialCommunityIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          {selectedAttachment && selectedAttachment.type === 'image' ? (
            <Image
              source={{ uri: selectedAttachment.uri }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          ) : selectedAttachment && selectedAttachment.type === 'file' && selectedAttachment.name.toLowerCase().endsWith('.pdf') ? (
            <PDFReader
              source={{ uri: selectedAttachment.uri }}
              style={styles.pdfViewer}
            />
          ) : (
            <View style={styles.unsupportedFileContainer}>
              <Text style={styles.unsupportedFileText}>
                This file type is not supported for preview.
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: STATUSBAR_HEIGHT + EXTRA_HEADER_PADDING,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    elevation: 4,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  filterSortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '130%',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '48%',
  },
  taskList: {
    padding: 16,
  },
  taskCard: {
    marginBottom: 16,
    borderRadius: 8,
  },
  taskContent: {
    flexDirection: 'row',
    padding: 16,
  },
  taskMain: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  completedTask: {
    textDecorationLine: 'line-through',
  },
  taskDescription: {
    marginTop: 4,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  taskDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDateText: {
    marginLeft: 4,
  },
  taskPriority: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  taskPriorityText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkbox: {
    marginLeft: 16,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  attachmentItem: {
    margin: 4,
  },
  attachmentImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  attachmentFile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    padding: 4,
  },
  attachmentFileName: {
    marginLeft: 4,
    fontSize: 12,
    maxWidth: 80,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    elevation: 5,
    zIndex: 2,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  deleteAction: {
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 20,
    height: '100%',
  },
  deleteActionText: {
    color: '#fff',
    fontWeight: 'bold',
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  fullScreenImage: {
    width: screenWidth,
    height: screenHeight,
  },
  pdfViewer: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  unsupportedFileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unsupportedFileText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
