import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { BooleanButtonField } from '@/components/ui/BooleanButtonField';
import { TemperamentPicker } from '@/components/ui/TemperamentPicker';
import { DateTimePickerField } from '@/components/ui/DateTimePickerField';
import { FormField } from '@/components/ui/FormField';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TreatmentFields } from '@/components/inspection/TreatmentFields';
import { EquipmentChecklist } from '@/components/inspection/EquipmentChecklist';
import { showConfirmDialog } from '@/components/ui/ConfirmDialog';

import { useInspections } from '@/hooks/useInspections';
import { useInspectionDraft } from '@/hooks/useInspectionDraft';
import { useHiveStore } from '@/stores/hiveStore';
import { getInspectionById } from '@/db/repositories/inspectionRepository';
import { getByInspectionId } from '@/db/repositories/equipmentRepository';

import {
  broodQuantityOptions,
  broodQualityOptions,
  queenAgeOptions,
  foodStoresOptions,
  hygienicBehaviorOptions,
  healthStatusOptions,
  swarmEventOptions,
  EquipmentComponentKey,
  equipmentComponents,
} from '@/constants/options';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/spacing';
import { L } from '@/constants/labels';

import {
  BroodQuantity,
  BroodQuality,
  QueenAge,
  FoodStores,
  HygienicBehavior,
  HealthStatus,
  SwarmEvent,
  EquipmentConditionMap,
  EquipmentConditionValue,
  Inspection,
  InspectionDraft,
} from '@/types/inspection';

const DEFAULT_EQUIPMENT: EquipmentConditionMap = {
  floor: 'good', super1: 'good', super2: 'good', super3: 'good',
  frames: 'good', feeder: 'good', roof: 'good',
};

interface FormState {
  inspectedAt: Date;
  broodQuantity: BroodQuantity;
  broodQuality: BroodQuality;
  queenSeen: boolean;
  queenAge: QueenAge;
  foodStores: FoodStores;
  temperament: number;
  hygienicBehavior: HygienicBehavior;
  honeyIntakeG: string;
  healthStatus: HealthStatus;
  treatmentApplied: boolean;
  treatmentSubstance: string;
  treatmentDate: Date;
  swarmEvent: SwarmEvent;
  swarmDestinationHiveId: string;
  notes: string;
  equipment: EquipmentConditionMap;
}

function inspectionToForm(inspection: Inspection, equipment: EquipmentConditionMap): FormState {
  return {
    inspectedAt: new Date(inspection.inspected_at),
    broodQuantity: (inspection.brood_quantity ?? 'normal') as BroodQuantity,
    broodQuality: (inspection.brood_quality ?? 'good') as BroodQuality,
    queenSeen: inspection.queen_seen === 1,
    queenAge: (inspection.queen_age ?? 'unknown') as QueenAge,
    foodStores: (inspection.food_stores ?? 'adequate') as FoodStores,
    temperament: inspection.temperament ?? 3,
    hygienicBehavior: (inspection.hygienic_behavior ?? 'normal') as HygienicBehavior,
    honeyIntakeG: inspection.honey_intake_daily_g != null ? String(inspection.honey_intake_daily_g) : '',
    healthStatus: (inspection.health_status ?? 'healthy') as HealthStatus,
    treatmentApplied: inspection.treatment_applied === 1,
    treatmentSubstance: inspection.treatment_substance ?? '',
    treatmentDate: inspection.treatment_date ? new Date(inspection.treatment_date) : new Date(),
    swarmEvent: (inspection.swarm_event ?? 'none') as SwarmEvent,
    swarmDestinationHiveId: inspection.swarm_destination_hive_id ?? '',
    notes: inspection.notes ?? '',
    equipment,
  };
}

