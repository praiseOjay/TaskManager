// context/TaskContext.js

// Import necessary React hooks and functions, and AsyncStorage for persistent storage
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a new context for task management
const TaskContext = createContext();

// Custom hook to easily access task context in other components
export const useTaskContext = () => useContext(TaskContext);

// Helper function to safely parse date inputs (string, Date object, or null)
const safeParse = (dateInput) => {
  if (!dateInput) return null;
  if (dateInput instanceof Date) {
    return isNaN(dateInput.getTime()) ? null : dateInput;
  }
  const date = new Date(dateInput);
  return isNaN(date.getTime()) ? null : date;
};

// Initial default dummy tasks for new app sessions
const INITIAL_DUMMY_TASKS = [
  {
    id: '1',
    title: 'Complete Project Presentation',
    description: 'Prepare the slides and review key architectural updates with the team.',
    completed: false,
    priority: 'High',
    category: 'Work',
    createdAt: new Date(),
    dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
    attachments: [],
  },
  {
    id: '2',
    title: 'Review Code Pull Requests',
    description: 'Perform thorough code review for backend feature branches and test API endpoints.',
    completed: false,
    priority: 'High',
    category: 'Work',
    createdAt: new Date(),
    dueDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
    attachments: [],
  },
  {
    id: '3',
    title: 'Buy Grocery Items',
    description: 'Pick up milk, fresh fruits, vegetables, and whole grain bread.',
    completed: false,
    priority: 'Medium',
    category: 'Shopping',
    createdAt: new Date(),
    dueDate: new Date(Date.now() + 86400000), // 1 day from now
    attachments: [],
  },
  {
    id: '4',
    title: 'Order Essential Household Supplies',
    description: 'Restock kitchen paper towels, laundry detergent, dish soap, and coffee beans.',
    completed: false,
    priority: 'Low',
    category: 'Shopping',
    createdAt: new Date(),
    dueDate: new Date(Date.now() + 86400000 * 4), // 4 days from now
    attachments: [],
  },
  {
    id: '5',
    title: 'Schedule Annual Dental Checkup',
    description: 'Call dentist clinic to book routine inspection and teeth cleaning appointment.',
    completed: false,
    priority: 'High',
    category: 'Personal',
    createdAt: new Date(),
    dueDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
    attachments: [],
  },
  {
    id: '6',
    title: 'Morning Workout & Gym',
    description: '30-minute cardio session followed by core strength training.',
    completed: true,
    priority: 'Low',
    category: 'Personal',
    createdAt: new Date(),
    dueDate: new Date(),
    attachments: [],
  },
  {
    id: '7',
    title: 'Read System Design Chapter 4',
    description: 'Finish reading Chapter 4 on Distributed Caching and Database Sharding strategies.',
    completed: true,
    priority: 'Medium',
    category: 'Other',
    createdAt: new Date(),
    dueDate: new Date(),
    attachments: [],
  },
  {
    id: '8',
    title: 'Plan Weekend Getaway',
    description: 'Research eco-resort accommodations and nearby scenic hiking trails.',
    completed: false,
    priority: 'Low',
    category: 'Personal',
    createdAt: new Date(),
    dueDate: new Date(Date.now() + 86400000 * 7), // 7 days from now
    attachments: [],
  },
];

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
        if (parsedTasks.length > 0) {
          const safeTasksWithDates = parsedTasks.map(task => ({
            ...task,
            createdAt: safeParse(task.createdAt),
            dueDate: safeParse(task.dueDate),
            attachments: Array.isArray(task.attachments) ? task.attachments : []
          }));
          setTasks(safeTasksWithDates);
          return;
        }
      }
      // If no stored tasks exist, load initial dummy tasks
      setTasks(INITIAL_DUMMY_TASKS);
      saveTasks(INITIAL_DUMMY_TASKS);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks(INITIAL_DUMMY_TASKS);
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
      const tasksToSave = updatedTasks.map(task => {
        const parsedCreated = safeParse(task.createdAt);
        const parsedDue = safeParse(task.dueDate);
        return {
          ...task,
          createdAt: parsedCreated ? parsedCreated.toISOString() : null,
          dueDate: parsedDue ? parsedDue.toISOString() : null,
          attachments: Array.isArray(task.attachments) ? task.attachments : []
        };
      });
      await AsyncStorage.setItem('tasks', JSON.stringify(tasksToSave));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  // Function to add a new task
  const addTask = (newTask) => {
    const rawAttachments = Array.isArray(newTask.attachments) ? newTask.attachments : [];
    const taskWithSafeDates = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date(),
      dueDate: safeParse(newTask.dueDate),
      attachments: rawAttachments.map(attachment => ({
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
    const rawAttachments = Array.isArray(updatedTask.attachments) ? updatedTask.attachments : [];
    const taskWithSafeDates = {
      ...updatedTask,
      dueDate: safeParse(updatedTask.dueDate),
      attachments: rawAttachments.map(attachment => ({
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

  // Function to reset tasks to initial default dummy tasks
  const resetDefaultTasks = () => {
    setTasks(INITIAL_DUMMY_TASKS);
    saveTasks(INITIAL_DUMMY_TASKS);
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
      resetDefaultTasks,
      isDarkMode,
      toggleDarkMode
    }}>
      {children}
    </TaskContext.Provider>
  );
};
