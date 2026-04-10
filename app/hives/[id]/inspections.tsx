import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FAB } from '@/components/ui/FAB';
import { EmptyState } from '@/components/ui/EmptyState';
import { InspectionCard } from '@/components/inspection/InspectionCard';
import { InspectionSummaryBar } from '@/components/inspection/InspectionSummaryBar';
import { showConfirmDialog } from '@/components/ui/ConfirmDialog';

import { useInspections } from '@/hooks/useInspections';
import { Inspection } from '@/types/inspection';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { L } from '@/constants/labels';

export default function InspectionsTab() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { inspections, isLoading, refresh, removeInspection } = useInspections(id);

  const handleAdd = useCallback(() => {
    router.push(`/inspections/new?hiveId=${id}`);
  }, [id, router]);

  const handlePress = useCallback(
    (inspection: Inspection) => {
      router.push(`/inspections/${inspection.id}/view`);
    },
    [router]
  );

  const handleDelete = useCallback(
    (inspection: Inspection) => {
      showConfirmDialog({
        title: L.potvrdaBrisanjaPregleda,
        message: '',
        onConfirm: () => removeInspection(inspection.id),
      });
    },
    [removeInspection]
  );

  const lastInspection = inspections.length > 0 ? inspections[0] : null;

  return (
    <View style={styles.container}>
      <InspectionSummaryBar
        inspection={lastInspection}
        onPress={() => lastInspection && router.push(`/inspections/${lastInspection.id}/view`)}
      />
      <FlatList
        data={inspections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InspectionCard
            inspection={item}
            onPress={() => handlePress(item)}
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
              icon="🔍"
              title={L.prazniPregledi}
              action={{ label: L.noviPregled, onPress: handleAdd }}
            />
          ) : null
        }
      />
      <FAB
        onPress={handleAdd}
        style={{ bottom: insets.bottom + spacing.base }}
      />
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
