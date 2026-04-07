import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';
import { getFoodLogs, getWaterLogs, getWorkoutLogs, getWeightHistory } from '../utils/storage';
import { TrendingUp, TrendingDown, Minus, Dumbbell, Droplets, Scale, Flame } from 'lucide-react-native';

export const WeeklySummaryCard = () => {
  const [summary, setSummary] = useState({
    avgCalories: 0,
    avgWater: 0,
    workouts: 0,
    weightChange: 0,
    calorieTrend: 'stable',
    waterTrend: 'stable',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWeeklySummary();
  }, []);

  const loadWeeklySummary = async () => {
    try {
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const foodLogs = await getFoodLogs();
      const waterLogs = await getWaterLogs();
      const workoutLogs = await getWorkoutLogs();
      const weightHistory = await getWeightHistory();

      const thisWeekFood = foodLogs.filter(log => new Date(log.date) >= weekAgo);
      const thisWeekWater = waterLogs.filter(log => new Date(log.date) >= weekAgo);
      const thisWeekWorkouts = workoutLogs.filter(log => new Date(log.date) >= weekAgo);

      const avgCalories = thisWeekFood.length > 0 
        ? Math.round(thisWeekFood.reduce((sum, log) => sum + (log.calories || 0), 0) / 7)
        : 0;

      const avgWater = thisWeekWater.length > 0
        ? Math.round(thisWeekWater.reduce((sum, log) => sum + log.amount, 0) / 7)
        : 0;

      const workouts = thisWeekWorkouts.length;

      let weightChange = 0;
      if (weightHistory.length >= 2) {
        const sortedWeights = [...weightHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
        const oldest = sortedWeights[0].weight;
        const latest = sortedWeights[sortedWeights.length - 1].weight;
        weightChange = Math.round((latest - oldest) * 10) / 10;
      }

      const calorieTrend = avgCalories > 2000 ? 'up' : avgCalories < 1500 ? 'down' : 'stable';
      const waterTrend = avgWater > 2000 ? 'up' : avgWater < 1500 ? 'down' : 'stable';

      setSummary({
        avgCalories,
        avgWater,
        workouts,
        weightChange,
        calorieTrend,
        waterTrend,
      });
    } catch (error) {
      console.error('Error loading weekly summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} color={colors.success} />;
      case 'down':
        return <TrendingDown size={16} color={colors.warning} />;
      default:
        return <Minus size={16} color={colors.textSecondary} />;
    }
  };

  const getTrendText = (trend, current) => {
    switch (trend) {
      case 'up':
        return `+${current} avg`;
      case 'down':
        return `${current} avg`;
      default:
        return `${current} avg`;
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>This Week</Text>
        <Text style={styles.subtitle}>Your fitness summary</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Flame size={18} color={colors.primary} />
          </View>
          <Text style={styles.statValue}>{summary.avgCalories}</Text>
          <Text style={styles.statLabel}>Avg Calories</Text>
          {getTrendIcon(summary.calorieTrend)}
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Droplets size={18} color={colors.primary} />
          </View>
          <Text style={styles.statValue}>{Math.round(summary.avgWater / 1000 * 10) / 10}L</Text>
          <Text style={styles.statLabel}>Avg Water</Text>
          {getTrendIcon(summary.waterTrend)}
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Dumbbell size={18} color={colors.primary} />
          </View>
          <Text style={styles.statValue}>{summary.workouts}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Scale size={18} color={colors.primary} />
          </View>
          <Text style={[
            styles.statValue,
            summary.weightChange > 0 && styles.statValueUp,
            summary.weightChange < 0 && styles.statValueDown,
          ]}>
            {summary.weightChange > 0 ? '+' : ''}{summary.weightChange}kg
          </Text>
          <Text style={styles.statLabel}>Weight Change</Text>
        </View>
      </View>

      <View style={styles.insights}>
        <Text style={styles.insightsTitle}>Insights</Text>
        
        {summary.workouts >= 5 && (
          <View style={styles.insightItem}>
            <Text style={styles.insightEmoji}>🎯</Text>
            <Text style={styles.insightText}>
              Great job! You've completed {summary.workouts} workouts this week.
            </Text>
          </View>
        )}
        
        {summary.avgWater >= 2000 && (
          <View style={styles.insightItem}>
            <Text style={styles.insightEmoji}>💧</Text>
            <Text style={styles.insightText}>
              You're staying well hydrated with an average of {Math.round(summary.avgWater / 1000)}L daily.
            </Text>
          </View>
        )}
        
        {summary.workouts < 3 && summary.workouts > 0 && (
          <View style={styles.insightItem}>
            <Text style={styles.insightEmoji}>💪</Text>
            <Text style={styles.insightText}>
              Try to aim for at least 3-4 workouts per week for optimal results.
            </Text>
          </View>
        )}
        
        {summary.workouts === 0 && (
          <View style={styles.insightItem}>
            <Text style={styles.insightEmoji}>🏃</Text>
            <Text style={styles.insightText}>
              Start your fitness journey! Log your first workout of the week.
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.subheader,
    fontWeight: 'bold',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.pureBlack,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: fontSize.subheader,
    fontWeight: 'bold',
  },
  statValueUp: {
    color: colors.success,
  },
  statValueDown: {
    color: colors.warning,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    marginTop: 2,
  },
  insights: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  insightsTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  insightEmoji: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  insightText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    lineHeight: 18,
  },
});