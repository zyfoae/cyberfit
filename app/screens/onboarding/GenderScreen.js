import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Button } from '../../components/Button';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';
import { User } from 'lucide-react-native';

const GENDER_OPTIONS = [
  { id: 'male', label: 'Male', icon: '♂' },
  { id: 'female', label: 'Female', icon: '♀' },
  { id: 'other', label: 'Other', icon: '⚥' },
];

export const GenderScreen = ({ navigation, route }) => {
  const [selectedGender, setSelectedGender] = useState(route?.params?.gender || null);

  const handleContinue = () => {
    if (selectedGender) {
      navigation.navigate('Age', { ...route?.params, gender: selectedGender });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.header}>
        <Text style={styles.stepText}>Step 1 of 4</Text>
        <Text style={styles.title}>Select Your Gender</Text>
        <Text style={styles.subtitle}>This helps us calculate your daily calorie goal accurately</Text>
      </Animated.View>

      <View style={styles.optionsContainer}>
        {GENDER_OPTIONS.map((option, index) => (
          <Animated.View key={option.id} entering={FadeInUp.delay(300 + index * 100).duration(600)}>
            <TouchableOpacity
              style={[
                styles.optionCard,
                selectedGender === option.id && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedGender(option.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionIcon}>{option.icon}</Text>
              <Text style={[
                styles.optionLabel,
                selectedGender === option.id && styles.optionLabelSelected,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title="Continue" 
          onPress={handleContinue}
          disabled={!selectedGender}
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
  optionsContainer: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    gap: spacing.md,
  },
  optionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.pureBlack,
  },
  optionIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  optionLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.subheader,
    fontWeight: '600',
  },
  optionLabelSelected: {
    color: colors.textPrimary,
  },
  buttonContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  backButton: {
    marginTop: spacing.sm,
  },
});