import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { obtenirTaches } from '../src/api';
import { Task, RootStackParamList } from '../src/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Déclaration des props pour la navigation et la route
type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'TaskList'>;
  route: RouteProp<RootStackParamList, 'TaskList'>;
};

const TaskListScreen: React.FC<Props> = ({ route, navigation }) => {
  const { userId } = route.params;
  const [taches, setTaches] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTaches = async () => {
      try {
        const data = await obtenirTaches(userId);
        setTaches(data.tasks);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTaches();
  }, [userId]);

  const handleTachePress = (tache: Task) => {
    navigation.navigate('TaskDetail', { task: tache });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Tâches</Text>
      <FlatList
        data={taches}
        keyExtractor={(item) => item.taskId}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDescription}>{item.description}</Text>
            <Text style={styles.taskDate}>{item.date}</Text>
            <Text style={styles.taskStatus}>
              État: {item.isDone ? 'Terminée' : 'En cours'}
            </Text>
            <Button title="Voir" onPress={() => handleTachePress(item)} />
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
      <Button title="Ajouter une tâche" onPress={() => navigation.navigate('AddTask', { userId })} />
    </View>
  );
};

// Application des styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#E6E6FA',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: '#9370DB',
  },
  taskItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    flexDirection: 'column', // Changer à 'column' pour empiler les éléments
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 14,
    color: '#555',
  },
  taskDate: {
    fontSize: 12,
    color: '#888',
  },
  taskStatus: {
    fontSize: 12,
    color: '#007BFF', // Couleur pour le statut
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default TaskListScreen;
