export const calculateBMR = (weight, height, age, gender) => {
  if (gender === 'male') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
};

export const calculateDailyCalorieGoal = (weight, height, age, gender) => {
  const bmr = calculateBMR(weight, height, age, gender);
  return Math.round(bmr * 1.375);
};

export const calculateDailyWaterGoal = (weight) => {
  return Math.round(weight * 35);
};

export const formatCalories = (calories) => {
  return calories.toLocaleString();
};

export const formatWater = (ml) => {
  if (ml >= 1000) {
    return `${(ml / 1000).toFixed(1)}L`;
  }
  return `${ml}ml`;
};

export const getLast7DaysData = (dataArray) => {
  const result = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toDateString();
    
    const dayData = dataArray.filter(item => 
      new Date(item.date).toDateString() === dateString
    );
    
    result.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      data: dayData,
    });
  }
  
  return result;
};