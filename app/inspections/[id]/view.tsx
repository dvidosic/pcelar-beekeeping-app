import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEquipmentConditions } from '@/hooks/useEquipmentConditions';
import { useTreatmentDates } from '@/hooks/useTreatmentDates';
import { getInspectionById } from '@/db/repositories/inspectionRepository';
import { Inspection, HealthStatus, EquipmentConditionValue } from '@/types/inspection';
import {
  broodQuantityOptions,
  broodQualityOptions,
  queenAgeOptions,
  foodStoresOptions,
  hygienicBehaviorOptions,
  healthStatusOptions,
  swarmEventOptions,
  equipmentConditionOptions,
  equipmentComponents,
} from '@/constants/options';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/spacing';
import { L } from '@/constants/labels';
import { formatDate, formatDateTime } from '@/utils/dateUtils';
import { useHiveStore } from '@/stores/hiveStore';
import { SectionHeader } from '@/components/ui/SectionHeader';

function healthColor(status: HealthStatus | null): string {
  if (!status || status === 'healthy') return colors.success;
  if (status === 'varroa' || status === 'nosema' || status === 'tropileloza' || status === 'americka_gnjiloca') return colors.danger;
  return colors.warning;
}

function conditionColor(condition: EquipmentConditionValue): string {
  if (condition === 'good') return colors.success;
  if (condition === 'replaced') return colors.warning;
  return colors.danger;
}

function labelFor(options: { value: string; label: string }[], value: string | null | undefined): string {
  if (!value) return '—';
  return options.find((o) => o.value === value)?.label ?? value;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function BadgeRow({ label, text, color }: { label: string; text: string; color: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{text}</Text>
      </View>
    </View>
  );
}

export default function InspectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const hives = useHiveStore((s) => s.hives);

  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { conditionMap } = useEquipmentConditions(id);
  const { dates: treatmentDates } = useTreatmentDates(inspection ? id : null);

  useEffect(() => {
    getInspectionById(id).then((insp) => {
      setInspection(insp);
      setIsLoading(false);
    });
  }, [id]);

  const handleEdit = useCallback(() => {
    if (!inspection) return;
    router.push(`/inspections/${id}/edit?hiveId=${inspection.hive_id}`);
  }, [inspection, id, router]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!inspection) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Pregled nije pronađen.</Text>
      </View>
    );
  }

  const swarmDestHive =
    inspection.swarm_destination_hive_id
      ? hives.find((h) => h.id === inspection.swarm_destination_hive_id)?.name ?? '—'
      : '—';

  return (
    <>
      <Stack.Screen
        options={{
          title: formatDate(inspection.inspected_at),
          headerRight: () => (
            <TouchableOpacity onPress={handleEdit} style={styles.editBtn}>
              <Text style={styles.editBtnText}>{L.uredi}</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.base }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Date */}
        <SectionHeader label={L.datumVrijeme} />
        <DetailRow label={L.datumVrijeme} value={formatDateTime(inspection.inspected_at)} />

        {/* Brood */}
        <SectionHeader label={L.količinaLegla} />
        <DetailRow label={L.količinaLegla} value={labelFor(broodQuantityOptions, inspection.brood_quantity)} />
        {inspection.brood_frames != null && (
          <DetailRow label={L.brojOkvirasLeglom} value={String(inspection.brood_frames)} />
        )}
        <DetailRow label={L.kvalitetaLegla} value={labelFor(broodQualityOptions, inspection.brood_quality)} />

        {/* Queen */}
        <SectionHeader label={L.vidjenaMatiica} />
        <DetailRow label={L.vidjenaMatiica} value={inspection.queen_seen ? L.da : L.ne} />
        <DetailRow label={L.starostMatice} value={labelFor(queenAgeOptions, inspection.queen_age)} />

        {/* Food */}
        <SectionHeader label={L.zaliheHrane} />
        <DetailRow label={L.zaliheHrane} value={labelFor(foodStoresOptions, inspection.food_stores)} />
        {inspection.food_stores_kg != null && (
          <DetailRow label={L.kolicanaHrane} value={`${inspection.food_stores_kg} kg`} />
        )}

        {/* Temperament */}
        <SectionHeader label={L.temperament} />
        <DetailRow label={L.temperament} value={inspection.temperament != null ? String(inspection.temperament) : '—'} />

        {/* Hygiene */}
        <SectionHeader label={L.higiijenskeNavike} />
        <DetailRow label={L.higiijenskeNavike} value={labelFor(hygienicBehaviorOptions, inspection.hygienic_behavior)} />

        {/* Honey intake */}
        <DetailRow
          label={L.dnevniUnosMemda}
          value={inspection.honey_intake_daily_g != null ? `${inspection.honey_intake_daily_g} g` : '—'}
        />

        {/* Health */}
        <SectionHeader label={L.zdravstvenoStanje} />
        <BadgeRow
          label={L.zdravstvenoStanje}
          text={labelFor(healthStatusOptions, inspection.health_status)}
          color={healthColor(inspection.health_status)}
        />

        {/* Treatment */}
        <SectionHeader label={L.tretmanProveden} />
        <DetailRow label={L.tretmanProveden} value={inspection.treatment_applied ? L.da : L.ne} />
        {inspection.treatment_applied === 1 && (
          <>
            <DetailRow label={L.sredstvoTretmana} value={inspection.treatment_substance ?? '—'} />
            {treatmentDates.length > 0
              ? treatmentDates.map((d, i) => (
                  <DetailRow
                    key={d + i}
                    label={i === 0 ? L.datumiTretmana : ''}
                    value={formatDate(d)}
                  />
                ))
              : <DetailRow label={L.datumiTretmana} value="—" />
            }
          </>
        )}

        {/* Swarm */}
        <SectionHeader label={L.rojenje} />
        <DetailRow label={L.rojenje} value={labelFor(swarmEventOptions, inspection.swarm_event)} />
        {(inspection.swarm_event === 'natural' || inspection.swarm_event === 'artificial') && (
          <DetailRow label={L.odredišnaKošnica} value={swarmDestHive} />
        )}
        {inspection.swarm_event === 'razrojena' && inspection.swarm_new_hive_note && (
          <DetailRow label={L.uKojuKosnicu} value={inspection.swarm_new_hive_note} />
        )}

        {/* Equipment */}
        <SectionHeader label={L.stanjeOpreme} />
        {equipmentComponents.map(({ key, label }) => {
          const condition = conditionMap[key];
          const condLabel = labelFor(equipmentConditionOptions, condition);
          return (
            <BadgeRow
              key={key}
              label={label}
              text={condLabel}
              color={conditionColor(condition)}
            />
          );
        })}

        {/* Notes */}
        {inspection.notes ? (
          <>
            <SectionHeader label={L.napomene} />
            <View style={styles.notesBox}>
              <Text style={styles.notesText}>{inspection.notes}</Text>
            </View>
          </>
        ) : null}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  notFound: { fontSize: 16, color: colors.textMuted },
  scroll: { padding: spacing.base },
  editBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 44,
    justifyContent: 'center',
  },
  editBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    minHeight: 48,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textMuted,
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: spacing.sm,
  },
  badge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  notesBox: {
    backgroundColor: colors.white,
    padding: spacing.base,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  notesText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
});
