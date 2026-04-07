import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { calculateDailyCalorieGoal, calculateDailyWaterGoal } from '../../utils/calculations';
import { saveUserData } from '../../utils/storage';

export const WeightScreen = ({ navigation, route }) => {
  const [weight, setWeight] = useState(route?.params?.weight?.toString() || '');
  const [error, setError] = useState('');

  const handleContinue = async () => {
    const weightNum = parseFloat(weight);
    if (!weight || isNaN(weightNum)) {
      setError('Please enter your weight');
      return;
    }
    if (weightNum < 30 || weightNum > 300) {
      setError('Weight must be between 30 and 300 kg');
      return;
    }

    const { gender, age, height } = route?.params || {};
    const calorieGoal = calculateDailyCalorieGoal(weightNum, height, age, gender);
    const waterGoal = calculateDailyWaterGoal(weightNum);

    const userData = {
      gender,
      age,
      height,
      weight: weightNum,
      calorieGoal,
      waterGoal,
      hasCompletedOnboarding: true,
    };

    await saveUserData(userData);
    navigation.navigate('Goals', { ...route?.params, ...userData });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.header}>
        <Text style={styles.stepText}>Step 4 of 4</Text>
        <Text style={styles.title}>What's Your Weight?</Text>
        <Text style={styles.subtitle}>Enter your weight in kilograms</Text>
      </Animated.View>

      <View style={styles.inputContainer}>
        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <Input
            label="Weight"
            value={weight}
            onChangeText={(text) => {
              setWeight(text.replace(/[^0-9.]/g, ''));
              setError('');
            }}
            placeholder="Enter your weight"
            keyboardType="numeric"
            suffix="kg"
            error={error}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.visualContainer}>
          <View style={styles.weightDisplay}>
            <Text style={styles.weightText}>{weight || '--'}</Text>
            <Text style={styles.weightLabel}>kg</Text>
          </View>
          <View style={styles.weightBar}>
            <View style={[
              styles.weightFill, 
              { width: `${Math.min((weight || 0) / 300 * 100, 100)}%` }
            ]} />
          </View>
        </Animated.View>
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title="Calculate My Goals" 
          onPress={handleContinue}
          disabled={!weight}
        />
        <Button 
          title="Back" 
          onPress={() => navigation.goBack()}
          variant="outline"
          style={styles.backButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  stepText: {
    color: colors.primary,
    fontSize: fontSize.caption,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.header,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
  },
  visualContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  weightDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  weightText: {
    color: colors.primary,
    fontSize: 72,
    fontWeight: 'bold',
  },
  weightLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.subheader,
    marginLeft: spacing.sm,
  },
  weightBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.card,
    borderRadius: borderRadius.round,
    marginTop: spacing.lg,
    overflow: 'hidden',
  },
  weightFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
  },
  buttonContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  backButton: {
    marginTop: spacing.sm,
  },
});