function formToDraft(f: FormState): InspectionDraft {
  return {
    inspectedAt: f.inspectedAt.toISOString(),
    broodQuantity: f.broodQuantity,
    broodQuality: f.broodQuality,
    queenSeen: f.queenSeen,
    queenAge: f.queenAge,
    foodStores: f.foodStores,
    temperament: f.temperament,
    hygienicBehavior: f.hygienicBehavior,
    honeyIntakeDailyG: f.honeyIntakeG,
    healthStatus: f.healthStatus,
    treatmentApplied: f.treatmentApplied,
    treatmentSubstance: f.treatmentSubstance,
    treatmentDate: f.treatmentDate.toISOString(),
    swarmEvent: f.swarmEvent,
    swarmDestinationHiveId: f.swarmDestinationHiveId,
    notes: f.notes,
    equipmentConditions: f.equipment,
    savedAt: new Date().toISOString(),
  };
}

function draftToForm(d: InspectionDraft): FormState {
  return {
    inspectedAt: new Date(d.inspectedAt),
    broodQuantity: d.broodQuantity,
    broodQuality: d.broodQuality,
    queenSeen: d.queenSeen,
    queenAge: d.queenAge,
    foodStores: d.foodStores,
    temperament: d.temperament,
    hygienicBehavior: d.hygienicBehavior,
    honeyIntakeG: d.honeyIntakeDailyG,
    healthStatus: d.healthStatus,
    treatmentApplied: d.treatmentApplied,
    treatmentSubstance: d.treatmentSubstance,
    treatmentDate: new Date(d.treatmentDate),
    swarmEvent: d.swarmEvent,
    swarmDestinationHiveId: d.swarmDestinationHiveId,
    notes: d.notes,
    equipment: d.equipmentConditions,
  };
}

