import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence } from 'react-native-reanimated';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react-native';

export const WorkoutTimer = ({ initialTime = 60, onComplete, isVisible = true }) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    let interval;
    
    if (isRunning && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, isPaused, timeRemaining, onComplete]);

  useEffect(() => {
    if (timeRemaining <= 10 && isRunning && !isPaused) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 200 }),
          withTiming(1, { duration: 200 })
        ),
        -1,
        true
      );
    } else {
      pulseScale.value = 1;
    }
  }, [timeRemaining, isRunning, isPaused]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    setTimeRemaining(initialTime);
    setIsRunning(false);
    setIsPaused(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const setTime = (seconds) => {
    setTimeRemaining(seconds);
    setIsRunning(false);
    setIsPaused(false);
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.timerDisplay}>
        <Clock size={20} color={colors.textSecondary} style={styles.clockIcon} />
        <Animated.Text style={[styles.timeText, timeRemaining <= 10 && styles.timeTextWarning, pulseStyle]}>
          {formatTime(timeRemaining)}
        </Animated.Text>
      </View>

      <View style={styles.presetButtons}>
        {[30, 60, 90, 120].map((time) => (
          <TouchableOpacity
            key={time}
            style={[styles.presetButton, timeRemaining === time && styles.presetButtonActive]}
            onPress={() => setTime(time)}
          >
            <Text style={[styles.presetText, timeRemaining === time && styles.presetTextActive]}>
              {time}s
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.controls}>
        {!isRunning ? (
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Play size={24} color={colors.textPrimary} />
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) : isPaused ? (
          <TouchableOpacity style={styles.resumeButton} onPress={handleResume}>
            <Play size={24} color={colors.textPrimary} />
            <Text style={styles.buttonText}>Resume</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
            <Pause size={24} color={colors.textPrimary} />
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <RotateCcw size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  clockIcon: {
    marginRight: spacing.sm,
  },
  timeText: {
    color: colors.textPrimary,
    fontSize: 48,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  timeTextWarning: {
    color: colors.warning,
  },
  presetButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  presetButton: {
    backgroundColor: colors.pureBlack,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetButtonActive: {
    borderColor: colors.primary,
  },
  presetText: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
  },
  presetTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  pauseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  resumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  resetButton: {
    backgroundColor: colors.pureBlack,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
});