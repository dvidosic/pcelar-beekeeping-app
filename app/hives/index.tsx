import React from 'react';
import { View, FlatList, Image, RefreshControl, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHives } from '@/hooks/useHives';
import { HiveCard } from '@/components/hive/HiveCard';
import { FAB } from '@/components/ui/FAB';
import { ErrorBoundary } from '@/components/ErrorBoundary';
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
    <ErrorBoundary>
    <>
      <Stack.Screen options={{
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push('/hives/settings')}
            style={styles.settingsBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.settingsBtnText}>⚙</Text>
          </TouchableOpacity>
        ),
      }} />
      <View style={styles.container}>
      <View pointerEvents="none" style={styles.watermarkContainer}>
        <Image source={require('../../assets/app-logo.png')} style={styles.watermarkImage} />
      </View>
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
    </>
    </ErrorBoundary>
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
  settingsBtn: {
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: spacing.base,
  },
  settingsBtnText: {
    fontSize: 20,
    color: colors.primaryDark,
  },
  watermarkContainer: {
    position: 'absolute',
    width: '70%',
    aspectRatio: 1,
    alignSelf: 'center',
    top: '30%',
  },
  watermarkImage: {
    width: '100%',
    height: '100%',
    opacity: 0.07,
    resizeMode: 'contain',
  },
});
