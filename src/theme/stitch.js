// Google Health Theme System for U.T.K.U.

export const lightTheme = {
  colors: {
    primary: '#00897B', // Google Health Teal
    primaryVariant: '#00695C', // Darker Teal
    secondary: '#8E24AA', // Purple for AI insights
    background: '#F5F5F6', // Light grayish
    surface: '#FFFFFF',
    error: '#D32F2F', // Alert Red
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#202124',
    onSurface: '#3C4043',
    onSurfaceVariant: '#5F6368',
    outline: '#DADCE0',
  },
  typography: {
    h1: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5 },
    h2: { fontSize: 24, fontWeight: '600', letterSpacing: 0 },
    title: { fontSize: 20, fontWeight: '600', letterSpacing: 0.15 },
    body: { fontSize: 16, fontWeight: '400', letterSpacing: 0.5 },
    label: { fontSize: 14, fontWeight: '500', letterSpacing: 0.1 },
    caption: { fontSize: 12, fontWeight: '400', letterSpacing: 0.4 },
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borders: {
    radius: {
      small: 8,
      medium: 12,
      large: 24,
      pill: 9999,
    },
    width: {
      thin: 1,
      thick: 2,
    }
  },
  shadows: {
    elevation1: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    elevation2: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 3.0,
      elevation: 3,
    }
  }
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    primary: '#4DB6AC', // Light Teal for Dark Mode
    primaryVariant: '#00897B',
    secondary: '#CE93D8', // Light Purple
    background: '#202124', // Google Dark
    surface: '#292A2D', // Elevated Surface
    error: '#EF5350', // Lighter Alert Red
    onPrimary: '#00332E',
    onSecondary: '#3B0059',
    onBackground: '#E8EAED',
    onSurface: '#E8EAED',
    onSurfaceVariant: '#9AA0A6',
    outline: '#5F6368',
  },
};

export const getStitchTheme = (colorScheme) => {
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};
