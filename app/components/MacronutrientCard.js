import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

export const MacronutrientCard = ({ current, goals }) => {
  const macros = [
    { label: 'Protein', current: current.protein, goal: goals.protein, color: '#E63946' },
    { label: 'Carbs', current: current.carbs, goal: goals.carbs, color: '#F39C12' },
    { label: 'Fat', current: current.fat, goal: goals.fat, color: '#2ECC71' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Macronutrients</Text>
      
      <View style={styles.macrosRow}>
        {macros.map((macro, index) => {
          const percentage = Math.min((macro.current / macro.goal) * 100, 100);
          
          return (
            <View key={index} style={styles.macroItem}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroLabel}>{macro.label}</Text>
                <Text style={styles.macroValue}>
                  {macro.current}g / {macro.goal}g
                </Text>
              </View>
              
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${percentage}%`,
                      backgroundColor: macro.color,
                    }
                  ]} 
                />
              </View>
              
              <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.subheader,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  macrosRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  macroItem: {
    flex: 1,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  macroLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
  },
  macroValue: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.pureBlack,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.round,
  },
  percentageText: {
    color: colors.textSecondary,
    fontSize: 10,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});