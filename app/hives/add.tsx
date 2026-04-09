import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useHives } from '@/hooks/useHives';
import { HiveForm } from '@/components/hive/HiveForm';
import { colors } from '@/constants/colors';
import { L } from '@/constants/labels';
import { HiveFormValues } from '@/types/hive';

export default function AddHiveScreen() {
  const router = useRouter();
  const { addHive } = useHives();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: HiveFormValues) => {
    setIsLoading(true);
    try {
      await addHive(values);
      router.back();
    } catch {
      // error already shown via toast in useHives
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <HiveForm
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
