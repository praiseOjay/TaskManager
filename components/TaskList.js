// components/TaskList.js
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { List, IconButton, useTheme, Menu, Divider, Searchbar } from 'react-native-paper';
import { useTaskContext } from '../context/TaskContext';
import { useRouter } from 'expo-router';

export default function TaskList() {
  const { tasks, toggleTask, deleteTask, sortBy, setSortBy, filterBy, setFilterBy, searchQuery, setSearchQuery } = useTaskContext();
  const router = useRouter();
  const theme = useTheme();

  const [sortMenuVisible, setSortMenuVisible] = React.useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = React.useState(false);

  const renderItem = ({ item }) => (
    <List.Item
      title={item.title}
      description={item.description}
      left={props => (
        <IconButton
          icon={item.completed ? 'check-circle' : 'circle-outline'}
          onPress={() => toggleTask(item.id)}
          {...props}
        />
      )}
      right={props => (
        <View style={{ flexDirection: 'row' }}>
          <IconButton
            icon="pencil"
            onPress={() => router.push(`/edit-task/${item.id}`)}
            {...props}
          />
          <IconButton
            icon="delete"
            onPress={() => deleteTask(item.id)}
            {...props}
          />
        </View>
      )}
      onPress={() => router.push(`/task-details/${item.id}`)}
    />
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search tasks"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      <View style={styles.menuContainer}>
        <Menu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={
            <IconButton icon="sort" onPress={() => setSortMenuVisible(true)} />
          }
        >
          <Menu.Item onPress={() => { setSortBy('priority'); setSortMenuVisible(false); }} title="Sort by Priority" />
          <Menu.Item onPress={() => { setSortBy('dueDate'); setSortMenuVisible(false); }} title="Sort by Due Date" />
        </Menu>
        <Menu
          visible={filterMenuVisible}
          onDismiss={() => setFilterMenuVisible(false)}
          anchor={
            <IconButton icon="filter" onPress={() => setFilterMenuVisible(true)} />
          }
        >
          <Menu.Item onPress={() => { setFilterBy('all'); setFilterMenuVisible(false); }} title="All Tasks" />
          <Menu.Item onPress={() => { setFilterBy('active'); setFilterMenuVisible(false); }} title="Active Tasks" />
          <Menu.Item onPress={() => { setFilterBy('completed'); setFilterMenuVisible(false); }} title="Completed Tasks" />
          <Divider />
          <Menu.Item onPress={() => { setFilterBy('Work'); setFilterMenuVisible(false); }} title="Work Tasks" />
          <Menu.Item onPress={() => { setFilterBy('Personal'); setFilterMenuVisible(false); }} title="Personal Tasks" />
        </Menu>
      </View>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 16,
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 16,
  },
  list: {
    flex: 1,
  },
});
