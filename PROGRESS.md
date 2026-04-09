# Pčelar — Development Progress

> Last updated: 2026-04-09

---

## Phase Completion Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Foundation (project setup, DB, hive CRUD, HomeScreen) | ✅ COMPLETE |
| Phase 2 | Inspections (form, list, detail, edit, draft auto-save) | ✅ COMPLETE |
| Phase 3 | Logs — Harvest + Feeding (BottomSheet forms, FlatLists) | ✅ COMPLETE |
| Phase 4 | Reminders + OS notifications | ✅ COMPLETE |
| Phase 5 | Polish — 56dp audit, empty states, PROGRESS.md | ✅ COMPLETE |

---

## Current App State — Fully Implemented

### ✅ Working (all phases)
- App boots, SQLite DB initializes with all 6 tables (migration v1)
- Android notification channel `'reminders'` (HIGH importance) created on boot
- Notification permissions requested on first launch
- **HomeScreen**: FlatList of HiveCard, FAB → Add Hive, pull-to-refresh, empty state
- **Add Hive / Edit Hive**: form validates name (required), saves/updates in SQLite, optimistic UI
- **Delete Hive**: confirm dialog → CASCADE deletes all inspections, harvests, feedings, reminders
- **Hive Detail**: 4-tab shell — Pregledi / Vrcanje / Prihranjivanje / Podsjetnici
- **Status dots**: computed from latest inspection (green/yellow/red/grey)
- **Inspections tab**: FlatList with InspectionSummaryBar (last inspection + health badge), InspectionCard (date, health badge, brood, delete), FAB → new inspection, pull-to-refresh, empty state
- **New Inspection form**: full ScrollView with all 15+ fields, SectionHeaders, glove-friendly inputs (SegmentedControl 56dp, BooleanButtonField Da/Ne, TemperamentPicker 1–5, DateTimePickerField two-step Android dialog), conditional TreatmentFields, swarm destination hive picker (tappable list), EquipmentChecklist (7 × EquipmentConditionRow), notes
- **Draft auto-save**: debounced 800ms, restored on return (banner: Nastavi / Odbaci), TTL 7 days, navigation guard on dirty form
- **Inspection detail**: read-only view of all fields, equipment with color-coded badges, Edit button in header
- **Edit Inspection**: same form pre-populated from DB, uses separate draft key
- **Harvest tab**: FlatList of HarvestCard (amber stripe, date, honey type, kg), FAB → BottomSheet with HarvestForm (date, honey type SegmentedControl, custom TextInput when Ostalo, kg, notes), delete with confirm, empty state
- **Feeding tab**: same pattern — FeedingCard (green stripe), FeedingForm (food type SegmentedControl, custom type, kg), delete, empty state
- **Reminders tab**: FlatList of ReminderCard (pending/completed visual states, checkmark button, delete), FAB → BottomSheet with ReminderForm (description required, datetime picker defaults to tomorrow 09:00), complete button cancels OS notification, delete button cancels OS notification
- **OS notifications**: scheduled via `expo-notifications`, stored `notification_id` in DB, auto-cancelled on complete/delete, overdue reminders auto-completed on mount, tapping notification navigates to `/hives/${hiveId}/reminders`
- **Toast**: error toasts on all DB failures
- **56dp compliance**: all interactive elements (SegmentedControl, BooleanButtonField, TemperamentPicker, DateTimePickerField, HiveForm inputs/buttons, EmptyState action button, FAB, all card buttons) have minHeight/height ≥ 56dp

### 🧪 Device testing still needed (can't automate)
- 5.4 Draft restore/discard flow end-to-end on Android
- 5.5 Notification permissions dialog on Android 13+
- 5.6 DateTimePicker two-step flow (date → time) on Android device
- 5.7 All buttons reachable and tappable with thick gloves

---

