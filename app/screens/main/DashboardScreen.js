import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ProgressRing } from '../../components/ProgressRing';
import { WaveAnimation } from '../../components/WaveAnimation';
import { Button } from '../../components/Button';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';
import { getUserData, getTodayCalories, getTodayWaterTotal, saveWaterLog, saveFoodLog, getWaterLogs } from '../../utils/storage';
import { formatCalories, formatWater } from '../../utils/calculations';
import { Plus, Flame, Droplets, X } from 'lucide-react-native';

const FOOD_PRESETS = [
  { name: 'Apple', calories: 95 },
  { name: 'Banana', calories: 105 },
  { name: 'Chicken Breast (100g)', calories: 165 },
  { name: 'Rice (1 cup)', calories: 205 },
  { name: 'Egg', calories: 78 },
  { name: 'Bread (1 slice)', calories: 80 },
  { name: 'Milk (1 cup)', calories: 150 },
  { name: 'Yogurt', calories: 120 },
];

export const DashboardScreen = () => {
  const [userData, setUserData] = useState(null);
  const [todayCalories, setTodayCalories] = useState(0);
  const [todayWater, setTodayWater] = useState(0);
  const [waterGoal, setWaterGoal] = useState(2500);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [customCalories, setCustomCalories] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [customWater, setCustomWater] = useState('');

  const loadData = useCallback(async () => {
    const user = await getUserData();
    if (user) {
      setUserData(user);
      setWaterGoal(user.waterGoal || 2500);
    }
    const calories = await getTodayCalories();
    const water = await getTodayWaterTotal();
    setTodayCalories(calories);
    setTodayWater(water);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddWater = async (amount) => {
    await saveWaterLog(amount);
    const water = await getTodayWaterTotal();
    setTodayWater(water);
  };

  const handleAddFood = async (calories) => {
    await saveFoodLog({ name: selectedFood?.name || 'Custom Food', calories: parseInt(calories, 10) });
    const newCalories = await getTodayCalories();
    setTodayCalories(newCalories);
    setShowFoodModal(false);
    setCustomCalories('');
    setSelectedFood(null);
  };

  const calorieGoal = userData?.calorieGoal || 2000;
  const remainingCalories = calorieGoal - todayCalories;
  const calorieProgress = Math.min(todayCalories / calorieGoal, 1);
  const waterProgress = Math.min((todayWater / waterGoal) * 100, 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
        </Animated.View>

        <View style={styles.trackersContainer}>
          <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.trackerCard}>
            <View style={styles.trackerHeader}>
              <Flame size={20} color={colors.primary} />
              <Text style={styles.trackerTitle}>Calories</Text>
            </View>
            
            <View style={styles.calorieContent}>
              <ProgressRing 
                progress={calorieProgress} 
                size={140} 
                strokeWidth={12}
                color={colors.primary}
              >
                <Text style={styles.remainingValue}>{formatCalories(Math.abs(remainingCalories))}</Text>
                <Text style={styles.remainingLabel}>
                  {remainingCalories >= 0 ? 'Remaining' : 'Over'}
                </Text>
              </ProgressRing>
            </View>

            <View style={styles.calorieStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatCalories(calorieGoal)}</Text>
                <Text style={styles.statLabel}>Goal</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatCalories(todayCalories)}</Text>
                <Text style={styles.statLabel}>Consumed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, remainingCalories < 0 && styles.overValue]}>
                  {formatCalories(Math.abs(remainingCalories))}
                </Text>
                <Text style={styles.statLabel}>{remainingCalories >= 0 ? 'Left' : 'Over'}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={() => setShowFoodModal(true)}>
              <Plus size={18} color={colors.textPrimary} />
              <Text style={styles.addButtonText}>Quick Add</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.trackerCard}>
            <View style={styles.trackerHeader}>
              <Droplets size={20} color={colors.primary} />
              <Text style={styles.trackerTitle}>Water</Text>
            </View>

            <View style={styles.waterContent}>
              <WaveAnimation fillPercentage={waterProgress} size={160} />
            </View>

            <View style={styles.waterStats}>
              <Text style={styles.waterText}>
                {formatWater(todayWater)} / {formatWater(waterGoal)}
              </Text>
            </View>

            <View style={styles.waterButtons}>
              <TouchableOpacity style={styles.waterButton} onPress={() => handleAddWater(250)}>
                <Text style={styles.waterButtonText}>+250ml</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.waterButton} onPress={() => handleAddWater(500)}>
                <Text style={styles.waterButtonText}>+500ml</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.waterButton} onPress={() => setShowWaterModal(true)}>
                <Text style={styles.waterButtonText}>Custom</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      <Modal visible={showFoodModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Food</Text>
              <TouchableOpacity onPress={() => setShowFoodModal(false)}>
                <X size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Quick Add</Text>
            <View style={styles.foodPresets}>
              {FOOD_PRESETS.map((food, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[styles.foodPreset, selectedFood?.name === food.name && styles.foodPresetSelected]}
                  onPress={() => setSelectedFood(food)}
                >
                  <Text style={styles.foodPresetName}>{food.name}</Text>
                  <Text style={styles.foodPresetCalories}>{food.calories} cal</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalSubtitle}>Or enter custom calories</Text>
            <TextInput
              style={styles.customInput}
              value={customCalories}
              onChangeText={setCustomCalories}
              placeholder="Enter calories"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />

            <Button 
              title="Add Food" 
              onPress={() => handleAddFood(customCalories || selectedFood?.calories || 0)}
              disabled={!customCalories && !selectedFood}
            />
          </View>
        </View>
      </Modal>

      <Modal visible={showWaterModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Water</Text>
              <TouchableOpacity onPress={() => setShowWaterModal(false)}>
                <X size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.customInput}
              value={customWater}
              onChangeText={setCustomWater}
              placeholder="Enter amount in ml"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />

            <Button 
              title="Add Water" 
              onPress={() => {
                if (customWater) {
                  handleAddWater(parseInt(customWater, 10));
                  setShowWaterModal(false);
                  setCustomWater('');
                }
              }}
              disabled={!customWater}
            />
          </View>
        </View>
      </Modal>
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
  date: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    marginTop: spacing.xs,
  },
  trackersContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  trackerCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trackerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  trackerTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.subheader,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  calorieContent: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  remainingValue: {
    color: colors.textPrimary,
    fontSize: fontSize.title,
    fontWeight: 'bold',
  },
  remainingLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
  },
  calorieStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: fontSize.subheader,
    fontWeight: '600',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    marginTop: spacing.xs,
  },
  overValue: {
    color: colors.warning,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  addButtonText: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  waterContent: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  waterStats: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  waterText: {
    color: colors.textPrimary,
    fontSize: fontSize.subheader,
    fontWeight: '600',
  },
  waterButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  waterButton: {
    flex: 1,
    backgroundColor: colors.pureBlack,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  waterButtonText: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.subheader,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  foodPresets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  foodPreset: {
    backgroundColor: colors.pureBlack,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  foodPresetSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.pureBlack,
  },
  foodPresetName: {
    color: colors.textPrimary,
    fontSize: fontSize.caption,
  },
  foodPresetCalories: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  customInput: {
    backgroundColor: colors.pureBlack,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.body,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
});