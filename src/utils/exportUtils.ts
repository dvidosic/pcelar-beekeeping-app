import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getAllHives } from '@/db/repositories/hiveRepository';
import { getInspectionsByHiveId } from '@/db/repositories/inspectionRepository';
import { getByInspectionId } from '@/db/repositories/equipmentRepository';
import { getTreatmentDates } from '@/db/repositories/treatmentDatesRepository';
import { getHarvestsByHiveId } from '@/db/repositories/harvestRepository';
import { getFeedingsByHiveId } from '@/db/repositories/feedingRepository';
import { getRemindersByHiveId } from '@/db/repositories/reminderRepository';

export async function exportAllData(): Promise<void> {
  const hives = await getAllHives();

  const hivesWithData = await Promise.all(
    hives.map(async (hive) => {
      const [inspections, harvests, feedings, reminders] = await Promise.all([
        getInspectionsByHiveId(hive.id),
        getHarvestsByHiveId(hive.id),
        getFeedingsByHiveId(hive.id),
        getRemindersByHiveId(hive.id),
      ]);

      const inspectionsWithDetails = await Promise.all(
        inspections.map(async (inspection) => {
          const [equipment, treatmentDates] = await Promise.all([
            getByInspectionId(inspection.id),
            getTreatmentDates(inspection.id),
          ]);
          return { ...inspection, equipment, treatmentDates };
        })
      );

      return {
        ...hive,
        inspections: inspectionsWithDetails,
        harvests,
        feedings,
        reminders,
      };
    })
  );

  const exportData = {
    exportedAt: new Date().toISOString(),
    appVersion: 1,
    hives: hivesWithData,
  };

  const date = new Date().toISOString().split('T')[0];
  const fileName = `pcelar-backup-${date}.json`;
  const file = new File(Paths.document, fileName);
  file.write(JSON.stringify(exportData, null, 2));

  await Sharing.shareAsync(file.uri, {
    mimeType: 'application/json',
    dialogTitle: 'Spremi sigurnosnu kopiju',
  });
}
