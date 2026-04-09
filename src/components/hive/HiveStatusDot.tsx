import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HiveStatus } from '@/types/hive';
import { colors } from '@/constants/colors';

const statusColors: Record<HiveStatus, string> = {
  healthy: colors.success,
  warning: colors.warning,
  danger: colors.danger,
  unknown: '#B0A89E',
};

interface HiveStatusDotProps {
  status: HiveStatus;
  size?: number;
}

export function HiveStatusDot({ status, size = 12 }: HiveStatusDotProps) {
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: statusColors[status],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
});
