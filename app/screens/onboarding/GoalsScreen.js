import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Button } from '../../components/Button';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';
import { Flame, Droplets } from 'lucide-react-native';

export const GoalsScreen = ({ navigation, route }) => {
  const { calorieGoal, waterGoal } = route?.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.header}>
        <Text style={styles.title}>Your Goals Calculated!</Text>
        <Text style={styles.subtitle}>Based on your profile, here are your daily targets</Text>
      </Animated.View>

      <View style={styles.cardsContainer}>
        <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.card}>
          <View style={styles.iconContainer}>
            <Flame size={32} color={colors.primary} />
          </View>
          <Text style={styles.cardTitle}>Daily Calories</Text>
          <Text style={styles.cardValue}>{calorieGoal?.toLocaleString() || '--'}</Text>
          <Text style={styles.cardUnit}>kcal / day</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600).duration(600)} style={styles.card}>
          <View style={styles.iconContainer}>
            <Droplets size={32} color={colors.primary} />
          </View>
          <Text style={styles.cardTitle}>Daily Water</Text>
          <Text style={styles.cardValue}>{waterGoal ? Math.round(waterGoal / 1000 * 10) / 10 : '--'}</Text>
          <Text style={styles.cardUnit}>liters / day</Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(800).duration(600)} style={styles.infoContainer}>
        <Text style={styles.infoText}>
          These goals are calculated using the Mifflin-St Jeor formula with a light activity level. You can adjust these later in your profile.
        </Text>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <Button 
          title="Start My Journey" 
          onPress={() => navigation.replace('Main')}
          size="large"
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
  cardsContainer: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.pureBlack,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    marginBottom: spacing.sm,
  },
  cardValue: {
    color: colors.primary,
    fontSize: 40,
    fontWeight: 'bold',
  },
  cardUnit: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    marginTop: spacing.xs,
  },
  infoContainer: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});