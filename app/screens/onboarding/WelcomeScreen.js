import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Button } from '../../components/Button';
import { colors, spacing, fontSize } from '../../constants/theme';
import { Activity } from 'lucide-react-native';

export const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.iconContainer}>
          <Activity size={80} color={colors.primary} />
        </Animated.View>
        
        <Animated.Text entering={FadeInDown.delay(400).duration(800)} style={styles.title}>
          CyberFit
        </Animated.Text>
        
        <Animated.Text entering={FadeInDown.delay(600).duration(800)} style={styles.subtitle}>
          Your intelligent fitness companion
        </Animated.Text>
        
        <Animated.Text entering={FadeInDown.delay(800).duration(800)} style={styles.description}>
          Track your calories, water intake, workouts, and see your progress with sleek cyber-noir aesthetics.
        </Animated.Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Begin Your Journey" 
          onPress={() => navigation.navigate('Gender')}
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.title,
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
  },
  buttonContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});