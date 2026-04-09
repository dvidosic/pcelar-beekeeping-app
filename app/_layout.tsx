import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { runMigrations } from '@/db/migrations';
import { ToastRenderer } from '@/components/ui/Toast';
import { colors } from '@/constants/colors';
import { L } from '@/constants/labels';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const NOTIF_PERMISSION_KEY = 'notifications_permission_requested';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Notification tap handler — navigate to the relevant hive's reminders tab
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const hiveId = response.notification.request.content.data?.hiveId as string | undefined;
      if (hiveId) {
        router.push(`/hives/${hiveId}/reminders`);
      }
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    async function initialize() {
      try {
        // Run DB migrations
        await runMigrations();

        // Setup Android notification channel
        await Notifications.setNotificationChannelAsync('reminders', {
          name: 'Podsjetnici',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
        });

        // Request notification permissions on first launch
        const alreadyRequested = await AsyncStorage.getItem(NOTIF_PERMISSION_KEY);
        if (!alreadyRequested) {
          await AsyncStorage.setItem(NOTIF_PERMISSION_KEY, 'true');
          await Notifications.requestPermissionsAsync();
        }

        setReady(true);
      } catch (e) {
        setError(L.greška);
      }
    }
    initialize();
  }, []);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>{L.učitavanje}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor={colors.background} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="hives" />
          <Stack.Screen name="inspections" />
        </Stack>
        <ToastRenderer />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
    color: colors.textMuted,
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
