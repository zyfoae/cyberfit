import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';
import { getFoodLogs } from '../../utils/storage';
import { Apple, Calendar, Flame, ChevronRight } from 'lucide-react-native';

export const MealHistoryScreen = () => {
  const [meals, setMeals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const loadMeals = useCallback(async () => {
    const logs = await getFoodLogs();
    const sortedLogs = logs.sort((a, b) => new Date(b.date) - new Date(a.date));
    setMeals(sortedLogs);
  }, []);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  const groupMealsByDate = () => {
    const grouped = {};
    
    meals.forEach(meal => {
      const dateKey = new Date(meal.date).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(meal);
    });
    
    return Object.entries(grouped).map(([date, items]) => {
      const totalCalories = items.reduce((sum, meal) => sum + (meal.calories || 0), 0);
      return {
        date,
        displayDate: formatDate(items[0].date),
        meals: items,
        totalCalories,
      };
    });
  };

  const groupByDate = groupMealsByDate();

  const selectedDayMeals = selectedDate 
    ? meals.filter(m => new Date(m.date).toDateString() === selectedDate)
    : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Meal History</Text>
          <Text style={styles.subtitle}>{meals.length} meals logged</Text>
        </View>

        {meals.length === 0 ? (
          <View style={styles.emptyState}>
            <Apple size={48} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Meals Logged</Text>
            <Text style={styles.emptyText}>
              Add your first meal to see it here
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {groupByDate.map((group) => (
              <View key={group.date} style={styles.dateGroup}>
                <TouchableOpacity 
                  style={styles.dateHeader}
                  onPress={() => setSelectedDate(selectedDate === group.date ? null : group.date)}
                >
                  <View style={styles.dateHeaderLeft}>
                    <Calendar size={16} color={colors.primary} />
                    <Text style={styles.dateText}>{group.displayDate}</Text>
                  </View>
                  <View style={styles.dateHeaderRight}>
                    <Flame size={14} color={colors.primary} />
                    <Text style={styles.caloriesText}>{group.totalCalories} cal</Text>
                    <ChevronRight 
                      size={20} 
                      color={colors.textSecondary}
                      style={{ 
                        transform: [{ rotate: selectedDate === group.date ? '90deg' : '0deg' }]
                      }} 
                    />
                  </View>
                </TouchableOpacity>
                
                {selectedDate === group.date && (
                  <View style={styles.mealsList}>
                    {group.meals.map((meal, index) => (
                      <View key={index} style={styles.mealItem}>
                        <View style={styles.mealInfo}>
                          <Text style={styles.mealName}>{meal.name || 'Meal'}</Text>
                          <Text style={styles.mealTime}>{formatTime(meal.date)}</Text>
                        </View>
                        <View style={styles.mealMacros}>
                          <Text style={styles.mealCalories}>{meal.calories || 0} cal</Text>
                          {meal.protein > 0 && (
                            <Text style={styles.macroText}>
                              P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g
                            </Text>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    marginTop: spacing.xs,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.subheader,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  dateGroup: {
    marginBottom: spacing.md,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  caloriesText: {
    color: colors.primary,
    fontSize: fontSize.caption,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  mealsList: {
    marginTop: spacing.sm,
    paddingLeft: spacing.md,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.pureBlack,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
  },
  mealTime: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    marginTop: 2,
  },
  mealMacros: {
    alignItems: 'flex-end',
  },
  mealCalories: {
    color: colors.primary,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
  macroText: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
});