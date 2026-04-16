import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/spacing';

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  style?: ViewStyle;
  wrap?: boolean;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  disabled,
  style,
  wrap,
}: SegmentedControlProps<T>) {
  return (
    <View style={[styles.container, wrap && styles.containerWrap, style]}>
      {options.map((opt, index) => {
        const selected = opt.value === value;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.segment,
              wrap && styles.segmentWrap,
              selected ? styles.selected : styles.unselected,
              isFirst && styles.firstSegment,
              isLast && styles.lastSegment,
              disabled && styles.disabled,
            ]}
            onPress={() => !disabled && onChange(opt.value)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            <Text
              style={[
                styles.label,
                selected ? styles.labelSelected : styles.labelUnselected,
                disabled && styles.labelDisabled,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: radius.sm,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  containerWrap: {
    flexWrap: 'wrap',
  },
  segment: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  selected: {
    backgroundColor: colors.primary,
  },
  unselected: {
    backgroundColor: colors.white,
  },
  segmentWrap: {
    flex: 0,
    width: '33.33%',
  },
  firstSegment: {
    // outer radius already on container
  },
  lastSegment: {
    // outer radius already on container
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  labelSelected: {
    color: colors.textOnPrimary,
  },
  labelUnselected: {
    color: colors.text,
  },
  labelDisabled: {
    color: colors.disabledText,
  },
});
