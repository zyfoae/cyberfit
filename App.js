import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, ActivityIndicator, StyleSheet, 
  useWindowDimensions, TouchableOpacity, Animated as RNAnimated 
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { 
  FadeIn, FadeInDown, FadeInUp, FadeOut,
  SlideInRight, SlideOutLeft,
  BounceIn, BounceInDown,
  Pulse, Shake, Sequence,
  useAnimatedStyle, useSharedValue, withRepeat, withTiming,
  Easing, interpolate
} from 'react-native-reanimated';

import { lightTheme, darkTheme, getTheme } from './app/constants/theme';

import { ResponsiveLayout } from './app/components/ResponsiveLayout';
import { ResponsiveOnboarding } from './app/screens/onboarding/ResponsiveOnboarding';
import { ResponsiveDashboard } from './app/screens/main/ResponsiveDashboard';
import { WorkoutsScreen } from './app/screens/main/WorkoutsScreen';
import { WorkoutHistoryScreen } from './app/screens/main/WorkoutHistoryScreen';
import { MealHistoryScreen } from './app/screens/main/MealHistoryScreen';
import { AnalyticsScreen } from './app/screens/main/AnalyticsScreen';
import { ProfileScreen } from './app/screens/main/ProfileScreen';
import { SettingsScreen } from './app/screens/main/SettingsScreen';
import { GoalsScreen } from './app/screens/main/GoalsScreen';

// Simple web-compatible storage
let webStorage = {};
const createSimpleStorage = () => ({
  getItem: async (key) => webStorage[key] || null,
  setItem: async (key, value) => { webStorage[key] = value; },
  removeItem: async (key) => { delete webStorage[key]; },
});

let Storage;
try {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  Storage = AsyncStorage;
} catch (e) {
  Storage = createSimpleStorage();
}

const KEYS = { USER_DATA: '@cyberfit_user_data', FOOD_LOGS: '@cyberfit_food_logs', WATER_LOGS: '@cyberfit_water_logs', WORKOUT_LOGS: '@cyberfit_workout_logs', WEIGHT_HISTORY: '@cyberfit_weight_history', STREAKS: '@cyberfit_streaks', MACROS_GOALS: '@cyberfit_macros_goals' };

const getUserData = async () => { try { const d = await Storage.getItem(KEYS.USER_DATA); return d ? JSON.parse(d) : null; } catch { return null; } };
const saveUserData = async (data) => { try { await Storage.setItem(KEYS.USER_DATA, JSON.stringify(data)); } catch {} };
const getFoodLogs = async () => { try { const d = await Storage.getItem(KEYS.FOOD_LOGS); return d ? JSON.parse(d) : []; } catch { return []; } };
const saveFoodLog = async (entry) => { try { const logs = await getFoodLogs(); logs.push({ ...entry, date: new Date().toISOString() }); await Storage.setItem(KEYS.FOOD_LOGS, JSON.stringify(logs)); } catch {} };
const getWaterLogs = async () => { try { const d = await Storage.getItem(KEYS.WATER_LOGS); return d ? JSON.parse(d) : []; } catch { return []; } };
const saveWaterLog = async (amount) => { try { const logs = await getWaterLogs(); logs.push({ amount, date: new Date().toISOString() }); await Storage.setItem(KEYS.WATER_LOGS, JSON.stringify(logs)); } catch {} };
const getTodayWaterTotal = async () => { const logs = await getWaterLogs(); const today = new Date().toDateString(); return logs.filter(l => new Date(l.date).toDateString() === today).reduce((s, l) => s + l.amount, 0); };
const getTodayCalories = async () => { const logs = await getFoodLogs(); const today = new Date().toDateString(); return logs.filter(l => new Date(l.date).toDateString() === today).reduce((s, l) => s + (l.calories || 0), 0); };
const getTodayMacros = async () => { const logs = await getFoodLogs(); const today = new Date().toDateString(); const todayLogs = logs.filter(l => new Date(l.date).toDateString() === today); return todayLogs.reduce((a, l) => ({ protein: a.protein + (l.protein || 0), carbs: a.carbs + (l.carbs || 0), fat: a.fat + (l.fat || 0) }), { protein: 0, carbs: 0, fat: 0 }); };
const getMacrosGoals = async () => { try { const d = await Storage.getItem(KEYS.MACROS_GOALS); return d ? JSON.parse(d) : { protein: 150, carbs: 200, fat: 65 }; } catch { return { protein: 150, carbs: 200, fat: 65 }; } };
const getStreaks = async () => { try { const d = await Storage.getItem(KEYS.STREAKS); return d ? JSON.parse(d) : { currentStreak: 0, workoutStreak: 0, totalDays: 0 }; } catch { return { currentStreak: 0, workoutStreak: 0, totalDays: 0 }; } };
const getWeightHistory = async () => { try { const d = await Storage.getItem(KEYS.WEIGHT_HISTORY); return d ? JSON.parse(d) : []; } catch { return []; } };
const getWorkoutLogs = async () => { try { const d = await Storage.getItem(KEYS.WORKOUT_LOGS); return d ? JSON.parse(d) : []; } catch { return []; } };
const saveWorkoutLog = async (entry) => { try { const logs = await getWorkoutLogs(); logs.push({ ...entry, date: new Date().toISOString() }); await Storage.setItem(KEYS.WORKOUT_LOGS, JSON.stringify(logs)); } catch {} };

