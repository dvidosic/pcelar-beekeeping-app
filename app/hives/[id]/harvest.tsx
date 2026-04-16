import React, { useCallback, useState } from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FAB } from '@/components/ui/FAB';
import { EmptyState } from '@/components/ui/EmptyState';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { HarvestCard } from '@/components/harvest/HarvestCard';
import { HarvestForm } from '@/components/harvest/HarvestForm';
import { showConfirmDialog } from '@/components/ui/ConfirmDialog';

import { useHarvestLogs } from '@/hooks/useHarvestLogs';
import { HoneyHarvest } from '@/types/harvest';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { L } from '@/constants/labels';

export default function HarvestTab() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { harvests, isLoading, refresh, addHarvest, removeHarvest } = useHarvestLogs(id);
  const [sheetVisible, setSheetVisible] = useState(false);

  const handleDelete = useCallback(
    (harvest: HoneyHarvest) => {
      showConfirmDialog({
        title: L.potvrdaBrisanjaVrcanja,
        message: '',
        onConfirm: () => removeHarvest(harvest.id),
      });
    },
    [removeHarvest]
  );

  const handleSubmit = useCallback(
    async (data: Omit<HoneyHarvest, 'id'>) => {
      await addHarvest(data);
      setSheetVisible(false);
    },
    [addHarvest]
  );

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/app-logo.png')}
        style={styles.watermark}
        pointerEvents="none"
      />
      <FlatList
        data={harvests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HarvestCard harvest={item} onDelete={() => handleDelete(item)} />
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
              icon="🍯"
              title={L.praznoVrcanje}
              action={{ label: L.novoVrcanje, onPress: () => setSheetVisible(true) }}
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
        title={L.novoVrcanje}
        snapPoint={0.85}
      >
        <HarvestForm hiveId={id} onSubmit={handleSubmit} />
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
  watermark: {
    position: 'absolute',
    opacity: 0.07,
    width: '70%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    alignSelf: 'center',
    top: '30%',
  },
});
