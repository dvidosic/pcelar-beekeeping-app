import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHives } from '@/hooks/useHives';
import { useHiveStore } from '@/stores/hiveStore';
import { HiveForm } from '@/components/hive/HiveForm';
import { showConfirmDialog } from '@/components/ui/ConfirmDialog';
import { colors } from '@/constants/colors';
import { L } from '@/constants/labels';
import { HiveFormValues } from '@/types/hive';

export default function EditHiveScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { editHive, removeHive } = useHives();
  const hive = useHiveStore((s) => s.hives.find((h) => h.id === id));
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: HiveFormValues) => {
    if (!id) return;
    setIsLoading(true);
    try {
      await editHive(id, values);
      router.back();
    } catch {
      // toast shown inside editHive
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (!id) return;
    showConfirmDialog({
      title: L.obriši,
      message: L.potvrdaBrisanjaKosnice,
      onConfirm: async () => {
        await removeHive(id);
        router.dismissAll();
        router.replace('/hives');
      },
    });
  };

  return (
    <View style={styles.container}>
      <HiveForm
        initialValues={
          hive
            ? {
                name: hive.name,
                location: hive.location ?? '',
                notes: hive.notes ?? '',
              }
            : undefined
        }
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        submitLabel={L.spremi}
        isLoading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
