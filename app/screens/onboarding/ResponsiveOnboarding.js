import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';
import { Activity, User, Scale, Ruler, Weight, ArrowRight, ArrowLeft, Check } from 'lucide-react-native';
import { calculateDailyCalorieGoal, calculateDailyWaterGoal } from '../../utils/calculations';
import { saveUserData } from '../../utils/storage';

export const ResponsiveOnboarding = ({ onComplete }) => {
  // Always use mobile layout on web to avoid rendering issues
  const isDesktop = false;
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    gender: null,
    age: '',
    height: '',
    weight: '',
  });
  const [errors, setErrors] = useState({});

  const STEPS = ['Welcome', 'Gender', 'Age', 'Height', 'Weight', 'Goals'];

  const updateFormData = (key, value) => {
    setFormData({ ...formData, [key]: value });
    setErrors({ ...errors, [key]: null });
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1 && !formData.gender) newErrors.gender = 'Please select';
    if (step === 2) {
      const age = parseInt(formData.age);
      if (!formData.age || isNaN(age) || age < 15 || age > 100) newErrors.age = 'Age 15-100';
    }
    if (step === 3) {
      const height = parseInt(formData.height);
      if (!formData.height || isNaN(height) || height < 100 || height > 250) newErrors.height = 'Height 100-250';
    }
    if (step === 4) {
      const weight = parseFloat(formData.weight);
      if (!formData.weight || isNaN(weight) || weight < 30 || weight > 300) newErrors.weight = 'Weight 30-300';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleComplete = async () => {
    const weight = parseFloat(formData.weight);
    const calorieGoal = calculateDailyCalorieGoal(weight, parseInt(formData.height), parseInt(formData.age), formData.gender);
    const waterGoal = calculateDailyWaterGoal(weight);

    const userData = {
      gender: formData.gender,
      age: parseInt(formData.age),
      height: parseInt(formData.height),
      weight,
      calorieGoal,
      waterGoal,
      hasCompletedOnboarding: true,
    };

    await saveUserData(userData);
    onComplete();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <View style={styles.iconContainer}>
              <Activity size={60} color={colors.primary} />
            </View>
            <Text style={styles.title}>CyberFit</Text>
            <Text style={styles.subtitle}>Your intelligent fitness companion</Text>
            <Text style={styles.description}>
              Track calories, water, workouts, and see your progress with sleek cyber-noir aesthetics.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
              <Text style={styles.primaryButtonText}>Begin Your Journey</Text>
              <ArrowRight size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Select Your Gender</Text>
            <Text style={styles.stepSubtitle}>This helps calculate your daily calorie goal</Text>
            <View style={styles.optionsGrid}>
              {['male', 'female', 'other'].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.optionCard, formData.gender === g && styles.optionCardSelected]}
                  onPress={() => updateFormData('gender', g)}
                >
                  <Text style={styles.optionIcon}>
                    {g === 'male' ? '♂' : g === 'female' ? '♀' : '⚥'}
                  </Text>
                  <Text style={[styles.optionLabel, formData.gender === g && styles.optionLabelSelected]}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What's Your Age?</Text>
            <Text style={styles.stepSubtitle}>Age affects your metabolic rate</Text>
            <View style={styles.inputCenterContainer}>
              <TextInput
                style={[styles.largeInput, errors.age && styles.inputError]}
                value={formData.age}
                onChangeText={(v) => updateFormData('age', v.replace(/[^0-9]/g, ''))}
                placeholder="--"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
              <Text style={styles.inputUnit}>years</Text>
            </View>
            {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What's Your Height?</Text>
            <View style={styles.inputCenterContainer}>
              <TextInput
                style={[styles.largeInput, errors.height && styles.inputError]}
                value={formData.height}
                onChangeText={(v) => updateFormData('height', v.replace(/[^0-9]/g, ''))}
                placeholder="--"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
              <Text style={styles.inputUnit}>cm</Text>
            </View>
            {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What's Your Weight?</Text>
            <View style={styles.inputCenterContainer}>
              <TextInput
                style={[styles.largeInput, errors.weight && styles.inputError]}
                value={formData.weight}
                onChangeText={(v) => updateFormData('weight', v.replace(/[^0-9.]/g, ''))}
                placeholder="--"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
              <Text style={styles.inputUnit}>kg</Text>
            </View>
            {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
          </View>
        );
      case 5:
        const weight = parseFloat(formData.weight) || 0;
        const calorieGoal = calculateDailyCalorieGoal(weight, parseInt(formData.height) || 0, parseInt(formData.age) || 0, formData.gender);
        const waterGoal = calculateDailyWaterGoal(weight);
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Your Goals Calculated!</Text>
            <View style={styles.goalsCards}>
              <View style={styles.goalCard}>
                <Weight size={28} color={colors.primary} />
                <Text style={styles.goalLabel}>Daily Calories</Text>
                <Text style={styles.goalValue}>{calorieGoal.toLocaleString()}</Text>
                <Text style={styles.goalUnit}>kcal / day</Text>
              </View>
              <View style={styles.goalCard}>
                <Scale size={28} color={colors.primary} />
                <Text style={styles.goalLabel}>Daily Water</Text>
                <Text style={styles.goalValue}>{(waterGoal / 1000).toFixed(1)}</Text>
                <Text style={styles.goalUnit}>liters / day</Text>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  if (isDesktop) {
    return (
      <View style={styles.desktopWrapper}>
        <View style={styles.desktopCard}>
          <View style={styles.progressBar}>
            {STEPS.map((_, i) => (
              <View key={i} style={[styles.progressDot, i <= step && styles.progressDotActive]} />
            ))}
          </View>
          {renderStep()}
          <View style={styles.buttonRow}>
            {step > 0 && (
              <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
                <ArrowLeft size={18} color={colors.primary} />
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.primaryButton, step === 0 && styles.primaryButtonFull]} 
              onPress={handleNext}
            >
              <Text style={styles.primaryButtonText}>
                {step === STEPS.length - 1 ? 'Start My Journey' : 'Continue'}
              </Text>
              <ArrowRight size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mobileWrapper}>
      <View style={styles.progressBar}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.progressDot, i <= step && styles.progressDotActive]} />
        ))}
      </View>
      {renderStep()}
      <View style={styles.buttonRow}>
        {step > 0 && (
          <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
            <ArrowLeft size={18} color={colors.primary} />
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={[styles.primaryButton, step === 0 && styles.primaryButtonFull]} 
          onPress={handleNext}
        >
          <Text style={styles.primaryButtonText}>
            {step === STEPS.length - 1 ? 'Start My Journey' : 'Continue'}
          </Text>
          <ArrowRight size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  desktopWrapper: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  desktopCard: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mobileWrapper: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
  },
  stepContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.pureBlack,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.primary,
    fontSize: fontSize.subheader,
    marginBottom: spacing.lg,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  stepTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.header,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  stepSubtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  optionCard: {
    flex: 1,
    backgroundColor: colors.pureBlack,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: colors.primary,
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  optionLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
  },
  optionLabelSelected: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  inputCenterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  largeInput: {
    fontSize: 64,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    minWidth: 150,
  },
  inputUnit: {
    color: colors.textSecondary,
    fontSize: fontSize.subheader,
    marginLeft: spacing.sm,
  },
  inputError: {
    borderBottomWidth: 2,
    borderBottomColor: colors.warning,
  },
  errorText: {
    color: colors.warning,
    fontSize: fontSize.caption,
    marginTop: spacing.sm,
  },
  goalsCards: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  goalCard: {
    flex: 1,
    backgroundColor: colors.pureBlack,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  goalLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    marginTop: spacing.sm,
  },
  goalValue: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: spacing.xs,
  },
  goalUnit: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  primaryButtonFull: {
    flex: 1,
  },
  primaryButtonText: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
});