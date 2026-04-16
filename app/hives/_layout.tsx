import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { L } from '@/constants/labels';

export default function HivesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primaryDark,
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: L.košnice }} />
      <Stack.Screen name="add" options={{ title: L.dodajKošnicu, presentation: 'modal' }} />
      <Stack.Screen name="settings" options={{ title: L.postavke }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
