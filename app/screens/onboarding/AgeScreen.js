import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { colors, spacing, fontSize } from '../../constants/theme';

const { width } = Dimensions.get('window');

export const AgeScreen = ({ navigation, route }) => {
  const [age, setAge] = useState(route?.params?.age?.toString() || '');
  const [error, setError] = useState('');

  const handleContinue = () => {
    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum)) {
      setError('Please enter your age');
      return;
    }
    if (ageNum < 15 || ageNum > 100) {
      setError('Age must be between 15 and 100');
      return;
    }
    navigation.navigate('Height', { ...route?.params, age: ageNum });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.header}>
        <Text style={styles.stepText}>Step 2 of 4</Text>
        <Text style={styles.title}>What's Your Age?</Text>
        <Text style={styles.subtitle}>Age helps us determine your metabolic rate</Text>
      </Animated.View>

      <View style={styles.inputContainer}>
        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <Input
            label="Age"
            value={age}
            onChangeText={(text) => {
              setAge(text.replace(/[^0-9]/g, ''));
              setError('');
            }}
            placeholder="Enter your age"
            keyboardType="numeric"
            suffix="years"
            error={error}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.visualContainer}>
          <View style={styles.ageDisplay}>
            <Text style={styles.ageText}>{age || '--'}</Text>
            <Text style={styles.ageLabel}>years old</Text>
          </View>
        </Animated.View>
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title="Continue" 
          onPress={handleContinue}
          disabled={!age}
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
  ageDisplay: {
    alignItems: 'center',
  },
  ageText: {
    color: colors.primary,
    fontSize: 72,
    fontWeight: 'bold',
  },
  ageLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
  },
  buttonContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  backButton: {
    marginTop: spacing.sm,
  },
});