// Enhanced Animated Splash Screen
const AnimatedSplash = ({ onFinish }) => {
  const pulseAnim = useSharedValue(1);
  const rotateAnim = useSharedValue(0);
  
  useEffect(() => {
    pulseAnim.value = withRepeat(withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }), -1, true);
    rotateAnim.value = withRepeat(withTiming(360, { duration: 2000, easing: Easing.linear }), -1, false);
    
    setTimeout(() => onFinish(), 2500);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulseAnim.value }] }));
  const rotateStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotateAnim.value}deg` }] }));

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.splashContainer}>
      <Animated.View style={[styles.logoCircle, pulseStyle]}>
        <Animated.Text style={[styles.logoIcon, rotateStyle]}>🏋️</Animated.Text>
      </Animated.View>
      <Animated.Text entering={FadeInDown.delay(300).duration(400)} style={styles.splashTitle}>CyberFit</Animated.Text>
      <Animated.Text entering={FadeInDown.delay(500).duration(400)} style={styles.splashSubtitle}>Your Fitness Journey</Animated.Text>
      <Animated.View entering={FadeIn.delay(800)} style={styles.loadingDots}>
        <Animated.Text style={styles.loadingDot}>.</Animated.Text>
        <Animated.Text style={[styles.loadingDot, { animationDelay: '0.2s' }]}>.</Animated.Text>
        <Animated.Text style={[styles.loadingDot, { animationDelay: '0.4s' }]}>.</Animated.Text>
      </Animated.View>
    </Animated.View>
  );
};

// Enhanced Loading Screen
const AnimatedLoading = ({ theme }) => {
  const rotateAnim = useSharedValue(0);
  
  useEffect(() => {
    rotateAnim.value = withRepeat(withTiming(360, { duration: 1000, easing: Easing.linear }), -1, false);
  }, []);
  
  const spinStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotateAnim.value}deg` }] }));

  return (
    <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
      <Animated.View style={[styles.loadingSpinner, spinStyle]} />
      <Animated.Text entering={FadeIn.delay(200)} style={[styles.loadingText, { color: theme.textSecondary }]}>Loading CyberFit...</Animated.Text>
    </View>
  );
};

export default function App() {
  const { width } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize app
    const init = async () => {
      try {
        const userData = await getUserData();
        setHasCompletedOnboarding(userData?.hasCompletedOnboarding || false);
        setIsDarkTheme(userData?.isDarkTheme ?? true);
      } catch (e) {}
      setIsReady(true);
    };
    init();
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
    setIsLoading(false);
  };

  const toggleTheme = async () => {
    setIsDarkTheme(prev => !prev);
    try {
      const user = await getUserData();
      if (user) await saveUserData({ ...user, isDarkTheme: !user.isDarkTheme });
    } catch {}
  };

  if (!isReady || showSplash) {
    return (
      <AnimatedSplash onFinish={handleSplashFinish} />
    );
  }

  if (isLoading) {
    return (
      <AnimatedLoading theme={getTheme(isDarkTheme)} />
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'Dashboard': return <ResponsiveDashboard />;
      case 'Workouts': return <WorkoutsScreen />;
      case 'WorkoutHistory': return <WorkoutHistoryScreen />;
      case 'MealHistory': return <MealHistoryScreen />;
      case 'Analytics': return <AnalyticsScreen />;
      case 'Profile': return <ProfileScreen />;
      case 'Settings': return <SettingsScreen />;
      case 'Goals': return <GoalsScreen />;
      default: return <ResponsiveDashboard />;
    }
  };

  if (!hasCompletedOnboarding) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Animated.View entering={FadeIn.duration(300)} style={{ flex: 1, backgroundColor: getTheme(isDarkTheme).background }}>
            <ResponsiveOnboarding onComplete={() => setHasCompletedOnboarding(true)} />
          </Animated.View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  const theme = getTheme(isDarkTheme);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Animated.View 
          entering={FadeIn.duration(400)} 
          style={{ flex: 1, backgroundColor: theme.background }}
        >
          <ResponsiveLayout 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            theme={theme}
            toggleTheme={toggleTheme}
            isDarkTheme={isDarkTheme}
          >
            {renderScreen()}
          </ResponsiveLayout>
        </Animated.View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  // Splash Screen Styles
  splashContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E63946',
    marginBottom: 24,
    shadowColor: '#E63946',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logoIcon: {
    fontSize: 48,
  },
  splashTitle: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  splashSubtitle: {
    color: '#E63946',
    fontSize: 16,
    letterSpacing: 1,
    marginBottom: 40,
  },
  loadingDots: {
    flexDirection: 'row',
  },
  loadingDot: {
    color: '#E63946',
    fontSize: 32,
    marginHorizontal: 2,
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#E63946',
    borderTopColor: 'transparent',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
  },
});