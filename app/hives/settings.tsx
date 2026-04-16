import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { exportAllData } from '@/utils/exportUtils';
import { useUIStore } from '@/stores/uiStore';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/spacing';
import { L } from '@/constants/labels';

export default function SettingsScreen() {
  const [isExporting, setIsExporting] = useState(false);
  const showToast = useUIStore((s) => s.showToast);
  const insets = useSafeAreaInsets();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportAllData();
      showToast(L.izvozUspjesan, 'success');
    } catch (e) {
      console.error('[Export]', e);
      showToast(L.izvozGreska, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: L.postavke }} />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.lg }]}
      >
        <TouchableOpacity
          style={[styles.exportBtn, isExporting && styles.exportBtnDisabled]}
          onPress={handleExport}
          disabled={isExporting}
          activeOpacity={0.8}
        >
          {isExporting ? (
            <ActivityIndicator color={colors.textOnPrimary} />
          ) : (
            <Text style={styles.exportBtnText}>{L.izvozPodataka}</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.hint}>
          Izvozi sve podatke o košnicama, pregledima, vrcanju, prihranjivanju i podsjetnicima u JSON datoteku koju možete pohraniti na Google Drive ili poslati e-mailom.
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.base,
    gap: spacing.md,
  },
  exportBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  exportBtnDisabled: {
    opacity: 0.6,
  },
  exportBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 20,
  },
});
