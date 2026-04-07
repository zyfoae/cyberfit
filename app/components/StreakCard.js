import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';
import { Flame, Droplets, Dumbbell } from 'lucide-react-native';

export const StreakCard = ({ streaks }) => {
  const {
    currentStreak = 0,
    workoutStreak = 0,
    totalDays = 0,
  } = streaks;

  return (
    <Animated.View entering={FadeInDown.delay(800).duration(600)} style={styles.container}>
      <View style={styles.header}>
        <Flame size={20} color={colors.primary} />
        <Text style={styles.title}>Your Streaks</Text>
      </View>

      <View style={styles.streaksRow}>
        <View style={styles.streakItem}>
          <View style={styles.streakIcon}>
            <Text style={styles.streakEmoji}>🔥</Text>
          </View>
          <Text style={styles.streakValue}>{currentStreak}</Text>
          <Text style={styles.streakLabel}>Day Streak</Text>
        </View>

        <View style={styles.streakItem}>
          <View style={styles.streakIcon}>
            <Dumbbell size={18} color={colors.primary} />
          </View>
          <Text style={styles.streakValue}>{workoutStreak}</Text>
          <Text style={styles.streakLabel}>Workouts</Text>
        </View>

        <View style={styles.streakItem}>
          <View style={styles.streakIcon}>
            <Droplets size={18} color={colors.primary} />
          </View>
          <Text style={styles.streakValue}>{totalDays}</Text>
          <Text style={styles.streakLabel}>Total Days</Text>
        </View>
      </View>

      {currentStreak >= 7 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🎉 {currentStreak} Day Streak!</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.subheader,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  streaksRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  streakItem: {
    alignItems: 'center',
  },
  streakIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.pureBlack,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  streakEmoji: {
    fontSize: 20,
  },
  streakValue: {
    color: colors.primary,
    fontSize: fontSize.title,
    fontWeight: 'bold',
  },
  streakLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    marginTop: 2,
  },
  badge: {
    backgroundColor: colors.pureBlack,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  badgeText: {
    color: colors.primary,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
});