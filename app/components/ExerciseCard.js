import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Trash2, Plus } from 'lucide-react-native';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const ExerciseCard = ({ exercise, onUpdate, onDelete, index }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.header}>
        <Text style={styles.exerciseName}>{exercise.name || `Exercise ${index + 1}`}</Text>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Trash2 size={18} color={colors.warning} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputsRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Sets</Text>
          <TextInput
            style={styles.input}
            value={exercise.sets?.toString() || ''}
            onChangeText={(text) => onUpdate(index, 'sets', text)}
            placeholder="0"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Reps</Text>
          <TextInput
            style={styles.input}
            value={exercise.reps?.toString() || ''}
            onChangeText={(text) => onUpdate(index, 'reps', text)}
            placeholder="0"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={exercise.weight?.toString() || ''}
            onChangeText={(text) => onUpdate(index, 'weight', text)}
            placeholder="0"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  exerciseName: {
    color: colors.textPrimary,
    fontSize: fontSize.subheader,
    fontWeight: '600',
  },
  deleteButton: {
    padding: spacing.xs,
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  inputLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.pureBlack,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    color: colors.textPrimary,
    fontSize: fontSize.body,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
});