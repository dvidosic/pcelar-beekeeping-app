import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { L } from '@/constants/labels';

export default function InspectionDetailLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primaryDark,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="view" options={{ title: L.pregledi }} />
      <Stack.Screen name="edit" options={{ title: L.urediPregled, presentation: 'modal' }} />
    </Stack>
  );
}
