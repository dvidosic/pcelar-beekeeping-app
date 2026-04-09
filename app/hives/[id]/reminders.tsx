import React, { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FAB } from '@/components/ui/FAB';
import { EmptyState } from '@/components/ui/EmptyState';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { ReminderCard } from '@/components/reminders/ReminderCard';
import { ReminderForm } from '@/components/reminders/ReminderForm';
import { showConfirmDialog } from '@/components/ui/ConfirmDialog';

import { useReminders } from '@/hooks/useReminders';
import { Reminder } from '@/types/reminder';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { L } from '@/constants/labels';

export default function RemindersTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { reminders, isLoading, refresh, addReminder, completeReminder, removeReminder } =
    useReminders(id);
  const [sheetVisible, setSheetVisible] = useState(false);

  const handleDelete = useCallback(
    (reminder: Reminder) => {
      showConfirmDialog({
        title: L.potvrdaBrisanjaPodsjetnika,
        message: reminder.description,
        onConfirm: () => removeReminder(reminder.id),
      });
    },
    [removeReminder]
  );

  const handleSubmit = useCallback(
    async (description: string, remindAt: Date) => {
      await addReminder(description, remindAt);
      setSheetVisible(false);
    },
    [addReminder]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReminderCard
            reminder={item}
            onComplete={() => completeReminder(item.id)}
            onDelete={() => handleDelete(item)}
          />
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 80 },
        ]}
        onRefresh={refresh}
        refreshing={isLoading}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon="🔔"
              title={L.prazniPodsjetnici}
              action={{ label: L.noviPodsjetnik, onPress: () => setSheetVisible(true) }}
            />
          ) : null
        }
      />

      <FAB
        onPress={() => setSheetVisible(true)}
        style={{ bottom: insets.bottom + spacing.base }}
      />

      <BottomSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        title={L.noviPodsjetnik}
        snapPoint={0.6}
      >
        <ReminderForm onSubmit={handleSubmit} />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingTop: spacing.md,
  },
});
