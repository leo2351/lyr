// Lyra design tokens — dark, cinematic, purple-accented (per design_guidelines.json)
export const colors = {
  bg: {
    void: '#030303',
    surface: '#0F0F0F',
    surfaceElevated: '#1A1A1A',
  },
  brand: {
    primary: '#9D4EDD',
    accent: '#C77DFF',
    storyRingStart: '#9D4EDD',
    storyRingMid: '#FF0080',
    storyRingEnd: '#00E5FF',
  },
  text: {
    primary: '#F8F9FA',
    secondary: '#A1A1AA',
    inverse: '#030303',
    danger: '#FF5A5F',
  },
  border: {
    subtle: '#1F1F1F',
    strong: '#333333',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
} as const;
