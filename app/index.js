// app/index.js
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

const DRAWER_WIDTH = Dimensions.get('window').width * 0.8;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const EXTRA_HEADER_PADDING = 20;
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function IndexScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { tasks, toggleTaskCompletion, deleteTask, isDarkMode } = useTaskContext();
  const router = useRouter();
  const { isDrawerOpen, toggleDrawer, closeDrawer } = useDrawer();
  const [slideAnim] = useState(new Animated.Value(-DRAWER_WIDTH));
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isDrawerOpen ? 0 : -DRAWER_WIDTH,
      duration: 50,
      useNativeDriver: false,
    }).start();
  }, [isDrawerOpen]);

  const handleAttachmentPress = (attachment) => {
    setSelectedAttachment(attachment);
  };

  const closeAttachmentViewer = () => {
    setSelectedAttachment(null);
  };

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

  const renderItem = ({ item }) => (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item)
      }
    >
      <TouchableOpacity onPress={() => router.push(`/edit-task/${item.id}`)}>
        <Card style={[styles.taskCard, { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }]}>
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

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return '#FF5252';
      case 'medium': return '#FFC107';
      case 'low': return '#4CAF50';
      default: return '#757575';
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.container}>
        <View style={[styles.header, { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }]}>
          <TouchableOpacity onPress={toggleDrawer}>
            <MaterialCommunityIcons name="menu" size={24} color={isDarkMode ? '#fff' : '#333'} />
          </TouchableOpacity>
          <TextInput
            placeholder="Search tasks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: isDarkMode ? '#fff' : '#333' }]}
            placeholderTextColor={isDarkMode ? '#B0B0B0' : '#757575'}
          />
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialCommunityIcons name="close" size={24} color={isDarkMode ? '#fff' : '#333'} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredTasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.taskList}
        />
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => router.push('/add-task')}
          color={isDarkMode ? '#fff' : '#fff'}
          backgroundColor={isDarkMode ? '#8e44ad' : '#8e44ad'}
        />
      </View>
      <Animated.View style={[styles.drawer, { left: slideAnim, backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }]}>
        <CustomDrawerContent isDarkMode={isDarkMode} />
      </Animated.View>
      {isDrawerOpen && (
        <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} activeOpacity={1} />
      )}
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
  searchInput: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: 'transparent',
  },
  taskList: {
    padding: 16,
  },
  taskCard: {
    marginBottom: 16,
    borderRadius: 8,
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
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
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

