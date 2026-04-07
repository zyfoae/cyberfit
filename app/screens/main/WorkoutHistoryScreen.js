import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';
import { getWorkoutLogs } from '../../utils/storage';
import { Dumbbell, Calendar, Clock, ChevronRight } from 'lucide-react-native';

export const WorkoutHistoryScreen = () => {
  const [workouts, setWorkouts] = useState([]);
  const [groupBy, setGroupBy] = useState('date');

  const loadWorkouts = useCallback(async () => {
    const logs = await getWorkoutLogs();
    const sortedLogs = logs.sort((a, b) => new Date(b.date) - new Date(a.date));
    setWorkouts(sortedLogs);
  }, []);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  const groupWorkoutsByDate = () => {
    const grouped = {};
    
    workouts.forEach(workout => {
      const dateKey = new Date(workout.date).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(workout);
    });
    
    return Object.entries(grouped).map(([date, items]) => ({
      date,
      displayDate: formatDate(items[0].date),
      workouts: items,
    }));
  };

  const renderWorkoutItem = (workout) => (
    <View key={workout.date} style={styles.workoutItem}>
      <View style={styles.workoutHeader}>
        <View style={styles.workoutIcon}>
          <Dumbbell size={18} color={colors.primary} />
        </View>
        <View style={styles.workoutInfo}>
          <Text style={styles.workoutName}>{workout.name || 'Workout'}</Text>
          <Text style={styles.workoutTime}>{formatTime(workout.date)}</Text>
        </View>
        <ChevronRight size={20} color={colors.textSecondary} />
      </View>
      
      <View style={styles.exercisesList}>
        {workout.exercises?.map((exercise, index) => (
          <View key={index} style={styles.exerciseRow}>
            <Text style={styles.exerciseName}>{exercise.name || `Exercise ${index + 1}`}</Text>
            <Text style={styles.exerciseDetails}>
              {exercise.sets} sets × {exercise.reps} reps × {exercise.weight}kg
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const groupedData = groupWorkoutsByDate();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Workout History</Text>
          <Text style={styles.subtitle}>{workouts.length} total workouts</Text>
        </View>

        {workouts.length === 0 ? (
          <View style={styles.emptyState}>
            <Dumbbell size={48} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Workouts Yet</Text>
            <Text style={styles.emptyText}>
              Complete your first workout to see it here
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {groupedData.map((group) => (
              <View key={group.date} style={styles.dateGroup}>
                <View style={styles.dateHeader}>
                  <Calendar size={16} color={colors.primary} />
                  <Text style={styles.dateText}>{group.displayDate}</Text>
                  <Text style={styles.workoutCount}>{group.workouts.length} workout(s)</Text>
                </View>
                
                {group.workouts.map(renderWorkoutItem)}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.subheader,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  dateGroup: {
    marginBottom: spacing.lg,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dateText: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: '600',
    marginLeft: spacing.sm,
    flex: 1,
  },
  workoutCount: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
  },
  workoutItem: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.pureBlack,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  workoutName: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
  workoutTime: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    marginTop: 2,
  },
  exercisesList: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  exerciseName: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
  },
  exerciseDetails: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
  },
});