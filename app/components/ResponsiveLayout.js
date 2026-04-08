import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

export const ResponsiveLayout = ({ children, activeTab, onTabChange, theme, toggleTheme, isDarkTheme }) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.content, { backgroundColor: theme.background }]}>
        {children}
      </View>
      <View style={[styles.tabBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
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
                { color: activeTab === item.key ? theme.primary : theme.textSecondary }
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
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    paddingBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
  },
});