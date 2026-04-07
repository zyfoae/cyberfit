import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Button } from '../../components/Button';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';
import { getUserData, saveUserData, getWeightHistory, saveWeight, clearAllData } from '../../utils/storage';
import { calculateDailyCalorieGoal, calculateDailyWaterGoal } from '../../utils/calculations';
import { User, Scale, Flame, Droplets, Settings, Trash2, Save } from 'lucide-react-native';

export const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [weightHistory, setWeightHistory] = useState([]);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');

  const loadData = useCallback(async () => {
    const user = await getUserData();
    const history = await getWeightHistory();
    setUserData(user);
    setWeightHistory(history.slice(-5).reverse());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateWeight = async () => {
    const weight = parseFloat(newWeight);
    if (weight < 30 || weight > 300) {
      Alert.alert('Error', 'Please enter a valid weight between 30 and 300 kg');
      return;
    }

    await saveWeight(weight);
    
    if (userData) {
      const updatedUserData = {
        ...userData,
        weight,
        calorieGoal: calculateDailyCalorieGoal(weight, userData.height, userData.age, userData.gender),
        waterGoal: calculateDailyWaterGoal(weight),
      };
      await saveUserData(updatedUserData);
      setUserData(updatedUserData);
    }

    setShowWeightModal(false);
    setNewWeight('');
    loadData();
    Alert.alert('Success', 'Weight updated successfully!');
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
            Alert.alert('Done', 'All data has been cleared. Please restart the app.');
          }
        },
      ]
    );
  };

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <User size={40} color={colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileLabel}>Personal Details</Text>
            <View style={styles.profileRow}>
              <Text style={styles.profileText}>Gender: </Text>
              <Text style={styles.profileValue}>{userData.gender?.toUpperCase()}</Text>
            </View>
            <View style={styles.profileRow}>
              <Text style={styles.profileText}>Age: </Text>
              <Text style={styles.profileValue}>{userData.age} years</Text>
            </View>
            <View style={styles.profileRow}>
              <Text style={styles.profileText}>Height: </Text>
              <Text style={styles.profileValue}>{userData.height} cm</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>Daily Goals</Text>
          
          <View style={styles.goalCard}>
            <View style={styles.goalIcon}>
              <Flame size={24} color={colors.primary} />
            </View>
            <View style={styles.goalInfo}>
              <Text style={styles.goalLabel}>Calories</Text>
              <Text style={styles.goalValue}>{userData.calorieGoal?.toLocaleString()} kcal</Text>
            </View>
          </View>

          <View style={styles.goalCard}>
            <View style={styles.goalIcon}>
              <Droplets size={24} color={colors.primary} />
            </View>
            <View style={styles.goalInfo}>
              <Text style={styles.goalLabel}>Water</Text>
              <Text style={styles.goalValue}>{Math.round(userData.waterGoal / 1000 * 10) / 10} L</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(800).duration(600)} style={styles.weightSection}>
          <Text style={styles.sectionTitle}>Weight Tracking</Text>
          
          <View style={styles.currentWeightCard}>
            <View style={styles.weightInfo}>
              <Text style={styles.weightLabel}>Current Weight</Text>
              <Text style={styles.weightValue}>{userData.weight} kg</Text>
            </View>
            <TouchableOpacity style={styles.updateWeightButton} onPress={() => setShowWeightModal(true)}>
              <Scale size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {weightHistory.length > 0 && (
            <View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>Recent Entries</Text>
              {weightHistory.map((entry, index) => (
                <View key={index} style={styles.historyItem}>
                  <Text style={styles.historyDate}>
                    {new Date(entry.date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.historyWeight}>{entry.weight} kg</Text>
                </View>
              ))}
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1000).duration(600)} style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.dangerButton} onPress={handleResetData}>
            <Trash2 size={20} color={colors.warning} />
            <Text style={styles.dangerButtonText}>Reset All Data</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1200).duration(600)} style={styles.footer}>
          <Text style={styles.footerText}>CyberFit v1.0.0</Text>
          <Text style={styles.footerSubtext}>Your intelligent fitness companion</Text>
        </Animated.View>
      </ScrollView>

      <Modal visible={showWeightModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Weight</Text>
            <TextInput
              style={styles.weightInput}
              value={newWeight}
              onChangeText={setNewWeight}
              placeholder="Enter weight in kg"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <Button 
                title="Cancel" 
                onPress={() => setShowWeightModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button 
                title="Save" 
                onPress={handleUpdateWeight}
                icon={Save}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.header,
    fontWeight: 'bold',
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.pureBlack,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  profileInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  profileLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    marginBottom: spacing.sm,
  },
  profileRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  profileText: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
  },
  profileValue: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
  goalsSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.subheader,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  goalCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.pureBlack,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalInfo: {
    marginLeft: spacing.md,
  },
  goalLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
  },
  goalValue: {
    color: colors.textPrimary,
    fontSize: fontSize.subheader,
    fontWeight: 'bold',
  },
  weightSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  currentWeightCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  weightInfo: {
    flex: 1,
  },
  weightLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
  },
  weightValue: {
    color: colors.primary,
    fontSize: fontSize.title,
    fontWeight: 'bold',
  },
  updateWeightButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyContainer: {
    marginTop: spacing.md,
  },
  historyTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    marginBottom: spacing.sm,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyDate: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
  },
  historyWeight: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
  settingsSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  dangerButtonText: {
    color: colors.warning,
    fontSize: fontSize.body,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingBottom: spacing.xl * 2,
  },
  footerText: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
  footerSubtext: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '80%',
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.subheader,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  weightInput: {
    backgroundColor: colors.pureBlack,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.subheader,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalButton: {
    flex: 1,
  },
});