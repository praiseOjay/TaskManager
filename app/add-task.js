import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Platform, Image, Dimensions, Modal } from 'react-native';
import { TextInput, Button, Appbar, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTaskContext } from '../context/TaskContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PDFReader from 'react-native-view-pdf';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function AddTaskScreen() {
  const router = useRouter();
  const { addTask, isDarkMode } = useTaskContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Personal');
  const [attachments, setAttachments] = useState([]);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (result.type === 'success') {
      setAttachments([...attachments, { type: 'file', uri: result.uri, name: result.name }]);
    }
  };

  const handleAttachmentPress = (attachment) => {
    setSelectedAttachment(attachment);
  };

  const closeAttachmentViewer = () => {
    setSelectedAttachment(null);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setAttachments([...attachments, { type: 'image', uri: result.assets[0].uri }]);
      }
    } catch (err) {
      console.error('Error picking image:', err);
    }
  };

  const handleAddTask = () => {
    addTask({ title, description, dueDate, priority, category, attachments });
    router.back();
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
      if (Platform.OS === 'android') {
        setShowTimePicker(true);
      }
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDueDate = new Date(dueDate);
      newDueDate.setHours(selectedTime.getHours());
      newDueDate.setMinutes(selectedTime.getMinutes());
      setDueDate(newDueDate);
    }
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
        <Appbar.Content title="Add Task" titleStyle={textStyle} />
      </Appbar.Header>
      <ScrollView style={styles.content}>
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          theme={{ colors: { text: isDarkMode ? '#fff' : '#000' } }}
        />
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          style={styles.input}
          theme={{ colors: { text: isDarkMode ? '#fff' : '#000' } }}
        />
        <Button onPress={() => setShowDatePicker(true)} mode="outlined" style={styles.dateButton}>
          {dueDate.toLocaleString()}
        </Button>
        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={dueDate}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
        <View style={styles.pickerContainer}>
          <Text style={[styles.pickerLabel, textStyle]}>Priority</Text>
          <Picker
            selectedValue={priority}
            onValueChange={(itemValue) => setPriority(itemValue)}
            style={[styles.picker, { color: isDarkMode ? '#fff' : '#000' }]}
            dropdownIconColor={isDarkMode ? '#fff' : '#000'}
          >
            <Picker.Item label="High" value="High" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="Low" value="Low" />
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Text style={[styles.pickerLabel, textStyle]}>Category</Text>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={[styles.picker, { color: isDarkMode ? '#fff' : '#000' }]}
            dropdownIconColor={isDarkMode ? '#fff' : '#000'}
          >
            <Picker.Item label="Personal" value="Personal" />
            <Picker.Item label="Work" value="Work" />
            <Picker.Item label="Shopping" value="Shopping" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
        <View style={styles.attachmentsContainer}>
          <Button onPress={pickImage} mode="outlined" style={styles.attachButton}>
            Attach Image
          </Button>
          <Button onPress={pickDocument} mode="outlined" style={styles.attachButton}>
            Attach File
          </Button>
        </View>
        <View horizontal style={styles.attachmentsList}>
          {attachments.map((attachment, index) => (
            <TouchableOpacity
              key={index}
              style={styles.attachmentItem}
              onPress={() => handleAttachmentPress(attachment)}
            >
              {attachment.type === 'image' ? (
                <Image source={{ uri: attachment.uri }} style={styles.attachmentImage} />
              ) : (
                <View style={styles.attachmentFile}>
                  <MaterialCommunityIcons name="file-document-outline" size={24} color="#757575" />
                  <Text numberOfLines={1} style={styles.attachmentFileName}>{attachment.name}</Text>
                </View>
              )}
              <TouchableOpacity onPress={() => {
                setAttachments(attachments.filter((_, i) => i !== index));
              }}>
                <MaterialCommunityIcons name="close" size={20} color="#757575" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
        <Button mode="contained" onPress={handleAddTask} style={styles.addButton}>
          Add Task
        </Button>
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
      </ScrollView>
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
  addButton: {
    marginTop: 16,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  attachButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  attachmentsList: {
    marginBottom: 16,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  attachmentImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 8,
  },
  attachmentFile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    padding: 4,
    marginRight: 8,
  },
  attachmentFileName: {
    marginLeft: 4,
    fontSize: 12,
    maxWidth: 100,
  },
});
