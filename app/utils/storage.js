import AsyncStorage from '@react-native-async-storage/async-storage';

const isWeb = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const KEYS = {
  USER_DATA: '@cyberfit_user_data',
  FOOD_LOGS: '@cyberfit_food_logs',
  WATER_LOGS: '@cyberfit_water_logs',
  WORKOUT_LOGS: '@cyberfit_workout_logs',
  WEIGHT_HISTORY: '@cyberfit_weight_history',
  STREAKS: '@cyberfit_streaks',
  ACHIEVEMENTS: '@cyberfit_achievements',
  MACROS_GOALS: '@cyberfit_macros_goals',
};

const setItem = (key, value) => {
  if (isWeb) {
    localStorage.setItem(key, value);
  } else {
    AsyncStorage.setItem(key, value);
  }
};

const getItem = async (key) => {
  if (isWeb) {
    return localStorage.getItem(key);
  }
  return AsyncStorage.getItem(key);
};

export const saveUserData = async (data) => {
  try {
    setItem(KEYS.USER_DATA, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const getUserData = async () => {
  try {
    const data = await getItem(KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const saveFoodLog = async (foodEntry) => {
  try {
    const existingLogs = await getFoodLogs();
    existingLogs.push({ ...foodEntry, date: new Date().toISOString() });
    setItem(KEYS.FOOD_LOGS, JSON.stringify(existingLogs));
    await updateStreak('foodLog');
  } catch (error) {
    console.error('Error saving food log:', error);
  }
};

export const getFoodLogs = async () => {
  try {
    const logs = await getItem(KEYS.FOOD_LOGS);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('Error getting food logs:', error);
    return [];
  }
};

export const saveWaterLog = async (amount) => {
  try {
    const existingLogs = await getWaterLogs();
    existingLogs.push({ amount, date: new Date().toISOString() });
    setItem(KEYS.WATER_LOGS, JSON.stringify(existingLogs));
    await updateStreak('waterLog');
  } catch (error) {
    console.error('Error saving water log:', error);
  }
};

export const getWaterLogs = async () => {
  try {
    const logs = await getItem(KEYS.WATER_LOGS);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('Error getting water logs:', error);
    return [];
  }
};

export const getTodayWaterTotal = async () => {
  const logs = await getWaterLogs();
  const today = new Date().toDateString();
  return logs
    .filter(log => new Date(log.date).toDateString() === today)
    .reduce((sum, log) => sum + log.amount, 0);
};

export const saveWorkoutLog = async (workoutEntry) => {
  try {
    const existingLogs = await getWorkoutLogs();
    existingLogs.push({ ...workoutEntry, date: new Date().toISOString() });
    setItem(KEYS.WORKOUT_LOGS, JSON.stringify(existingLogs));
    await updateStreak('workout');
  } catch (error) {
    console.error('Error saving workout log:', error);
  }
};

export const getWorkoutLogs = async () => {
  try {
    const logs = await getItem(KEYS.WORKOUT_LOGS);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('Error getting workout logs:', error);
    return [];
  }
};

export const saveWeight = async (weight) => {
  try {
    const history = await getWeightHistory();
    history.push({ weight, date: new Date().toISOString() });
    setItem(KEYS.WEIGHT_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving weight:', error);
  }
};

export const getWeightHistory = async () => {
  try {
    const history = await getItem(KEYS.WEIGHT_HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting weight history:', error);
    return [];
  }
};

export const getTodayCalories = async () => {
  const logs = await getFoodLogs();
  const today = new Date().toDateString();
  return logs
    .filter(log => new Date(log.date).toDateString() === today)
    .reduce((sum, log) => sum + (log.calories || 0), 0);
};

export const getTodayMacros = async () => {
  const logs = await getFoodLogs();
  const today = new Date().toDateString();
  const todayLogs = logs.filter(log => new Date(log.date).toDateString() === today);
  
  return todayLogs.reduce((acc, log) => ({
    protein: acc.protein + (log.protein || 0),
    carbs: acc.carbs + (log.carbs || 0),
    fat: acc.fat + (log.fat || 0),
  }), { protein: 0, carbs: 0, fat: 0 });
};

export const saveMacrosGoals = async (goals) => {
  try {
    setItem(KEYS.MACROS_GOALS, JSON.stringify(goals));
  } catch (error) {
    console.error('Error saving macros goals:', error);
  }
};

export const getMacrosGoals = async () => {
  try {
    const goals = await getItem(KEYS.MACROS_GOALS);
    return goals ? JSON.parse(goals) : { protein: 150, carbs: 200, fat: 65 };
  } catch (error) {
    console.error('Error getting macros goals:', error);
    return { protein: 150, carbs: 200, fat: 65 };
  }
};

const updateStreak = async (type) => {
  try {
    const streaks = await getStreaks();
    const today = new Date().toDateString();
    
    if (streaks.lastActivityDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (streaks.lastActivityDate === yesterday.toDateString()) {
        streaks.currentStreak += 1;
      } else if (streaks.lastActivityDate !== today) {
        streaks.currentStreak = 1;
      }
      
      streaks.lastActivityDate = today;
      streaks.totalDays += 1;
      
      if (type === 'workout') {
        streaks.workoutStreak = Math.max(streaks.workoutStreak || 0, streaks.currentStreak);
      }
      
      setItem(KEYS.STREAKS, JSON.stringify(streaks));
    }
  } catch (error) {
    console.error('Error updating streak:', error);
  }
};

export const getStreaks = async () => {
  try {
    const streaks = await getItem(KEYS.STREAKS);
    return streaks ? JSON.parse(streaks) : {
      currentStreak: 0,
      workoutStreak: 0,
      totalDays: 0,
      lastActivityDate: null,
    };
  } catch (error) {
    console.error('Error getting streaks:', error);
    return { currentStreak: 0, workoutStreak: 0, totalDays: 0, lastActivityDate: null };
  }
};

export const getAchievements = async () => {
  try {
    const achievements = await getItem(KEYS.ACHIEVEMENTS);
    return achievements ? JSON.parse(achievements) : [];
  } catch (error) {
    console.error('Error getting achievements:', error);
    return [];
  }
};

export const unlockAchievement = async (achievement) => {
  try {
    const achievements = await getAchievements();
    const alreadyUnlocked = achievements.find(a => a.id === achievement.id);
    
    if (!alreadyUnlocked) {
      achievements.push({
        ...achievement,
        unlockedAt: new Date().toISOString(),
      });
      setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    }
  } catch (error) {
    console.error('Error unlocking achievement:', error);
  }
};

export const clearAllData = async () => {
  try {
    if (isWeb) {
      Object.values(KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } else {
      await AsyncStorage.multiRemove(Object.values(KEYS));
    }
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};