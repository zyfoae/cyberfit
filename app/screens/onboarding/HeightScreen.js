import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';

export const HeightScreen = ({ navigation, route }) => {
  const [height, setHeight] = useState(route?.params?.height?.toString() || '');
  const [error, setError] = useState('');

  const handleContinue = () => {
    const heightNum = parseInt(height, 10);
    if (!height || isNaN(heightNum)) {
      setError('Please enter your height');
      return;
    }
    if (heightNum < 100 || heightNum > 250) {
      setError('Height must be between 100 and 250 cm');
      return;
    }
    navigation.navigate('Weight', { ...route?.params, height: heightNum });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.header}>
        <Text style={styles.stepText}>Step 3 of 4</Text>
        <Text style={styles.title}>What's Your Height?</Text>
        <Text style={styles.subtitle}>Enter your height in centimeters</Text>
      </Animated.View>

      <View style={styles.inputContainer}>
        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <Input
            label="Height"
            value={height}
            onChangeText={(text) => {
              setHeight(text.replace(/[^0-9]/g, ''));
              setError('');
            }}
            placeholder="Enter your height"
            keyboardType="numeric"
            suffix="cm"
            error={error}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.visualContainer}>
          <View style={styles.heightDisplay}>
            <Text style={styles.heightText}>{height || '--'}</Text>
            <Text style={styles.heightLabel}>cm</Text>
          </View>
          <View style={styles.heightBar}>
            <View style={[
              styles.heightFill, 
              { width: `${Math.min((height || 0) / 250 * 100, 100)}%` }
            ]} />
          </View>
        </Animated.View>
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title="Continue" 
          onPress={handleContinue}
          disabled={!height}
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
  heightDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  heightText: {
    color: colors.primary,
    fontSize: 72,
    fontWeight: 'bold',
  },
  heightLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.subheader,
    marginLeft: spacing.sm,
  },
  heightBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.card,
    borderRadius: borderRadius.round,
    marginTop: spacing.lg,
    overflow: 'hidden',
  },
  heightFill: {
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