import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { Home, Dumbbell, BarChart2, User, Menu, Moon, Sun, History, Apple, Target } from 'lucide-react-native';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

const NAV_ITEMS = [
  { key: 'Dashboard', label: 'Dashboard', icon: Home },
  { key: 'Workouts', label: 'Workouts', icon: Dumbbell },
  { key: 'WorkoutHistory', label: 'History', icon: History },
  { key: 'MealHistory', label: 'Meals', icon: Apple },
  { key: 'Analytics', label: 'Analytics', icon: BarChart2 },
  { key: 'Profile', label: 'Profile', icon: User },
  { key: 'Goals', label: 'Goals', icon: Target },
  { key: 'Settings', label: 'Settings', icon: Menu },
];

const DESKTOP_NAV_ITEMS = [
  { key: 'Dashboard', label: 'Dashboard', icon: Home },
  { key: 'Workouts', label: 'Workouts', icon: Dumbbell },
  { key: 'WorkoutHistory', label: 'Workout History', icon: History },
  { key: 'MealHistory', label: 'Meal History', icon: Apple },
  { key: 'Analytics', label: 'Analytics', icon: BarChart2 },
  { key: 'Profile', label: 'Profile', icon: User },
  { key: 'Goals', label: 'Goals', icon: Target },
  { key: 'Settings', label: 'Settings', icon: Menu },
];

export const ResponsiveLayout = ({ children, activeTab, onTabChange, theme, toggleTheme, isDarkTheme }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  if (isDesktop) {
    return (
      <View style={[styles.desktopContainer, { backgroundColor: theme.background }]}>
        <View style={[styles.desktopSidebar, { backgroundColor: theme.card }]}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>CyberFit</Text>
          </View>
          <View style={styles.navItems}>
            {DESKTOP_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.navItem,
                    activeTab === item.key && styles.navItemActive,
                  ]}
                  onPress={() => onTabChange(item.key)}
                >
                  <Icon 
                    size={20} 
                    color={activeTab === item.key ? theme.primary : theme.textSecondary} 
                  />
                  <Text style={[
                    styles.navLabel,
                    activeTab === item.key && styles.navLabelActive,
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {/* Theme toggle at bottom of sidebar */}
          <View style={styles.themeToggle}>
            <TouchableOpacity onPress={toggleTheme} style={styles.themeToggleButton}>
              {isDarkTheme ? <Moon size={20} color={theme.textSecondary} /> : <Sun size={20} color={theme.textSecondary} />}
              <Text style={[styles.themeToggleText, { color: theme.textSecondary }]}>Dark Mode</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.desktopContent, { backgroundColor: theme.background }]}>
          {children}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.mobileContainer, { backgroundColor: theme.background }]}>
      <View style={styles.mobileContent}>
        {children}
      </View>
      <View style={[styles.mobileTabBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={item.key}
              style={styles.tabItem}
              onPress={() => onTabChange(item.key)}
            >
              <Icon 
                size={22} 
                color={activeTab === item.key ? theme.primary : theme.textSecondary} 
              />
              <Text style={[
                styles.tabLabel,
                activeTab === item.key && styles.tabLabelActive,
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  desktopSidebar: {
    width: 240,
    paddingTop: spacing.xl,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  logoContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.lg,
  },
  logoText: {
    fontSize: fontSize.title,
    fontWeight: 'bold',
  },
  navItems: {
    paddingHorizontal: spacing.md,
    flexGrow: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  navItemActive: {
    backgroundColor: colors.pureBlack,
  },
  navLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    marginLeft: spacing.md,
  },
  navLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  desktopContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  mobileContainer: {
    flex: 1,
  },
  mobileContent: {
    flex: 1,
  },
  mobileTabBar: {
    flexDirection: 'row',
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  tabLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  tabLabelActive: {
    fontWeight: '600',
  },
  themeToggle: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  themeToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggleText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.body,
  },
});