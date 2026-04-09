import React from 'react';
import { View } from 'react-native';
import { EquipmentConditionRow } from './EquipmentConditionRow';
import { equipmentComponents, EquipmentComponentKey } from '@/constants/options';
import { EquipmentConditionMap, EquipmentConditionValue } from '@/types/inspection';

interface EquipmentChecklistProps {
  value: EquipmentConditionMap;
  onChange: (component: EquipmentComponentKey, condition: EquipmentConditionValue) => void;
}

export function EquipmentChecklist({ value, onChange }: EquipmentChecklistProps) {
  return (
    <View>
      {equipmentComponents.map(({ key, label }) => (
        <EquipmentConditionRow
          key={key}
          label={label}
          value={value[key as EquipmentComponentKey]}
          onChange={(v) => onChange(key as EquipmentComponentKey, v as EquipmentConditionValue)}
        />
      ))}
    </View>
  );
}
