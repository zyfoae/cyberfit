import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, interpolate } from 'react-native-reanimated';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';

const { width } = Dimensions.get('window');
const WAVE_WIDTH = width * 0.8;

export const WaveAnimation = ({ fillPercentage = 0, size = 200 }) => {
  const wave1 = useSharedValue(0);
  const wave2 = useSharedValue(0);

  useEffect(() => {
    wave1.value = withRepeat(withTiming(1, { duration: 3000, easing: Easing.linear }), -1, true);
    wave2.value = withRepeat(withTiming(1, { duration: 2500, easing: Easing.linear }), -1, true);
  }, []);

  const wave1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(wave1.value, [0, 1], [-20, 20]) },
    ],
  }));

  const wave2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(wave2.value, [0, 1], [20, -20]) },
    ],
  }));

  const fillHeight = (size * fillPercentage) / 100;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.waveContainer, { height: fillHeight }]}>
        <Animated.View style={[styles.wave, wave1Style, { backgroundColor: colors.primary }]} />
        <Animated.View style={[styles.wave, styles.wave2, wave2Style, { backgroundColor: colors.secondary }]} />
      </View>
      <View style={[styles.background, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={styles.percentageText}>{Math.round(fillPercentage)}%</Text>
        <Text style={styles.mlText}>{Math.round((fillPercentage / 100) * 2500)}ml</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: colors.card,
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    width: WAVE_WIDTH * 2,
    height: 60,
    borderRadius: 30,
    opacity: 0.6,
  },
  wave2: {
    opacity: 0.4,
    top: -20,
  },
  background: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pureBlack,
  },
  percentageText: {
    color: colors.textPrimary,
    fontSize: fontSize.title,
    fontWeight: 'bold',
  },
  mlText: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    marginTop: spacing.xs,
  },
});