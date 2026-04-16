import { useEffect, useState } from 'react';
import { getTreatmentDates } from '@/db/repositories/treatmentDatesRepository';

export function useTreatmentDates(inspectionId: string | null) {
  const [dates, setDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!inspectionId) return;
    setIsLoading(true);
    getTreatmentDates(inspectionId)
      .then(setDates)
      .finally(() => setIsLoading(false));
  }, [inspectionId]);

  return { dates, isLoading };
}
