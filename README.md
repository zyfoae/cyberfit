# CyberFit - Complete Documentation

## Overview

**CyberFit** is a comprehensive fitness tracking web application built with React Native (Expo) featuring a Cyber-Noir aesthetic with a dark red and black color palette. The app runs on both mobile and web platforms.

---

## Project Structure

```
CyberFit/
├── App.js                    # Main application entry point
├── index.js                  # Expo entry point
├── app.json                  # Expo configuration
├── package.json              # Dependencies and scripts
├── babel.config.js           # Babel configuration for reanimated
├── vercel.json               # Vercel deployment configuration
├── index.js                  # Web entry file
├── assets/                   # Images, icons, splash screen
│   ├── icon.png
│   ├── favicon.png
│   ├── splash-icon.png
│   └── adaptive-icon.png
├── app/
│   ├── components/           # Reusable UI components
│   │   ├── ResponsiveLayout.js
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── ExerciseCard.js
│   │   ├── ProgressRing.js
│   │   ├── WaveAnimation.js
│   │   ├── WorkoutTimer.js
│   │   ├── MacronutrientCard.js
│   │   ├── StreakCard.js
│   │   └── WeeklySummaryCard.js
│   ├── constants/             # Theme and configuration
│   │   ├── theme.js          # Dark/Light themes, colors, spacing
│   │   └── achievements.js   # Achievement badges system
│   ├── screens/               # Application screens
│   │   ├── onboarding/        # Onboarding flow
│   │   │   ├── ResponsiveOnboarding.js
│   │   │   ├── WelcomeScreen.js
│   │   │   ├── GenderScreen.js
│   │   │   ├── AgeScreen.js
│   │   │   ├── HeightScreen.js
│   │   │   ├── WeightScreen.js
│   │   │   └── GoalsScreen.js
│   │   └── main/              # Main app screens
│   │       ├── ResponsiveDashboard.js
│   │       ├── DashboardScreen.js
│   │       ├── WorkoutsScreen.js
│   │       ├── WorkoutHistoryScreen.js
│   │       ├── MealHistoryScreen.js
│   │       ├── AnalyticsScreen.js
│   │       ├── ProfileScreen.js
│   │       ├── SettingsScreen.js
│   │       └── GoalsScreen.js
│   └── utils/                 # Utility functions
│       ├── storage.js         # AsyncStorage with web fallback
│       └── calculations.js    # Mifflin-St Jeor formulas
└── node_modules/              # Dependencies
```

---

## Technology Stack

- **Framework**: Expo SDK 54 (React Native)
- **Language**: JavaScript/React
- **Navigation**: React Navigation v7
- **Storage**: AsyncStorage (with localStorage fallback for web)
- **Animations**: React Native Reanimated v3
- **Icons**: Lucide React Native
- **Charts**: React Native Chart Kit
- **Target Platforms**: iOS, Android, Web (responsive)

---

## Color Palette (Cyber-Noir Theme)

### Dark Theme (Default)
| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary | `#E63946` | Accent, buttons, highlights |
| Secondary | `#9D0208` | Secondary accents |
| Background | `#0A0A0A` | Main background |
| Card | `#1A1A1A` | Card backgrounds |
| Pure Black | `#000000` | Deep backgrounds |
| Text Primary | `#FFFFFF` | Main text |
| Text Secondary | `#A0A0A0` | Secondary text |
| Border | `#333333` | Borders and dividers |
| Success | `#2ECC71` | Success states |
| Warning | `#F39C12` | Warning states |
| Error | `#E74C3C` | Error states |

### Light Theme
| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary | `#E63946` | Accent, buttons |
| Background | `#FFFFFF` | Main background |
| Card | `#F8F9FA` | Card backgrounds |
| Text Primary | `#0A0A0A` | Main text |
| Text Secondary | `#6C757D` | Secondary text |
| Border | `#DEE2E6` | Borders |

---

## Features

### 1. Onboarding Flow (6 Steps)

**Step 1: Welcome Screen**
- App logo and name display
- Brief description of features
- "Begin Your Journey" button to start

