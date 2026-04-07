import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ProgressRing } from '../../components/ProgressRing';
import { WaveAnimation } from '../../components/WaveAnimation';
import { MacronutrientCard } from '../../components/MacronutrientCard';
import { StreakCard } from '../../components/StreakCard';
import { WorkoutTimer } from '../../components/WorkoutTimer';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';
import { getUserData, getTodayCalories, getTodayWaterTotal, getTodayMacros, getMacrosGoals, getStreaks, saveWaterLog, saveFoodLog } from '../../utils/storage';
import { formatCalories, formatWater } from '../../utils/calculations';
import { Plus, Flame, Droplets, X, Timer } from 'lucide-react-native';

const FOOD_PRESETS = [
  { name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Rice (1 cup)', calories: 205, protein: 4.3, carbs: 44.5, fat: 0.4 },
  { name: 'Egg', calories: 78, protein: 6, carbs: 0.6, fat: 5 },
  { name: 'Bread (1 slice)', calories: 80, protein: 2.7, carbs: 15, fat: 1 },
  { name: 'Milk (1 cup)', calories: 150, protein: 8, carbs: 12, fat: 8 },
  { name: 'Yogurt', calories: 120, protein: 10, carbs: 15, fat: 0 },
  { name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: 'Avocado (half)', calories: 160, protein: 2, carbs: 9, fat: 15 },
];

export const ResponsiveDashboard = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [userData, setUserData] = useState(null);
  const [todayCalories, setTodayCalories] = useState(0);
  const [todayWater, setTodayWater] = useState(0);
  const [waterGoal, setWaterGoal] = useState(2500);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [customWater, setCustomWater] = useState('');
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fat: 0 });
  const [macrosGoals, setMacrosGoals] = useState({ protein: 150, carbs: 200, fat: 65 });
  const [streaks, setStreaks] = useState({ currentStreak: 0, workoutStreak: 0, totalDays: 0 });

  const loadData = useCallback(async () => {
    const user = await getUserData();
    if (user) {
      setUserData(user);
      setWaterGoal(user.waterGoal || 2500);
    }
    const calories = await getTodayCalories();
    const water = await getTodayWaterTotal();
    const todayMacros = await getTodayMacros();
    const goals = await getMacrosGoals();
    const userStreaks = await getStreaks();
    
    setTodayCalories(calories);
    setTodayWater(water);
    setMacros(todayMacros);
    setMacrosGoals(goals);
    setStreaks(userStreaks);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddWater = async (amount) => {
    await saveWaterLog(amount);
    const water = await getTodayWaterTotal();
    setTodayWater(water);
    const userStreaks = await getStreaks();
    setStreaks(userStreaks);
  };

  const handleAddFood = async (foodData) => {
    const { name, calories, protein = 0, carbs = 0, fat = 0 } = foodData;
    await saveFoodLog({ 
      name: name || 'Custom Food', 
      calories: parseInt(calories, 10) || 0,
      protein,
      carbs,
      fat
    });
    const newCalories = await getTodayCalories();
    const newMacros = await getTodayMacros();
    const userStreaks = await getStreaks();
    
    setTodayCalories(newCalories);
    setMacros(newMacros);
    setStreaks(userStreaks);
    
    setShowFoodModal(false);
    setCustomCalories('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFat('');
    setSelectedFood(null);
  };

  const calorieGoal = userData?.calorieGoal || 2000;
  const remainingCalories = calorieGoal - todayCalories;
  const calorieProgress = Math.min(todayCalories / calorieGoal, 1);
  const waterProgress = Math.min((todayWater / waterGoal) * 100, 100);

  const renderTrackers = () => (
    <>
      <Animated.View entering={FadeInDown.delay(400).duration(600)} style={[styles.trackerCard, isDesktop && styles.trackerCardDesktop]}>
        <View style={styles.trackerHeader}>
          <Flame size={20} color={colors.primary} />
          <Text style={styles.trackerTitle}>Calories</Text>
        </View>
        
        <View style={styles.calorieContent}>
          <ProgressRing 
            progress={calorieProgress} 
            size={isDesktop ? 180 : 140} 
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

      <Animated.View entering={FadeInDown.delay(600).duration(600)} style={[styles.trackerCard, isDesktop && styles.trackerCardDesktop]}>
        <View style={styles.trackerHeader}>
          <Droplets size={20} color={colors.primary} />
          <Text style={styles.trackerTitle}>Water</Text>
        </View>

        <View style={styles.waterContent}>
          <WaveAnimation fillPercentage={waterProgress} size={isDesktop ? 200 : 160} />
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
    </>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
        </Animated.View>

        {isDesktop ? (
          <View style={styles.desktopGrid}>
            {renderTrackers()}
          </View>
        ) : (
          <View style={styles.mobileTrackers}>
            {renderTrackers()}
          </View>
        )}

        <Animated.View entering={FadeInDown.delay(700).duration(600)} style={styles.section}>
          <TouchableOpacity 
            style={styles.timerButton}
            onPress={() => setShowTimer(!showTimer)}
          >
            <Timer size={20} color={colors.primary} />
            <Text style={styles.timerButtonText}>Workout Timer</Text>
            <Text style={styles.timerButtonHint}>{showTimer ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
          
          {showTimer && (
            <WorkoutTimer 
              initialTime={60} 
              onComplete={() => {}}
              isVisible={showTimer}
            />
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(800).duration(600)} style={styles.section}>
          <MacronutrientCard current={macros} goals={macrosGoals} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(900).duration(600)} style={styles.section}>
          <StreakCard streaks={streaks} />
        </Animated.View>
      </ScrollView>

      <Modal visible={showFoodModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDesktop && styles.modalContentDesktop]}>
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
                  {selectedFood?.name === food.name && (
                    <Text style={styles.foodPresetMacros}>
                      P:{food.protein}g C:{food.carbs}g F:{food.fat}g
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalSubtitle}>Or enter custom</Text>
            <TextInput
              style={styles.customInput}
              value={customCalories}
              onChangeText={setCustomCalories}
              placeholder="Calories"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
            
            <View style={styles.macroInputs}>
              <TextInput
                style={styles.macroInput}
                value={customProtein}
                onChangeText={() => {}}
                placeholder="Protein (g)"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.macroInput}
                value={customCarbs}
                onChangeText={() => {}}
                placeholder="Carbs (g)"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.macroInput}
                value={customFat}
                onChangeText={() => {}}
                placeholder="Fat (g)"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity 
              style={[styles.modalButton, (!customCalories && !selectedFood) && styles.modalButtonDisabled]}
              onPress={() => handleAddFood({
                name: selectedFood?.name,
                calories: customCalories || selectedFood?.calories || 0,
                protein: parseFloat(customProtein) || selectedFood?.protein || 0,
                carbs: parseFloat(customCarbs) || selectedFood?.carbs || 0,
                fat: parseFloat(customFat) || selectedFood?.fat || 0,
              })}
              disabled={!customCalories && !selectedFood}
            >
              <Text style={styles.modalButtonText}>Add Food</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showWaterModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDesktop && styles.modalContentDesktop]}>
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

            <TouchableOpacity 
              style={[styles.modalButton, !customWater && styles.modalButtonDisabled]}
              onPress={() => {
                if (customWater) {
                  handleAddWater(parseInt(customWater, 10));
                  setShowWaterModal(false);
                  setCustomWater('');
                }
              }}
              disabled={!customWater}
            >
              <Text style={styles.modalButtonText}>Add Water</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  mobileTrackers: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  desktopGrid: {
    flexDirection: 'row',
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
  trackerCardDesktop: {
    flex: 1,
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
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timerButtonText: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: '600',
    marginLeft: spacing.sm,
    flex: 1,
  },
  timerButtonHint: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '90%',
    maxWidth: 400,
  },
  modalContentDesktop: {
    maxWidth: 500,
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
    minWidth: 80,
  },
  foodPresetSelected: {
    borderColor: colors.primary,
  },
  foodPresetName: {
    color: colors.textPrimary,
    fontSize: fontSize.caption,
  },
  foodPresetCalories: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  foodPresetMacros: {
    color: colors.primary,
    fontSize: 9,
    marginTop: 2,
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
  macroInputs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  macroInput: {
    flex: 1,
    backgroundColor: colors.pureBlack,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    color: colors.textPrimary,
    fontSize: fontSize.caption,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
  modalButtonText: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
});