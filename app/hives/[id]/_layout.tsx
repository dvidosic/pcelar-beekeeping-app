import React from 'react';
import { Tabs, useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { L } from '@/constants/labels';
import { useHiveStore } from '@/stores/hiveStore';

export default function HiveDetailLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const hive = useHiveStore((s) => s.hives.find((h) => h.id === id));

  return (
    <ErrorBoundary>
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primaryDark,
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          elevation: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push(`/hives/${id}/edit`)}
            style={styles.editBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.editText}>{L.uredi}</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="inspections"
        options={{
          title: hive?.name ?? L.košnice,
          tabBarLabel: L.tabPregledi,
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🔍</Text>,
        }}
      />
      <Tabs.Screen
        name="harvest"
        options={{
          title: hive?.name ?? L.košnice,
          tabBarLabel: L.tabVrcanje,
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🍯</Text>,
        }}
      />
      <Tabs.Screen
        name="feeding"
        options={{
          title: hive?.name ?? L.košnice,
          tabBarLabel: L.tabPrihranjivanje,
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🌿</Text>,
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: hive?.name ?? L.košnice,
          tabBarLabel: L.tabPodsjetnici,
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🔔</Text>,
        }}
      />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="edit" options={{ href: null }} />
    </Tabs>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    paddingLeft: spacing.base,
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
  },
  backText: {
    fontSize: 28,
    color: colors.primaryDark,
    lineHeight: 32,
  },
  editBtn: {
    paddingRight: spacing.base,
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  editText: {
    fontSize: 15,
    color: colors.primaryDark,
    fontWeight: '600',
  },
});
