import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ExerciseCard } from '../../components/ExerciseCard';
import { Button } from '../../components/Button';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';
import { saveWorkoutLog, getWorkoutLogs } from '../../utils/storage';
import { Plus, Dumbbell, Save } from 'lucide-react-native';

const MUSCLE_GROUPS = [
  { id: 'back_biceps', label: 'Back / Biceps', icon: '💪' },
  { id: 'chest_triceps', label: 'Chest / Triceps', icon: '🏋️' },
  { id: 'shoulders', label: 'Shoulders', icon: '🎯' },
  { id: 'legs', label: 'Legs', icon: '🦵' },
];

export const WorkoutsScreen = () => {
  const [selectedGroup, setSelectedGroup] = useState('back_biceps');
  const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '', weight: '' }]);
  const [workoutName, setWorkoutName] = useState('');
  const [savedWorkouts, setSavedWorkouts] = useState([]);

  const loadWorkouts = useCallback(async () => {
    const logs = await getWorkoutLogs();
    setSavedWorkouts(logs.slice(-10).reverse());
  }, []);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '', weight: '' }]);
  };

  const handleUpdateExercise = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleDeleteExercise = (index) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index));
    }
  };

  const handleSaveWorkout = async () => {
    const validExercises = exercises.filter(ex => ex.name && ex.sets && ex.reps);
    if (validExercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise with name, sets, and reps');
      return;
    }

    await saveWorkoutLog({
      name: workoutName || `${MUSCLE_GROUPS.find(g => g.id === selectedGroup)?.label} Workout`,
      muscleGroup: selectedGroup,
      exercises: validExercises,
    });

    setExercises([{ name: '', sets: '', reps: '', weight: '' }]);
    setWorkoutName('');
    loadWorkouts();
    Alert.alert('Success', 'Workout saved successfully!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.header}>
          <Text style={styles.title}>Workout Logger</Text>
          <Text style={styles.subtitle}>Log your sets, reps, and weights</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.muscleGroupsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {MUSCLE_GROUPS.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={[
                  styles.muscleGroupCard,
                  selectedGroup === group.id && styles.muscleGroupCardSelected,
                ]}
                onPress={() => setSelectedGroup(group.id)}
              >
                <Text style={styles.muscleGroupIcon}>{group.icon}</Text>
                <Text style={[
                  styles.muscleGroupLabel,
                  selectedGroup === group.id && styles.muscleGroupLabelSelected,
                ]}>
                  {group.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.workoutSection}>
          <TextInput
            style={styles.workoutNameInput}
            value={workoutName}
            onChangeText={setWorkoutName}
            placeholder="Workout name (optional)"
            placeholderTextColor={colors.textSecondary}
          />

          <View style={styles.exercisesContainer}>
            {exercises.map((exercise, index) => (
              <View key={index} style={styles.exerciseInputContainer}>
                <TextInput
                  style={styles.exerciseNameInput}
                  value={exercise.name}
                  onChangeText={(value) => handleUpdateExercise(index, 'name', value)}
                  placeholder={`Exercise ${index + 1} name`}
                  placeholderTextColor={colors.textSecondary}
                />
                <ExerciseCard
                  exercise={exercise}
                  onUpdate={handleUpdateExercise}
                  onDelete={() => handleDeleteExercise(index)}
                  index={index}
                />
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.addExerciseButton} onPress={handleAddExercise}>
            <Plus size={18} color={colors.primary} />
            <Text style={styles.addExerciseText}>Add Exercise</Text>
          </TouchableOpacity>

          <Button 
            title="Save Workout" 
            onPress={handleSaveWorkout}
            icon={Save}
          />
        </Animated.View>

        {savedWorkouts.length > 0 && (
          <Animated.View entering={FadeInDown.delay(800).duration(600)} style={styles.historySection}>
            <Text style={styles.historyTitle}>Recent Workouts</Text>
            {savedWorkouts.slice(0, 5).map((workout, index) => (
              <View key={index} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyName}>{workout.name}</Text>
                  <Text style={styles.historyDate}>
                    {new Date(workout.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.historyExercises}>
                  {workout.exercises?.length || 0} exercises
                </Text>
              </View>
            ))}
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.header,
    fontWeight: 'bold',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    marginTop: spacing.xs,
  },
  muscleGroupsContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  muscleGroupCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginRight: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  muscleGroupCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.pureBlack,
  },
  muscleGroupIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  muscleGroupLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
  },
  muscleGroupLabelSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  workoutSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  workoutNameInput: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.body,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  exercisesContainer: {
    marginBottom: spacing.md,
  },
  exerciseInputContainer: {
    marginBottom: spacing.sm,
  },
  exerciseNameInput: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.body,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pureBlack,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  addExerciseText: {
    color: colors.primary,
    fontSize: fontSize.body,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  historySection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  historyTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.subheader,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  historyCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  historyName: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
  historyDate: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
  },
  historyExercises: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
  },
});