**Step 2: Gender Selection**
- Options: Male, Female, Other
- Affects BMR calculation
- Visual icons for each option

**Step 3: Age Input**
- Numeric input field
- Validation: 15-100 years
- Shows error for invalid input

**Step 4: Height Input**
- Numeric input in cm
- Validation: 100-250 cm

**Step 5: Weight Input**
- Numeric input in kg
- Validation: 30-300 kg

**Step 6: Goals Display**
- Shows calculated daily calorie goal
- Shows calculated daily water goal
- "Start My Journey" button to complete

### 2. Calorie Tracking

- **Daily Calorie Goal**: Calculated using Mifflin-St Jeor formula
- **Food Logging**: Add meals with calories and macros
- **Progress Ring**: Visual circular progress indicator
- **History**: View past food entries

### 3. Water Tracking

- **Daily Water Goal**: 35ml per kg of body weight
- **Quick Add**: Add water in preset amounts (250ml, 500ml)
- **Wave Animation**: Visual water level indicator
- **Progress Bar**: Daily progress towards goal

### 4. Workout Logging

- **Muscle Groups**:
  - Back/Biceps
  - Chest/Triceps
  - Shoulders
  - Legs
- **Workout Timer**: Rest timer with presets (30s, 60s, 90s, 120s)
- **History**: View past workouts with dates

### 5. Macronutrient Tracking

- **Macros**: Protein, Carbs, Fat
- **Goals**: Customizable daily targets (default: 150P, 200C, 65F)
- **Visual Cards**: Progress bars for each macro

### 6. Analytics & Charts

- **7-Day Charts**: Visual representation of:
  - Calorie intake
  - Water consumption
  - Workout frequency
- **Weekly Summary**: Insights and statistics

### 7. Streak Tracking

- **Current Streak**: Consecutive days of activity
- **Workout Streak**: Consecutive workout days
- **Total Days**: Total active days

### 8. Profile & Settings

- **Profile**: User information display
- **Theme Toggle**: Dark/Light mode switch
- **Goals Adjustment**: Modify calorie and water goals
- **Activity Level**: Sedentary, Light, Moderate, Active, Very Active

---

## Calculations

### Mifflin-St Jeor Formula

**For Men:**
```
BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
```

**For Women:**
```
BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
```

**Daily Calorie Goal:**
```
Calorie Goal = BMR × 1.375 (Moderate activity)
```

### Water Goal
```
Water Goal (ml) = weight (kg) × 35
```

---

## Storage System

### Web (localStorage)
```javascript
localStorage.setItem('@cyberfit_user_data', JSON.stringify(data));
localStorage.getItem('@cyberfit_user_data');
```

### Mobile (AsyncStorage)
```javascript
AsyncStorage.setItem('@cyberfit_user_data', JSON.stringify(data));
AsyncStorage.getItem('@cyberfit_user_data');
```

### Storage Keys
| Key | Data |
|-----|------|
| `@cyberfit_user_data` | User profile, preferences |
| `@cyberfit_food_logs` | Food entries with calories/macros |
| `@cyberfit_water_logs` | Water intake entries |
| `@cyberfit_workout_logs` | Workout entries |
| `@cyberfit_weight_history` | Weight tracking history |
| `@cyberfit_streaks` | Streak data |
| `@cyberfit_macros_goals` | Custom macro goals |
| `@cyberfit_achievements` | Unlocked achievements |

---

## Responsive Design

### Mobile Layout
- Bottom tab navigation with 8 tabs
- Tab bar shows icon + label
- Full-screen content area

### Desktop Layout (≥768px)
- Sidebar navigation (240px width)
- Logo at top of sidebar
- Theme toggle at bottom
- Main content area with padding

---

## Navigation Structure

```
Main App
├── Onboarding (if not completed)
│   └── 6-step flow → Complete
│
└── Main App (after onboarding)
    ├── Dashboard (default)
    ├── Workouts
    ├── Workout History
    ├── Meal History
    ├── Analytics
    ├── Profile
    ├── Goals
    └── Settings
```

