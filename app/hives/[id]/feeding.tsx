import React, { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FAB } from '@/components/ui/FAB';
import { EmptyState } from '@/components/ui/EmptyState';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { FeedingCard } from '@/components/feeding/FeedingCard';
import { FeedingForm } from '@/components/feeding/FeedingForm';
import { showConfirmDialog } from '@/components/ui/ConfirmDialog';

import { useFeedingLogs } from '@/hooks/useFeedingLogs';
import { Feeding } from '@/types/feeding';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { L } from '@/constants/labels';

export default function FeedingTab() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { feedings, isLoading, refresh, addFeeding, removeFeeding } = useFeedingLogs(id);
  const [sheetVisible, setSheetVisible] = useState(false);

  const handleDelete = useCallback(
    (feeding: Feeding) => {
      showConfirmDialog({
        title: L.potvrdaBrisanjaPrihranjivanja,
        message: '',
        onConfirm: () => removeFeeding(feeding.id),
      });
    },
    [removeFeeding]
  );

  const handleSubmit = useCallback(
    async (data: Omit<Feeding, 'id'>) => {
      await addFeeding(data);
      setSheetVisible(false);
    },
    [addFeeding]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={feedings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FeedingCard feeding={item} onDelete={() => handleDelete(item)} />
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
              icon="🌿"
              title={L.praznoPrihranjivanje}
              action={{ label: L.novoPrihranjivanje, onPress: () => setSheetVisible(true) }}
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
        title={L.novoPrihranjivanje}
        snapPoint={0.85}
      >
        <FeedingForm hiveId={id} onSubmit={handleSubmit} />
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
