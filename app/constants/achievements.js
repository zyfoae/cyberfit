export const ACHIEVEMENTS_LIST = [
  {
    id: 'first_workout',
    title: 'First Steps',
    description: 'Complete your first workout',
    icon: '🏃',
    requirement: { type: 'workouts', count: 1 },
  },
  {
    id: 'workout_7',
    title: 'Week Warrior',
    description: 'Complete 7 workouts',
    icon: '💪',
    requirement: { type: 'workouts', count: 7 },
  },
  {
    id: 'workout_30',
    title: 'Monthly Master',
    description: 'Complete 30 workouts',
    icon: '🏆',
    requirement: { type: 'workouts', count: 30 },
  },
  {
    id: 'streak_3',
    title: 'On Fire',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    requirement: { type: 'streak', count: 3 },
  },
  {
    id: 'streak_7',
    title: 'Week Streak',
    description: 'Maintain a 7-day streak',
    icon: '⚡',
    requirement: { type: 'streak', count: 7 },
  },
  {
    id: 'streak_30',
    title: 'Monthly Momentum',
    description: 'Maintain a 30-day streak',
    icon: '🌟',
    requirement: { type: 'streak', count: 30 },
  },
  {
    id: 'water_hero',
    title: 'Hydration Hero',
    description: 'Meet water goal 7 days in a row',
    icon: '💧',
    requirement: { type: 'water_streak', count: 7 },
  },
  {
    id: 'calorie_tracker',
    title: 'Calorie Conscious',
    description: 'Log 100 meals',
    icon: '🍎',
    requirement: { type: 'meals', count: 100 },
  },
  {
    id: 'weight_loss_5',
    title: 'Shedding Pounds',
    description: 'Lose 5kg (11lbs)',
    icon: '📉',
    requirement: { type: 'weight_loss', count: 5 },
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Log a workout before 8am',
    icon: '🌅',
    requirement: { type: 'early_workout', count: 1 },
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Log a workout after 9pm',
    icon: '🦉',
    requirement: { type: 'late_workout', count: 1 },
  },
  {
    id: 'variety_master',
    title: 'Variety Master',
    description: 'Try all 4 muscle groups in one week',
    icon: '🎯',
    requirement: { type: 'muscle_groups', count: 4 },
  },
];

export const checkAchievements = async (stats) => {
  const unlocked = [];
  
  for (const achievement of ACHIEVEMENTS_LIST) {
    const { type, count } = achievement.requirement;
    
    let isUnlocked = false;
    
    switch (type) {
      case 'workouts':
        isUnlocked = stats.totalWorkouts >= count;
        break;
      case 'streak':
        isUnlocked = stats.currentStreak >= count;
        break;
      case 'water_streak':
        isUnlocked = stats.waterStreak >= count;
        break;
      case 'meals':
        isUnlocked = stats.totalMeals >= count;
        break;
      case 'weight_loss':
        isUnlocked = stats.weightLoss >= count;
        break;
      case 'muscle_groups':
        isUnlocked = stats.uniqueMuscleGroups >= count;
        break;
      case 'early_workout':
      case 'late_workout':
        isUnlocked = true;
        break;
    }
    
    if (isUnlocked) {
      unlocked.push(achievement);
    }
  }
  
  return unlocked;
};