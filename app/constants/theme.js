export const lightTheme = {
  primary: '#E63946',
  secondary: '#9D0208',
  background: '#FFFFFF',
  card: '#F8F9FA',
  pureBlack: '#0A0A0A',
  textPrimary: '#0A0A0A',
  textSecondary: '#6C757D',
  border: '#DEE2E6',
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#E74C3C',
};

export const darkTheme = {
  primary: '#E63946',
  secondary: '#9D0208',
  background: '#0A0A0A',
  card: '#1A1A1A',
  pureBlack: '#000000',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  border: '#333333',
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#E74C3C',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const fontSize = {
  caption: 12,
  body: 14,
  subheader: 18,
  header: 24,
  title: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

export const getTheme = (isDark) => isDark ? darkTheme : lightTheme;