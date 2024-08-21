// context/TaskContext.js

// Import necessary React hooks and functions, and AsyncStorage for persistent storage
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a new context for task management
const TaskContext = createContext();

// Custom hook to easily access task context in other components
export const useTaskContext = () => useContext(TaskContext);

// Helper function to safely parse date strings
const safeParse = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

// TaskProvider component to wrap the app and provide task management functionality
export const TaskProvider = ({ children }) => {
  // State variables for tasks, sorting, filtering, and dark mode
  const [tasks, setTasks] = useState([]);
  const [sortBy, setSortBy] = useState('All');
  const [filterBy, setFilterBy] = useState('All');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load tasks and dark mode preference when the component mounts
  useEffect(() => {
    loadTasks();
    loadDarkMode();
  }, []);

  // Function to load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        const safeTasksWithDates = parsedTasks.map(task => ({
          ...task,
          createdAt: safeParse(task.createdAt),
          dueDate: safeParse(task.dueDate),
          attachments: task.attachments || [] // Ensure attachments property exists
        }));
        setTasks(safeTasksWithDates);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  // Function to load dark mode preference from AsyncStorage
  const loadDarkMode = async () => {
    try {
      const darkMode = await AsyncStorage.getItem('darkMode');
      setIsDarkMode(darkMode === 'true');
    } catch (error) {
      console.error('Error loading dark mode:', error);
    }
  };

  // Function to save tasks to AsyncStorage
  const saveTasks = async (updatedTasks) => {
    try {
      const tasksToSave = updatedTasks.map(task => ({
        ...task,
        createdAt: task.createdAt ? task.createdAt.toISOString() : null,
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
        attachments: task.attachments || [] // Ensure attachments property exists when saving
      }));
      await AsyncStorage.setItem('tasks', JSON.stringify(tasksToSave));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  // Function to add a new task
  const addTask = (newTask) => {
    const taskWithSafeDates = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date(),
      dueDate: safeParse(newTask.dueDate),
      attachments: newTask.attachments.map(attachment => ({
        type: attachment.type,
        uri: attachment.uri,
        name: attachment.name || 'Unnamed file'
      })),
    };
    const updatedTasks = [...tasks, taskWithSafeDates];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Function to update an existing task
  const updateTask = (updatedTask) => {
    const taskWithSafeDates = {
      ...updatedTask,
      dueDate: safeParse(updatedTask.dueDate),
      attachments: updatedTask.attachments.map(attachment => ({
        type: attachment.type,
        uri: attachment.uri,
        name: attachment.name || 'Unnamed file'
      })),
    };
    const updatedTasks = tasks.map((task) =>
      task.id === taskWithSafeDates.id ? taskWithSafeDates : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Function to delete a task
  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Function to toggle task completion status
  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Function to clear all tasks
  const clearAllTasks = () => {
    setTasks([]);
    saveTasks([]);
  };

  // Function to toggle dark mode and save preference
  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    try {
      await AsyncStorage.setItem('darkMode', newDarkMode.toString());
    } catch (error) {
      console.error('Error saving dark mode:', error);
    }
  };

  // Function to sort tasks based on priority
  const sortTasks = (tasksToSort) => {
    if (sortBy === 'All') return tasksToSort;

    return [...tasksToSort].sort((a, b) => {
      if (sortBy === 'High' || sortBy === 'Medium' || sortBy === 'Low') {
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        if (a.priority === sortBy && b.priority !== sortBy) return -1;
        if (a.priority !== sortBy && b.priority === sortBy) return 1;
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });
  };

  // Function to filter tasks based on category
  const filterTasks = (tasksToFilter) => {
    if (filterBy === 'All') return tasksToFilter;

    return tasksToFilter.filter(task => task.category === filterBy);
  };

  // Function to get filtered and sorted tasks
  const getFilteredAndSortedTasks = () => {
    return sortTasks(filterTasks(tasks));
  };

  // Provide task management functions and state to child components
  return (
    <TaskContext.Provider value={{
      tasks: getFilteredAndSortedTasks(),
      addTask,
      updateTask,
      deleteTask,
      toggleTaskCompletion,
      sortBy,
      setSortBy,
      filterBy,
      setFilterBy,
      clearAllTasks,
      isDarkMode,
      toggleDarkMode
    }}>
      {children}
    </TaskContext.Provider>
  );
};