## Key Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | Honey type: Bagremov / Livadni / Šumski / Ostalo | User specified |
| D2 | Harvest/Feeding/Reminders: BottomSheet; Inspection: full Stack screen | Inspection has 15+ fields |
| D3 | InspectionSummaryBar rendered inside each tab screen | Expo Router Tabs don't support persistent subheaders |
| D4 | Equipment notes hidden in MVP, column in schema | Keeps form shorter |
| D5 | Swarm destination shown but empty if single hive | Field is optional |
| D6 | No Switch/ToggleField — use `BooleanButtonField` everywhere | Glove-friendly |
| D7 | Swarm destination: tappable hive name list, not Picker | Glove-friendly |
| D8 | Min interactive element height: **56dp** (not 48dp) | Glove-friendly |
| D9 | Harvest custom type stored in `honey_type` column directly | Schema has no custom column; raw string display for unrecognised values |

---

## ⚠️ Critical UX Rules

**ALWAYS buttons/taps for:** predefined options (`SegmentedControl`), Yes/No (`BooleanButtonField`), temperament scale (`TemperamentPicker`), dates (`DateTimePickerField`), swarm destination (tappable hive list).

**ONLY keyboard for:** hive name, kg/grams quantity, treatment substance, free-text notes.

**NEVER:** `Picker` dropdown, `Switch`, `ToggleField`, text input where buttons are possible.

---

## Known Gotchas

1. `ToggleField` was planned but **never built** — use `BooleanButtonField`.
2. Expo SDK 54 uses **new async SQLite API** (`openDatabaseAsync`, `runAsync`, `getAllAsync`, `getFirstAsync`, `execAsync`) — the old sync API must not be used.
3. `withTransaction` in `src/db/client.ts` uses a `result!` workaround because `withTransactionAsync` returns `void`.
4. `@react-native-community/datetimepicker` on Android needs **two sequential dialogs** for `datetime` mode — `DateTimePickerField` handles this with `pendingDate` state.
5. `npm install` requires `--legacy-peer-deps` (react-dom peer dep conflict with Expo 54).
6. `PRAGMA foreign_keys = ON` is set in `client.ts` on every DB open — required for CASCADE deletes.
7. Tab `[id]` has `headerShown: false` in the parent hives Stack to prevent double headers.
8. `useHives()` refreshes on every mount — intentional for MVP simplicity.
9. `@/*` → `src/*` alias configured in both `tsconfig.json` and `babel.config.js`.
10. `expo-notifications` `SchedulableTriggerInputTypes.DATE` trigger requires `channelId: 'reminders'` on Android.

---

## Installed Dependencies

| Package | Version | Why |
|---------|---------|-----|
| `expo` | ~54.0.33 | Core Expo SDK 54 |
| `expo-router` | ~6.0.23 | File-based routing |
| `expo-sqlite` | ~16.0.10 | SQLite, new async API |
| `expo-crypto` | ~15.0.8 | UUID generation |
| `expo-notifications` | ~0.32.16 | Local push notifications |
| `expo-status-bar` | ~3.0.9 | Status bar styling |
| `react-native` | 0.81.5 | Core RN |
| `react` | 19.1.0 | React |
| `@react-native-async-storage/async-storage` | 2.2.0 | Inspection draft persistence |
| `@react-native-community/datetimepicker` | 8.4.4 | Native date/time dialogs |
| `react-native-safe-area-context` | ~5.6.0 | Safe area insets |
| `react-native-screens` | ~4.16.0 | Native screen optimization |
| `react-native-gesture-handler` | ~2.28.0 | Gesture support |
| `zustand` | ^5.0.12 | State management |
| `babel-plugin-module-resolver` | ^5.0.3 | `@/*` alias in Babel |
| `typescript` | ~5.9.2 | TypeScript |

---

## How to Run

```bash
cd "D:\Coding Projects\beekeeping-app"
npx expo start --android
```

## TypeScript Check

```bash
npx tsc --noEmit
```

## Add Packages

```bash
npm install <package> --legacy-peer-deps
# or
npx expo install <package>
```
