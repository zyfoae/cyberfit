import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getTheme } from './app/constants/theme';
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

const isWeb = typeof window !== 'undefined';
const Storage = isWeb ? null : null;

const getUserData = async () => {
  if (isWeb) {
    const data = localStorage.getItem('@cyberfit_user_data');
    return data ? JSON.parse(data) : null;
  }
  return null;
};

const saveUserData = async (data) => {
  if (isWeb) {
    localStorage.setItem('@cyberfit_user_data', JSON.stringify(data));
  }
};

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => onFinish(), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.splashContainer}>
      <View style={styles.logoCircle}>
        <Text style={styles.logoIcon}>🏋️</Text>
      </View>
      <Text style={styles.splashTitle}>CyberFit</Text>
      <Text style={styles.splashSubtitle}>Your Fitness Journey</Text>
      <View style={styles.loadingDots}>
        <Text style={styles.loadingDot}>.</Text>
        <Text style={styles.loadingDot}>.</Text>
        <Text style={styles.loadingDot}>.</Text>
      </View>
    </View>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
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

  const handleSplashFinish = () => setShowSplash(false);

  const toggleTheme = async () => {
    setIsDarkTheme(prev => !prev);
    try {
      const user = await getUserData();
      if (user) await saveUserData({ ...user, isDarkTheme: !user.isDarkTheme });
    } catch {}
  };

  if (!isReady || showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
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
          <View style={{ flex: 1, backgroundColor: getTheme(isDarkTheme).background }}>
            <ResponsiveOnboarding onComplete={() => setHasCompletedOnboarding(true)} />
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  const theme = getTheme(isDarkTheme);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: theme.background }}>
          <ResponsiveLayout 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            theme={theme}
            toggleTheme={toggleTheme}
            isDarkTheme={isDarkTheme}
          >
            {renderScreen()}
          </ResponsiveLayout>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
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
});