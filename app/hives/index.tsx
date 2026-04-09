import React from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHives } from '@/hooks/useHives';
import { HiveCard } from '@/components/hive/HiveCard';
import { FAB } from '@/components/ui/FAB';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { L } from '@/constants/labels';
import { HiveWithStatus } from '@/types/hive';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { hives, isLoading, refresh } = useHives();

  const renderItem = ({ item }: { item: HiveWithStatus }) => (
    <HiveCard
      hive={item}
      onPress={() => router.push(`/hives/${item.id}`)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={hives}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          hives.length === 0 && styles.listEmpty,
          { paddingBottom: insets.bottom + 80 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon="🐝"
              title={L.prazneKošnice}
              action={{ label: L.dodajKošnicu, onPress: () => router.push('/hives/add') }}
            />
          ) : null
        }
      />
      <FAB
        onPress={() => router.push('/hives/add')}
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
    paddingTop: spacing.sm,
  },
  listEmpty: {
    flex: 1,
  },
});
