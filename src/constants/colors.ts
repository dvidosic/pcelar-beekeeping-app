export const colors = {
  primary: '#F59E0B',
  primaryDark: '#D97706',
  primaryLight: '#FDE68A',
  surface: '#FFFBEB',
  background: '#FFF8E1',
  text: '#1C1917',
  textMuted: '#78716C',
  textOnPrimary: '#FFFFFF',
  border: '#E7E5E4',
  borderFocus: '#F59E0B',
  success: '#4CAF50',
  warning: '#FFC107',
  danger: '#F44336',
  dangerLight: '#FFEBEE',
  overlay: 'rgba(0,0,0,0.4)',
  white: '#FFFFFF',
  disabled: '#D6D3D1',
  disabledText: '#A8A29E',
} as const;

export type ColorKey = keyof typeof colors;
