import { Redirect, useLocalSearchParams } from 'expo-router';

export default function HiveDetailIndex() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={`/hives/${id}/inspections`} />;
}