---

## Deployment

### Vercel Configuration (vercel.json)
```json
{
  "buildCommand": "npx expo export --platform web --output-dir dist",
  "outputDirectory": "dist",
  "installCommand": "npm install --legacy-peer-deps",
  "devCommand": "npx expo start --web"
}
```

### Build Command
```bash
npx expo export --platform web
```

### Output
- `dist/` folder contains:
  - `index.html` - Entry HTML file
  - `_expo/static/js/web/` - Bundled JavaScript
  - `favicon.ico` - Favicon
  - `metadata.json` - Build metadata

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| expo | ~54.0.33 | Framework |
| react | 19.1.0 | UI library |
| react-native | 0.81.5 | Mobile framework |
| react-native-web | ^0.21.0 | Web rendering |
| @react-navigation/native | ^7.2.2 | Navigation |
| @react-navigation/bottom-tabs | ^7.15.9 | Tab navigation |
| @react-navigation/stack | ^7.8.9 | Stack navigation |
| @react-native-async-storage/async-storage | 2.1.0 | Data persistence |
| react-native-reanimated | ~3.16.0 | Animations |
| react-native-gesture-handler | ~2.28.0 | Gestures |
| react-native-safe-area-context | ~5.6.0 | Safe area handling |
| react-native-screens | ~4.16.0 | Native screens |
| react-native-svg | 15.12.1 | SVG support |
| react-native-chart-kit | ^6.12.0 | Charts |
| lucide-react-native | ^1.7.0 | Icons |

---

## Known Issues & Solutions

1. **White Screen on Web**
   - Cause: useWindowDimensions hook issues
   - Solution: Simplified ResponsiveLayout to always use mobile layout

2. **AsyncStorage on Web**
   - Cause: AsyncStorage doesn't work in browser
   - Solution: localStorage fallback implementation

3. **Reanimated v4 Compatibility**
   - Cause: Missing react-native-worklets dependency
   - Solution: Downgraded to v3.16.0

4. **Expo Export Hanging**
   - Cause: Metro bundler doesn't exit after export
   - Solution: Use CI=1 flag or accept exit code 0 after timeout

---

## File Descriptions

### App.js
- Main entry point
- Splash screen with 2-second display
- State management for tabs, theme, onboarding
- Routing logic based on onboarding completion
- Simple storage functions for web compatibility

### app/constants/theme.js
- Color definitions for dark/light themes
- Spacing scale (xs, sm, md, lg, xl)
- Font size definitions
- Border radius values
- `getTheme()` function to switch themes

### app/utils/storage.js
- Complete storage abstraction
- Web: localStorage
- Mobile: AsyncStorage
- Functions for all data types

### app/utils/calculations.js
- BMR calculation
- Calorie goal calculation
- Water goal calculation
- Data formatting utilities
- Last 7 days data aggregation

### app/components/ResponsiveLayout.js
- Mobile: Bottom tab bar
- Desktop: Sidebar navigation
- Theme toggle integration

### app/screens/onboarding/ResponsiveOnboarding.js
- 6-step form wizard
- Validation for each step
- Auto-calculation of goals
- localStorage save on completion

### app/screens/main/ResponsiveDashboard.js
- Dashboard with summary cards
- Calorie progress ring
- Water tracker
- Quick action buttons

---

## Future Enhancements

1. **Social Features**: Friend challenges, leaderboards
2. **AI Recommendations**: Personalized workout suggestions
3. **Wearable Integration**: Apple Watch, Fitbit sync
4. **Offline Mode**: Full offline functionality
5. **Push Notifications**: Reminders and motivation
6. **Meal Scanner**: Camera-based food recognition
7. **Exercise Library**: Video demonstrations
8. **Progress Photos**: Before/after tracking

---

## Credits

- **Framework**: Expo (React Native)
- **Design**: Cyber-Noir aesthetic
- **Formula**: Mifflin-St Jeor for BMR calculation
- **Icons**: Lucide Icons

---

## License

Private - All rights reserved