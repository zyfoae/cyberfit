import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';
import { getUserData, saveUserData, getMacrosGoals, saveMacrosGoals } from '../../utils/storage';
import { Save, RotateCcw, Flame, Droplets, Apple } from 'lucide-react-native';

export const GoalsScreen = ({ onSave }) => {
  const [userData, setUserData] = useState(null);
  const [calorieGoal, setCalorieGoal] = useState('');
  const [waterGoal, setWaterGoal] = useState('');
  const [proteinGoal, setProteinGoal] = useState('');
  const [carbsGoal, setCarbsGoal] = useState('');
  const [fatGoal, setFatGoal] = useState('');
  const [activityLevel, setActivityLevel] = useState('light');
  const [isSaving, setIsSaving] = useState(false);

  const loadGoals = useCallback(async () => {
    const user = await getUserData();
    const macros = await getMacrosGoals();
    
    if (user) {
      setUserData(user);
      setCalorieGoal(user.calorieGoal?.toString() || '2000');
      setWaterGoal(Math.round((user.waterGoal || 2500) / 1000 * 10) / 10);
    }
    
    if (macros) {
      setProteinGoal(macros.protein?.toString() || '150');
      setCarbsGoal(macros.carbs?.toString() || '200');
      setFatGoal(macros.fat?.toString() || '65');
    }
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const handleReset = () => {
    setCalorieGoal('2000');
    setWaterGoal('2.5');
    setProteinGoal('150');
    setCarbsGoal('200');
    setFatGoal('65');
    setActivityLevel('light');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const calorieGoalNum = parseInt(calorieGoal, 10);
      const waterGoalMl = Math.round(parseFloat(waterGoal) * 1000);
      
      const updatedUserData = {
        ...userData,
        calorieGoal: calorieGoalNum,
        waterGoal: waterGoalMl,
      };
      
      await saveUserData(updatedUserData);
      await saveMacrosGoals({
        protein: parseInt(proteinGoal, 10),
        carbs: parseInt(carbsGoal, 10),
        fat: parseInt(fatGoal, 10),
      });
      
      setUserData(updatedUserData);
      
      if (onSave) {
        onSave(updatedUserData);
      }
      
      alert('Goals saved successfully!');
    } catch (error) {
      console.error('Error saving goals:', error);
      alert('Failed to save goals. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const recalculateFromActivity = (level) => {
    setActivityLevel(level);
    
    if (userData?.weight && userData?.height && userData?.age && userData?.gender) {
      const { weight, height, age, gender } = userData;
      
      let bmr;
      if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
      } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
      }
      
      const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9,
      };
      
      const newCalorieGoal = Math.round(bmr * multipliers[level]);
      setCalorieGoal(newCalorieGoal.toString());
    }
  };

  const activityLevels = [
    { id: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise', multiplier: 1.2 },
    { id: 'light', label: 'Light', desc: 'Light exercise 1-3 days/week', multiplier: 1.375 },
    { id: 'moderate', label: 'Moderate', desc: 'Moderate exercise 3-5 days/week', multiplier: 1.55 },
    { id: 'active', label: 'Active', desc: 'Hard exercise 6-7 days/week', multiplier: 1.725 },
    { id: 'veryActive', label: 'Very Active', desc: 'Very hard exercise daily', multiplier: 1.9 },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Adjust Goals</Text>
          <Text style={styles.subtitle}>Customize your daily targets</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Flame size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Daily Calories</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Calorie Goal (kcal)</Text>
            <TextInput
              style={styles.input}
              value={calorieGoal}
              onChangeText={setCalorieGoal}
              keyboardType="numeric"
              placeholder="2000"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.activitySection}>
            <Text style={styles.activityLabel}>Activity Level (auto-calculates calories)</Text>
            <View style={styles.activityOptions}>
              {activityLevels.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.activityOption,
                    activityLevel === level.id && styles.activityOptionActive,
                  ]}
                  onPress={() => recalculateFromActivity(level.id)}
                >
                  <Text style={[
                    styles.activityOptionText,
                    activityLevel === level.id && styles.activityOptionTextActive,
                  ]}>
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.activityDesc}>
              {activityLevels.find(l => l.id === activityLevel)?.desc}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Droplets size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Daily Water</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Water Goal (Liters)</Text>
            <TextInput
              style={styles.input}
              value={waterGoal}
              onChangeText={setWaterGoal}
              keyboardType="numeric"
              placeholder="2.5"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Apple size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Macronutrient Goals</Text>
          </View>
          
          <View style={styles.macrosGrid}>
            <View style={styles.macroInput}>
              <Text style={styles.macroLabel}>Protein (g)</Text>
              <TextInput
                style={styles.input}
                value={proteinGoal}
                onChangeText={setProteinGoal}
                keyboardType="numeric"
                placeholder="150"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <View style={styles.macroInput}>
              <Text style={styles.macroLabel}>Carbs (g)</Text>
              <TextInput
                style={styles.input}
                value={carbsGoal}
                onChangeText={setCarbsGoal}
                keyboardType="numeric"
                placeholder="200"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <View style={styles.macroInput}>
              <Text style={styles.macroLabel}>Fat (g)</Text>
              <TextInput
                style={styles.input}
                value={fatGoal}
                onChangeText={setFatGoal}
                keyboardType="numeric"
                placeholder="65"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
          
          <View style={styles.macroInfo}>
            <Text style={styles.macroInfoText}>
              Total: {parseInt(proteinGoal || 0, 10) * 4 + parseInt(carbsGoal || 0, 10) * 4 + parseInt(fatGoal || 0, 10) * 9} kcal from macros
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={handleReset}
          >
            <RotateCcw size={18} color={colors.primary} />
            <Text style={styles.resetButtonText}>Reset to Defaults</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Save size={18} color={colors.textPrimary} />
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save Goals'}
            </Text>
          </TouchableOpacity>
        </View>
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
  section: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.subheader,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.pureBlack,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.subheader,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: colors.border,
  },
  activitySection: {
    marginTop: spacing.sm,
  },
  activityLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    marginBottom: spacing.sm,
  },
  activityOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  activityOption: {
    backgroundColor: colors.pureBlack,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  activityOptionText: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
  },
  activityOptionTextActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  activityDesc: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  macrosGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  macroInput: {
    flex: 1,
  },
  macroLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    marginBottom: spacing.xs,
  },
  macroInfo: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.pureBlack,
    borderRadius: borderRadius.sm,
  },
  macroInfoText: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  resetButtonText: {
    color: colors.primary,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
});