export default function EditInspectionScreen() {
  const { id, hiveId } = useLocalSearchParams<{ id: string; hiveId: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { editInspection } = useInspections(hiveId);
  const { loadDraft, saveDraft, clearDraft } = useInspectionDraft(hiveId, id);
  const hives = useHiveStore((s) => s.hives);

  const [form, setForm] = useState<FormState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const draftCleared = useRef(false);

  // Load initial data from DB, then check for draft
  useEffect(() => {
    async function load() {
      const inspection = await getInspectionById(id);
      if (!inspection) {
        router.back();
        return;
      }
      const equipmentRows = await getByInspectionId(id);
      const equipmentMap: EquipmentConditionMap = { ...DEFAULT_EQUIPMENT };
      for (const row of equipmentRows) {
        equipmentMap[row.component as EquipmentComponentKey] = row.condition;
      }
      setForm(inspectionToForm(inspection, equipmentMap));

      const draft = await loadDraft();
      if (draft) setShowDraftBanner(true);
    }
    load();
  }, [id]);

  // Auto-save draft on form changes
  useEffect(() => {
    if (isDirty && form) saveDraft(formToDraft(form));
  }, [form, isDirty]);

  // Navigation guard
  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', (e: any) => {
      if (!isDirty || draftCleared.current) return;
      e.preventDefault();
      showConfirmDialog({
        title: L.odbacitNacrt,
        message: L.nadenNacrtPregleda,
        confirmLabel: L.odbaci,
        onConfirm: async () => {
          await clearDraft();
          draftCleared.current = true;
          navigation.dispatch(e.data.action);
        },
      });
    });
    return unsub;
  }, [navigation, isDirty]);

  const set = useCallback(<K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: val } : prev));
    setIsDirty(true);
  }, []);

  const setEquipment = useCallback(
    (component: EquipmentComponentKey, condition: EquipmentConditionValue) => {
      setForm((prev) =>
        prev ? { ...prev, equipment: { ...prev.equipment, [component]: condition } } : prev
      );
      setIsDirty(true);
    },
    []
  );

  const handleRestoreDraft = async () => {
    const draft = await loadDraft();
    if (draft) setForm(draftToForm(draft));
    setShowDraftBanner(false);
    setIsDirty(true);
  };

  const handleDiscardDraft = async () => {
    await clearDraft();
    setShowDraftBanner(false);
  };

  const handleSubmit = async () => {
    if (!form) return;
    setIsSubmitting(true);
    try {
      await editInspection(
        id,
        {
          inspected_at: form.inspectedAt.toISOString(),
          brood_quantity: form.broodQuantity,
          brood_quality: form.broodQuality,
          queen_seen: form.queenSeen ? 1 : 0,
          queen_age: form.queenAge,
          food_stores: form.foodStores,
          temperament: form.temperament,
          hygienic_behavior: form.hygienicBehavior,
          honey_intake_daily_g: form.honeyIntakeG ? parseInt(form.honeyIntakeG, 10) : null,
          health_status: form.healthStatus,
          treatment_applied: form.treatmentApplied ? 1 : 0,
          treatment_substance: form.treatmentApplied ? form.treatmentSubstance || null : null,
          treatment_date: form.treatmentApplied ? form.treatmentDate.toISOString() : null,
          swarm_event: form.swarmEvent,
          swarm_destination_hive_id:
            form.swarmEvent !== 'none' && form.swarmDestinationHiveId
              ? form.swarmDestinationHiveId
              : null,
          notes: form.notes || null,
        },
        form.equipment
      );
      await clearDraft();
      draftCleared.current = true;
      router.back();
    } catch {
      // error shown via toast inside useInspections
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!form) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const otherHives = hives.filter((h) => h.id !== hiveId);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Draft restore banner */}
        {showDraftBanner && (
          <View style={styles.draftBanner}>
            <Text style={styles.draftText}>{L.nadenNacrtPregleda}</Text>
            <View style={styles.draftActions}>
              <TouchableOpacity style={styles.draftBtn} onPress={handleRestoreDraft}>
                <Text style={styles.draftBtnTextPrimary}>{L.nastaviNacrt}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.draftBtn} onPress={handleDiscardDraft}>
                <Text style={styles.draftBtnTextSecondary}>{L.odbaci}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Date & Time */}
        <SectionHeader label={L.datumVrijeme} />
        <DateTimePickerField
          label={L.datumVrijeme}
          value={form.inspectedAt}
          onChange={(d) => set('inspectedAt', d)}
          mode="datetime"
        />

        {/* Brood */}
        <SectionHeader label={L.količinaLegla} />
        <FormField label={L.količinaLegla}>
          <SegmentedControl
            options={broodQuantityOptions}
            value={form.broodQuantity}
            onChange={(v) => set('broodQuantity', v as BroodQuantity)}
          />
        </FormField>
        <FormField label={L.kvalitetaLegla}>
          <SegmentedControl
            options={broodQualityOptions}
            value={form.broodQuality}
            onChange={(v) => set('broodQuality', v as BroodQuality)}
          />
        </FormField>

        {/* Queen */}
        <SectionHeader label={L.vidjenaMatiica} />
        <BooleanButtonField
          label={L.vidjenaMatiica}
          value={form.queenSeen}
          onChange={(v) => set('queenSeen', v)}
          trueLabel={L.da}
          falseLabel={L.ne}
        />
        <FormField label={L.starostMatice}>
          <SegmentedControl
            options={queenAgeOptions}
            value={form.queenAge}
            onChange={(v) => set('queenAge', v as QueenAge)}
          />
        </FormField>

        {/* Food */}
        <SectionHeader label={L.zaliheHrane} />
        <FormField label={L.zaliheHrane}>
          <SegmentedControl
            options={foodStoresOptions}
            value={form.foodStores}
            onChange={(v) => set('foodStores', v as FoodStores)}
          />
        </FormField>

        {/* Temperament */}
        <SectionHeader label={L.temperament} />
        <FormField label={L.temperament}>
          <TemperamentPicker value={form.temperament} onChange={(v) => set('temperament', v)} />
        </FormField>

        {/* Hygiene */}
        <SectionHeader label={L.higiijenskeNavike} />
        <FormField label={L.higiijenskeNavike}>
          <SegmentedControl
            options={hygienicBehaviorOptions}
            value={form.hygienicBehavior}
            onChange={(v) => set('hygienicBehavior', v as HygienicBehavior)}
          />
        </FormField>

        {/* Honey intake */}
        <FormField label={L.dnevniUnosMemda}>
          <TextInput
            style={styles.input}
            value={form.honeyIntakeG}
            onChangeText={(v) => set('honeyIntakeG', v)}
            placeholder={L.unesiteGrame}
            placeholderTextColor={colors.disabledText}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </FormField>

        {/* Health */}
        <SectionHeader label={L.zdravstvenoStanje} />
        <FormField label={L.zdravstvenoStanje}>
          <SegmentedControl
            options={healthStatusOptions}
            value={form.healthStatus}
            onChange={(v) => set('healthStatus', v as HealthStatus)}
          />
        </FormField>

        {/* Treatment */}
        <SectionHeader label={L.tretmanProveden} />
        <BooleanButtonField
          label={L.tretmanProveden}
          value={form.treatmentApplied}
          onChange={(v) => set('treatmentApplied', v)}
          trueLabel={L.da}
          falseLabel={L.ne}
        />
        {form.treatmentApplied && (
          <TreatmentFields
            substance={form.treatmentSubstance}
            onSubstanceChange={(v) => set('treatmentSubstance', v)}
            treatmentDate={form.treatmentDate}
            onTreatmentDateChange={(d) => set('treatmentDate', d)}
          />
        )}

        {/* Swarm */}
        <SectionHeader label={L.rojenje} />
        <FormField label={L.rojenje}>
          <SegmentedControl
            options={swarmEventOptions}
            value={form.swarmEvent}
            onChange={(v) => set('swarmEvent', v as SwarmEvent)}
          />
        </FormField>
        {form.swarmEvent !== 'none' && (
          <FormField label={L.odredišnaKošnica}>
            {otherHives.length === 0 ? (
              <Text style={styles.noHivesText}>{L.nePostojeKošnice}</Text>
            ) : (
              <View style={styles.hiveList}>
                {otherHives.map((h) => {
                  const selected = form.swarmDestinationHiveId === h.id;
                  return (
                    <TouchableOpacity
                      key={h.id}
                      style={[styles.hiveBtn, selected && styles.hiveBtnSelected]}
                      onPress={() => set('swarmDestinationHiveId', selected ? '' : h.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.hiveBtnText, selected && styles.hiveBtnTextSelected]}>
                        {h.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </FormField>
        )}

        {/* Equipment */}
        <SectionHeader label={L.stanjeOpreme} />
        <EquipmentChecklist value={form.equipment} onChange={setEquipment} />

        {/* Notes */}
        <SectionHeader label={L.napomene} />
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={form.notes}
          onChangeText={(v) => set('notes', v)}
          placeholder={L.unesiteOpis}
          placeholderTextColor={colors.disabledText}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </ScrollView>

      {/* Submit button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.base }]}>
        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.textOnPrimary} />
          ) : (
            <Text style={styles.submitText}>{L.spremi}</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  scroll: { padding: spacing.base },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
    minHeight: 56,
  },
  notesInput: {
    minHeight: 100,
    paddingTop: spacing.md,
  },
  noHivesText: {
    fontSize: 14,
    color: colors.textMuted,
    fontStyle: 'italic',
    paddingVertical: spacing.sm,
  },
  hiveList: { gap: spacing.sm },
  hiveBtn: {
    minHeight: 56,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.base,
  },
  hiveBtnSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  hiveBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  hiveBtnTextSelected: {
    color: colors.textOnPrimary,
  },
  draftBanner: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.base,
    gap: spacing.sm,
  },
  draftText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  draftActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  draftBtn: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primaryDark,
  },
  draftBtnTextPrimary: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  draftBtnTextSecondary: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  footer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.base,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  submitDisabled: { opacity: 0.6 },
  submitText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
});
