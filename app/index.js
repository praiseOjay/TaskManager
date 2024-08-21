// index.js

// Import necessary React and React Native components
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Animated, Dimensions, TouchableOpacity, StatusBar, Platform, Alert, Image, Modal } from 'react-native';
import { Text, TextInput, FAB, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTaskContext } from '../context/TaskContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDrawer } from '../context/DrawerContext';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { Swipeable } from 'react-native-gesture-handler';
import { format } from 'date-fns';
import PDFReader from 'react-native-view-pdf';

// Constants for layout and styling
const DRAWER_WIDTH = Dimensions.get('window').width * 0.8;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const EXTRA_HEADER_PADDING = 20;
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Main component for the home screen
export default function IndexScreen() {
  // State variables and context hooks
  const [searchQuery, setSearchQuery] = useState('');
  const { tasks, toggleTaskCompletion, deleteTask, isDarkMode } = useTaskContext();
  const router = useRouter();
  const { isDrawerOpen, toggleDrawer, closeDrawer } = useDrawer();
  const [slideAnim] = useState(new Animated.Value(-DRAWER_WIDTH));
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  // Effect for animating the drawer
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isDrawerOpen ? 0 : -DRAWER_WIDTH,
      duration: 50,
      useNativeDriver: false,
    }).start();
  }, [isDrawerOpen]);

  // Handler for attachment press
  const handleAttachmentPress = (attachment) => {
    setSelectedAttachment(attachment);
  };

  // Handler for closing attachment viewer
  const closeAttachmentViewer = () => {
    setSelectedAttachment(null);
  };

  // Handler for deleting a task
  const handleDeleteTask = (taskId) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            deleteTask(taskId);
            Alert.alert("Success", "Task has been deleted.");
          }
        }
      ]
    );
  };

  // Render right swipe actions for task items
  const renderRightActions = (progress, dragX, task) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => handleDeleteTask(task.id)}
      >
        <Animated.Text
          style={[
            styles.deleteActionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          Delete
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  // Render individual task item
  const renderItem = ({ item }) => (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item)
      }
    >
      <TouchableOpacity onPress={() => router.push(`/edit-task/${item.id}`)}>
        <Card style={[styles.taskCard, { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }]}>
          {/* Task header with title, description, and completion toggle */}
          <View style={styles.taskHeader}>
            <View>
              <Text style={[styles.taskTitle, item.completed && styles.completedTask, { color: isDarkMode ? '#fff' : '#000' }]}>{item.title}</Text>
              <Text style={[styles.taskDescription, { color: isDarkMode ? '#B0B0B0' : '#757575' }]}>{item.description}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
              <MaterialCommunityIcons
                name={item.completed ? "checkbox-marked-circle-outline" : "checkbox-blank-circle-outline"}
                size={24}
                color={item.completed ? "#4CAF50" : (isDarkMode ? '#B0B0B0' : '#757575')}
              />
            </TouchableOpacity>
          </View>
          {/* Task footer with due date and priority */}
          <View style={styles.taskFooter}>
            <View style={styles.taskDate}>
              <MaterialCommunityIcons name="calendar" size={16} color="#2196F3" />
              <Text style={[styles.taskDateText, { color: isDarkMode ? '#B0B0B0' : '#2196F3' }]}>{item.dueDate ?
              format(new Date(item.dueDate), 'PPp') : 'No due date'}</Text>
            </View>
            <View style={[styles.taskPriority, { backgroundColor: getPriorityColor(item.priority) }]}>
              <Text style={styles.taskPriorityText}>{item.priority}</Text>
            </View>
          </View>
        {/* Attachments preview */}
        {item.attachments && item.attachments.length > 0 && (
          <View style={styles.attachmentsContainer}>
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
        )}
        </Card>
      </TouchableOpacity>
    </Swipeable>
  );

  // Function to get color based on task priority
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return '#FF5252';
      case 'medium': return '#FFC107';
      case 'low': return '#4CAF50';
      default: return '#757575';
    }
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render the main component
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDarkMode ? '#121212' :'#F5F5F5' }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <View style={styles.container}>
        {/* Header with menu button and search input */}
        <View style={[styles.header, { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }]}>
          <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
            <MaterialCommunityIcons name="menu" size={24} color={isDarkMode ? '#fff' : '#000'} />
          </TouchableOpacity>
          <TextInput
            placeholder="Search tasks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { backgroundColor: isDarkMode ? '#333' : '#F0F0F0', color: isDarkMode ? '#fff' : '#000' }]}
            placeholderTextColor={isDarkMode ? '#B0B0B0' : '#757575'}
          />
        </View>

        {/* Task list */}
        <FlatList
          data={filteredTasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />

        {/* Floating Action Button for adding new task */}
        <FAB
          style={[styles.fab, { backgroundColor: isDarkMode ? '#BB86FC' : '#6200EE' }]}
          icon="plus"
          onPress={() => router.push('/add-task')}
        />
      </View>

      {/* Animated drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: slideAnim }],
            backgroundColor: isDarkMode ? '#1E1E1E' : '#fff',
          },
        ]}
      >
        <CustomDrawerContent closeDrawer={closeDrawer} />
      </Animated.View>

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
              onLoadComplete={(numberOfPages, filePath) => {
                console.log(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`Current page: ${page}`);
              }}
              onError={(error) => {
                console.log(error);
              }}
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
    paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingTop: 10 + EXTRA_HEADER_PADDING,
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  menuButton: {
    padding: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  listContent: {
    padding: 16,
  },
  taskCard: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
  },
  completedTask: {
    textDecorationLine: 'line-through',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  taskDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDateText: {
    marginLeft: 4,
    fontSize: 12,
  },
  taskPriority: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  taskPriorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    paddingTop: STATUSBAR_HEIGHT,
  },
  deleteAction: {
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
    height: '100%',
    width: 100,
  },
  deleteActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  attachmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  attachmentItem: {
    width: 80,
    height: 80,
    marginRight: 8,
    marginBottom: 8,
  },
  attachmentImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  attachmentFile: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
  },
  attachmentFileName: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
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
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  unsupportedFileText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

