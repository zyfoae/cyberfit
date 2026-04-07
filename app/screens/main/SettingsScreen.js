import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';
import { User, Scale, Flame, Droplets, Moon, Sun, Bell, Share2, Trash2, Lock, Info } from 'lucide-react-native';
import { getUserData, saveUserData, clearAllData } from '../../utils/storage';

export const SettingsScreen = () => {
  const [userData, setUserData] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [unitsMetric, setUnitsMetric] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadPreferences = useCallback(async () => {
    try {
      const user = await getUserData();
      if (user) {
        setUserData(user);
        setIsDarkTheme(user.isDarkTheme ?? true);
        setNotificationsEnabled(user.notificationsEnabled ?? true);
        setUnitsMetric(user.unitsMetric ?? true);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setDataLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const toggleTheme = async () => {
    setIsDarkTheme(prev => !prev);
    try {
      const user = await getUserData();
      if (user) {
        await saveUserData({
          ...user,
          isDarkTheme: !user.isDarkTheme
        });
      }
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleNotifications = async () => {
    setNotificationsEnabled(prev => !prev);
    try {
      const user = await getUserData();
      if (user) {
        await saveUserData({
          ...user,
          notificationsEnabled: !user.notificationsEnabled
        });
      }
    } catch (error) {
      console.error('Error saving notifications preference:', error);
    }
  };

  const toggleUnits = async () => {
    setUnitsMetric(prev => !prev);
    try {
      const user = await getUserData();
      if (user) {
        await saveUserData({
          ...user,
          unitsMetric: !user.unitsMetric
        });
      }
    } catch (error) {
      console.error('Error saving units preference:', error);
    }
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to delete all your data? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            Alert.alert('Success', 'All data has been cleared. Please restart the app.');
          }
        },
      ]
    );
  };

  const handleExportData = async () => {
    try {
      const user = await getUserData();
      // In a real app, this would export actual data
      Alert.alert(
        'Export Data',
        'Data export functionality would be implemented here.\n\nThis would export your fitness data as a JSON or CSV file.',
        [
          { text: 'OK', style: 'default' }
        ]
      );
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data');
    }
  };

  if (!dataLoaded) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.textSecondary, fontSize: fontSize.body }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.textSecondary, fontSize: fontSize.body }}>No user data found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
          <Text style={{ color: colors.textPrimary, fontSize: fontSize.header, fontWeight: 'bold', marginBottom: spacing.md }}>
            Settings
          </Text>
        </View>

        {/* Appearance Section */}
        <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.lg, marginHorizontal: spacing.lg, marginBottom: spacing.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={{ color: colors.textPrimary, fontSize: fontSize.subheader, fontWeight: '600' }}>
              Appearance
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: colors.textSecondary, fontSize: fontSize.body }}>
                {isDarkTheme ? 'Dark' : 'Light'}
              </Text>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isDarkTheme ? '#f5dd4b' : '#f4f3f4'}
                value={isDarkTheme}
                onValueChange={toggleTheme}
              />
            </View>
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: fontSize.caption, marginTop: spacing.xs }}>
            Choose between dark and light themes
          </Text>
        </View>

        {/* Notifications Section */}
        <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.lg, marginHorizontal: spacing.lg, marginBottom: spacing.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={{ color: colors.textPrimary, fontSize: fontSize.subheader, fontWeight: '600' }}>
              Notifications
            </Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
            />
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: fontSize.caption, marginTop: spacing.xs }}>
            Enable reminders for water, meals, and workouts
          </Text>
        </View>

        {/* Units Section */}
        <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.lg, marginHorizontal: spacing.lg, marginBottom: spacing.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={{ color: colors.textPrimary, fontSize: fontSize.subheader, fontWeight: '600' }}>
              Units
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: colors.textSecondary, fontSize: fontSize.body }}>
                {unitsMetric ? 'Metric' : 'Imperial'}
              </Text>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={unitsMetric ? '#f5dd4b' : '#f4f3f4'}
                value={unitsMetric}
                onValueChange={toggleUnits}
              />
            </View>
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: fontSize.caption, marginTop: spacing.xs }}>
            Switch between metric (kg, cm) and imperial (lbs, inches) units
          </Text>
        </View>

        {/* Data Management Section */}
        <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.lg, marginHorizontal: spacing.lg, marginBottom: spacing.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={{ color: colors.textPrimary, fontSize: fontSize.subheader, fontWeight: '600' }}>
              Data Management
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', marginVertical: spacing.sm }}>
            <TouchableOpacity 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: colors.pureBlack, 
                borderRadius: borderRadius.md, 
                padding: spacing.md, 
                marginRight: spacing.sm,
                borderWidth: 1,
                borderColor: colors.primary
              }}
              onPress={toggleTheme}
            >
              <Moon size={18} color={isDarkTheme ? colors.primary : colors.textSecondary} />
              <Text style={{ marginLeft: spacing.sm, color: colors.textPrimary, fontSize: fontSize.body }}>
                Toggle Theme
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: colors.pureBlack, 
                borderRadius: borderRadius.md, 
                padding: spacing.md, 
                borderWidth: 1,
                borderColor: colors.success
              }}
              onPress={handleExportData}
            >
              <Share2 size={18} color={colors.success} />
              <Text style={{ marginLeft: spacing.sm, color: colors.textPrimary, fontSize: fontSize.body }}>
                Export Data
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={{ 
              backgroundColor: colors.pureBlack, 
              borderRadius: borderRadius.md, 
              padding: spacing.md, 
              marginTop: spacing.md,
              borderWidth: 1,
              borderColor: colors.warning
            }}
            onPress={handleResetData}
          >
            <Trash2 size={18} color={colors.warning} />
            <Text style={{ marginLeft: spacing.sm, color: colors.textPrimary, fontSize: fontSize.body }}>
              Reset All Data
            </Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.lg, marginHorizontal: spacing.lg, marginBottom: spacing.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={{ color: colors.textPrimary, fontSize: fontSize.subheader, fontWeight: '600' }}>
              About
            </Text>
            <Info size={20} color={colors.textSecondary} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: colors.textSecondary, fontSize: fontSize.body }}>
              Version
            </Text>
            <Text style={{ color: colors.textPrimary, fontSize: fontSize.body, fontWeight: '600' }}>
              1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Styles will be added here if needed
});