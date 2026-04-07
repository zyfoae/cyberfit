import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LineChart } from 'react-native-chart-kit';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';
import { getWeightHistory, getFoodLogs, getUserData, getWaterLogs } from '../../utils/storage';
import { TrendingUp, Scale, Flame, Droplets } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const chartWidth = width - spacing.lg * 2;

export const AnalyticsScreen = () => {
  const [weightData, setWeightData] = useState([]);
  const [calorieData, setCalorieData] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [stats, setStats] = useState({ currentWeight: 0, avgCalories: 0, avgWater: 0 });

  const loadAnalytics = useCallback(async () => {
    const weightHistory = await getWeightHistory();
    const foodLogs = await getFoodLogs();
    const waterLogs = await getWaterLogs();
    const userData = await getUserData();

    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      
      const dayWeight = weightHistory.find(w => new Date(w.date).toDateString() === dateString);
      const dayFoods = foodLogs.filter(f => new Date(f.date).toDateString() === dateString);
      const dayWater = waterLogs.filter(w => new Date(w.date).toDateString() === dateString);
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        weight: dayWeight?.weight || null,
        calories: dayFoods.reduce((sum, f) => sum + f.calories, 0),
        water: dayWater.reduce((sum, w) => sum + w.amount, 0),
      });
    }

    const validWeights = last7Days.filter(d => d.weight !== null);
    const avgCalories = last7Days.reduce((sum, d) => sum + d.calories, 0) / 7;
    const avgWater = last7Days.reduce((sum, d) => sum + d.water, 0) / 7;

    setWeightData(validWeights.length > 0 ? validWeights : [{ date: '-', weight: userData?.weight || 0 }]);
    setCalorieData(last7Days);
    setWaterData(last7Days);
    setStats({
      currentWeight: userData?.weight || 0,
      avgCalories: Math.round(avgCalories),
      avgWater: Math.round(avgWater),
    });
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(230, 57, 70, ${opacity})`,
    labelColor: () => colors.textSecondary,
    style: {
      borderRadius: borderRadius.md,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Your progress over the last 7 days</Text>
        </Animated.View>

        <View style={styles.statsContainer}>
          <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.statCard}>
            <Scale size={24} color={colors.primary} />
            <Text style={styles.statValue}>{stats.currentWeight || '--'}</Text>
            <Text style={styles.statLabel}>Current Weight (kg)</Text>
          </Animated.View>
          
          <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.statCard}>
            <Flame size={24} color={colors.primary} />
            <Text style={styles.statValue}>{stats.avgCalories || 0}</Text>
            <Text style={styles.statLabel}>Avg Daily Calories</Text>
          </Animated.View>
          
          <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.statCard}>
            <Droplets size={24} color={colors.primary} />
            <Text style={styles.statValue}>{Math.round(stats.avgWater / 1000 * 10) / 10 || 0}L</Text>
            <Text style={styles.statLabel}>Avg Daily Water</Text>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.delay(700).duration(600)} style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <TrendingUp size={20} color={colors.primary} />
            <Text style={styles.chartTitle}>Weight Trend</Text>
          </View>
          {weightData.length > 1 ? (
            <LineChart
              data={{
                labels: weightData.map(d => d.date),
                datasets: [{ data: weightData.map(d => d.weight) }],
              }}
              width={chartWidth}
              height={180}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>Log your weight to see trends</Text>
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(800).duration(600)} style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Flame size={20} color={colors.primary} />
            <Text style={styles.chartTitle}>Calorie Consistency</Text>
          </View>
          <LineChart
            data={{
              labels: calorieData.map(d => d.date),
              datasets: [{ data: calorieData.map(d => d.calories || 0) }],
            }}
            width={chartWidth}
            height={180}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(230, 57, 70, ${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(900).duration(600)} style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Droplets size={20} color={colors.primary} />
            <Text style={styles.chartTitle}>Water Intake</Text>
          </View>
          <LineChart
            data={{
              labels: waterData.map(d => d.date),
              datasets: [{ data: waterData.map(d => d.water / 1000) }],
            }}
            width={chartWidth}
            height={180}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(230, 57, 70, ${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
        </Animated.View>
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: fontSize.subheader,
    fontWeight: 'bold',
    marginTop: spacing.sm,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  chartTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  chart: {
    borderRadius: borderRadius.md,
  },
  noDataContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
  },
});