// [id].js

// Import necessary React and React Native components
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform, Image, Dimensions, Modal, TouchableOpacity } from 'react-native';
import { TextInput, Button, Appbar, Text, IconButton } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTaskContext } from '../../context/TaskContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PDFReader from 'react-native-view-pdf';

// Get screen dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Main component for editing a task
export default function EditTaskScreen() {
  // Initialize router and get task ID from URL params
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Access task context for managing tasks and app theme
  const { tasks, updateTask, deleteTask, isDarkMode } = useTaskContext();

  // State variables for managing task data and UI elements
  const [task, setTask] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  // Handler for attachment press
  const handleAttachmentPress = (attachment) => {
    setSelectedAttachment(attachment);
  };

  // Handler for closing attachment viewer
  const closeAttachmentViewer = () => {
    setSelectedAttachment(null);
  };

  // Function to pick a document
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (result.type === 'success') {
        setTask({
          ...task,
          attachments: [...task.attachments, { type: 'file', uri: result.uri, name: result.name }],
        });
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  // Function to pick an image
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setTask({
          ...task,
          attachments: [...task.attachments, { type: 'image', uri: result.assets[0].uri }],
        });
      }
    } catch (err) {
      console.error('Error picking image:', err);
    }
  };

  // Function to remove an attachment
  const removeAttachment = (index) => {
    const newAttachments = [...task.attachments];
    newAttachments.splice(index, 1);
    setTask({ ...task, attachments: newAttachments });
  };

  // Effect to load task data when component mounts or ID changes
  useEffect(() => {
    const foundTask = tasks.find((t) => t.id === id);
    if (foundTask) {
      setTask(foundTask);
    }
  }, [id, tasks]);

  // Handler for updating the task
  const handleUpdateTask = () => {
    updateTask(task);
    router.back();
  };

  // Handler for deleting the task
  const handleDeleteTask = () => {
    deleteTask(task.id);
    router.back();
  };

  // Handler for date change
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDueDate = new Date(selectedDate);
      const oldDueDate = new Date(task.dueDate);
      newDueDate.setHours(oldDueDate.getHours());
      newDueDate.setMinutes(oldDueDate.getMinutes());
      setTask({ ...task, dueDate: newDueDate.toISOString() });
      if (Platform.OS === 'android') {
        setShowTimePicker(true);
      }
    }
  };

  // Handler for time change
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDueDate = new Date(task.dueDate);
      newDueDate.setHours(selectedTime.getHours());
      newDueDate.setMinutes(selectedTime.getMinutes());
      setTask({ ...task, dueDate: newDueDate.toISOString() });
    }
  };

  // Return null if task is not loaded yet
  if (!task) {
    return null;
  }

  // Apply dark mode styles if enabled
  const containerStyle = {
    ...styles.container,
    backgroundColor: isDarkMode ? '#121212' : '#fff',
  };

  const textStyle = {
    color: isDarkMode ? '#fff' : '#000',
  };

  // Render the EditTaskScreen component
  return (
    <View style={containerStyle}>
      {/* App header */}
      <Appbar.Header style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }}>
        <Appbar.BackAction onPress={() => router.back()} color={isDarkMode ? '#fff' : '#000'} />
        <Appbar.Content title="Edit Task" titleStyle={textStyle} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Task title input */}
        <TextInput
          label="Title"
          value={task.title}
          onChangeText={(text) => setTask({ ...task, title: text })}
          style={styles.input}
          theme={{ colors: { text: isDarkMode ? '#fff' : '#000' } }}
        />

        {/* Task description input */}
        <TextInput
          label="Description"
          value={task.description}
          onChangeText={(text) => setTask({ ...task, description: text })}
          multiline
          style={styles.input}
          theme={{ colors: { text: isDarkMode ? '#fff' : '#000' } }}
        />

        {/* Due date button */}
        <Button
          onPress={() => setShowDatePicker(true)}
          mode="outlined"
          style={styles.dateButton}
        >
          {new Date(task.dueDate).toLocaleString()}
        </Button>

        {/* Date picker */}
        {showDatePicker && (
          <DateTimePicker
            value={new Date(task.dueDate)}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Time picker */}
        {showTimePicker && (
          <DateTimePicker
            value={new Date(task.dueDate)}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}

        {/* Priority picker */}
        <View style={styles.pickerContainer}>
          <Text style={[styles.pickerLabel, textStyle]}>Priority</Text>
          <Picker
            selectedValue={task.priority}
            onValueChange={(itemValue) => setTask({ ...task, priority: itemValue })}
            style={[styles.picker, { color: isDarkMode ? '#fff' : '#000' }]}
            dropdownIconColor={isDarkMode ? '#fff' : '#000'}
          >
            <Picker.Item label="High" value="High" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="Low" value="Low" />
          </Picker>
        </View>

        {/* Category picker */}
        <View style={styles.pickerContainer}>
          <Text style={[styles.pickerLabel, textStyle]}>Category</Text>
          <Picker
            selectedValue={task.category}
            onValueChange={(itemValue) => setTask({ ...task, category: itemValue })}
            style={[styles.picker, { color: isDarkMode ? '#fff' : '#000' }]}
            dropdownIconColor={isDarkMode ? '#fff' : '#000'}
          >
            <Picker.Item label="Personal" value="Personal" />
            <Picker.Item label="Work" value="Work" />
            <Picker.Item label="Shopping" value="Shopping" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        {/* Attachment buttons */}
        <View style={styles.attachmentButtons}>
          <Button mode="outlined" onPress={pickDocument} style={styles.attachmentButton}>
            Attach File
          </Button>
          <Button mode="outlined" onPress={pickImage} style={styles.attachmentButton}>
            Attach Image
          </Button>
        </View>

        {/* Attachment preview */}
        <ScrollView horizontal style={styles.attachmentPreview}>
          {task.attachments.map((attachment, index) => (
            <View key={index} style={styles.attachmentItem}>
              <TouchableOpacity onPress={() => handleAttachmentPress(attachment)}>
                {attachment.type === 'image' ? (
                  <Image source={{ uri: attachment.uri }} style={styles.attachmentImage} />
                ) : (
                  <View style={styles.fileIcon}>
                    <MaterialCommunityIcons name="file-document-outline" size={24} color={isDarkMode ? '#fff' : '#000'} />
                  </View>
                )}
              </TouchableOpacity>
              <IconButton
                icon="close"
                size={16}
                onPress={() => removeAttachment(index)}
                style={styles.removeAttachmentButton}
              />
            </View>
          ))}
        </ScrollView>

        {/* Update and Delete buttons */}
        <Button mode="contained" onPress={handleUpdateTask} style={styles.updateButton}>
          Update Task
        </Button>
        <Button mode="outlined" onPress={handleDeleteTask} style={styles.deleteButton}>
          Delete Task
        </Button>
      </ScrollView>

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
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  dateButton: {
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  updateButton: {
    marginTop: 16,
  },
  deleteButton: {
    marginTop: 8,
  },
  attachmentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  attachmentButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  attachmentPreview: {
    marginBottom: 16,
  },
  attachmentItem: {
    marginRight: 12,
    alignItems: 'center',
    width: 60,
  },
  attachmentImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  fileIcon: {
    width: 50,
    height: 50,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentName: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    width: 60,
  },
  removeAttachmentButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.5)',
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