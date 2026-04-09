import { Alert } from 'react-native';
import { L } from '@/constants/labels';

interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function showConfirmDialog({
  title,
  message,
  confirmLabel = L.obriši,
  onConfirm,
  onCancel,
}: ConfirmDialogOptions) {
  Alert.alert(title, message, [
    {
      text: L.odustani,
      style: 'cancel',
      onPress: onCancel,
    },
    {
      text: confirmLabel,
      style: 'destructive',
      onPress: onConfirm,
    },
  ]);
}
