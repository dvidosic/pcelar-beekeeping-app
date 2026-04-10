# Pčelar — Development Progress

> **ALL 5 PHASES COMPLETE.** Last updated: 2026-04-09.
> This file is the single source of truth for a fresh Claude Code session.

---

## Phase Completion Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Foundation — project setup, SQLite, hive CRUD, HomeScreen | ✅ COMPLETE |
| Phase 2 | Inspections — form (15+ fields), list, detail, edit, draft auto-save | ✅ COMPLETE |
| Phase 3 | Logs — Harvest + Feeding (BottomSheet forms, FlatLists) | ✅ COMPLETE |
| Phase 4 | Reminders + OS notifications (schedule, cancel, tap navigation) | ✅ COMPLETE |
| Phase 5 | Polish — 56dp compliance audit, empty states, PROGRESS.md | ✅ COMPLETE |

---

## Next Step for a Fresh Session

**The app is feature-complete.** All that remains is device testing:

- [ ] Draft restore/discard flow end-to-end on physical Android device
- [ ] Notification permissions dialog on Android 13+ (first launch)
- [ ] DateTimePicker two-step flow (date → time dialog) on Android
- [ ] All tappable elements usable with thick beekeeping gloves (56dp+)

Post-MVP ideas (not started, not planned in any detail):
- Export data to CSV
- Hive statistics/charts screen
- Multi-user / backup to cloud
- Queen marking colors by year

---

## Folder Structure (complete, every file)

```
beekeeping-app/
├── app/                                    # Expo Router v6 file-based routes
│   ├── _layout.tsx          ✅             # Root: migrations gate, notification channel,
│   │                                       #   permission request, tap handler → router.push,
│   │                                       #   GestureHandlerRootView, SafeAreaProvider, ToastRenderer
│   ├── index.tsx            ✅             # Redirect → /hives
│   ├── hives/
│   │   ├── _layout.tsx      ✅             # Stack navigator for all hive screens
│   │   ├── index.tsx        ✅             # HomeScreen: FlatList<HiveCard> + FAB + EmptyState + pull-to-refresh
│   │   ├── add.tsx          ✅             # Add Hive: HiveForm → useHives.addHive → back
│   │   └── [id]/
│   │       ├── _layout.tsx  ✅             # Tabs: Pregledi / Vrcanje / Prihranjivanje / Podsjetnici
│   │       │                               #   headerLeft: back ‹, headerRight: Uredi → /hives/[id]/edit
│   │       ├── index.tsx    ✅             # Redirect → inspections tab
│   │       ├── inspections.tsx ✅          # Inspections tab (wired — see below)
│   │       ├── harvest.tsx  ✅             # Harvest tab (wired — see below)
│   │       ├── feeding.tsx  ✅             # Feeding tab (wired — see below)
│   │       ├── reminders.tsx ✅            # Reminders tab (wired — see below)
│   │       └── edit.tsx     ✅             # Edit Hive: HiveForm pre-populated + Delete button
│   └── inspections/
│       ├── _layout.tsx      ✅             # Stack navigator for inspection screens
│       ├── new.tsx          ✅             # New Inspection: full ScrollView form (15+ fields)
│       └── [id]/
│           ├── _layout.tsx  ✅             # Stack: view (title=date) + edit (modal, title=Uredi pregled)
│           ├── view.tsx     ✅             # Read-only detail: all fields + equipment badges + Edit in header
│           └── edit.tsx     ✅             # Edit Inspection: same form pre-populated from DB
│
├── src/
│   ├── db/
│   │   ├── client.ts        ✅             # getDb() SQLite singleton, withTransaction() helper
│   │   ├── migrations.ts    ✅             # runMigrations(): schema_version table, applies pending migrations
│   │   ├── schema/                         # DDL strings (imported by migrations.ts)
│   │   │   ├── hives.sql.ts
│   │   │   ├── inspections.sql.ts
│   │   │   ├── equipment.sql.ts
│   │   │   ├── harvests.sql.ts
│   │   │   ├── feedings.sql.ts
│   │   │   └── reminders.sql.ts
│   │   └── repositories/
│   │       ├── hiveRepository.ts        ✅  # getAllHives, getHiveById, getLastInspectionInfo,
│   │       │                                #   insertHive, updateHive, deleteHive
│   │       ├── inspectionRepository.ts  ✅  # getInspectionsByHiveId, getLastInspection,
│   │       │                                #   getInspectionById, insertInspection,
│   │       │                                #   updateInspection, deleteInspection
│   │       ├── equipmentRepository.ts   ✅  # getByInspectionId, deleteByInspectionId, insertMany
│   │       ├── harvestRepository.ts     ✅  # getHarvestsByHiveId, insertHarvest, deleteHarvest
│   │       ├── feedingRepository.ts     ✅  # getFeedingsByHiveId, insertFeeding, deleteFeeding
│   │       └── reminderRepository.ts    ✅  # getRemindersByHiveId, getOverdueReminders,
│   │                                        #   insertReminder, markReminderCompleted, deleteReminder
│   ├── hooks/
│   │   ├── useHives.ts              ✅      # hives[], isLoading, refresh, addHive, editHive, removeHive
│   │   │                                    #   enriches each hive with computed status + lastInspectedAt
│   │   ├── useInspections.ts        ✅      # inspections[], isLoading, refresh,
│   │   │                                    #   addInspection(data, equipmentMap) [transaction],
│   │   │                                    #   editInspection(id, data, equipmentMap) [transaction],
│   │   │                                    #   removeInspection(id)
│   │   ├── useEquipmentConditions.ts ✅     # conditionMap: EquipmentConditionMap, isLoading
│   │   │                                    #   loads equipment rows → map for a given inspectionId
│   │   ├── useInspectionDraft.ts    ✅      # loadDraft(), saveDraft(draft) [debounced 800ms],
│   │   │                                    #   clearDraft(), hasDraft()
│   │   │                                    #   key: inspection_draft__${hiveId} (new)
│   │   │                                    #        inspection_draft__edit__${inspectionId} (edit)
│   │   │                                    #   TTL: 7 days from savedAt
│   │   ├── useHarvestLogs.ts        ✅      # harvests[], isLoading, refresh, addHarvest, removeHarvest
│   │   ├── useFeedingLogs.ts        ✅      # feedings[], isLoading, refresh, addFeeding, removeFeeding
│   │   └── useReminders.ts          ✅      # reminders[], isLoading, refresh
│   │                                        #   on mount: auto-completes overdue reminders + cancels their notifs
│   │                                        #   addReminder(description, remindAt): schedules notif, inserts
│   │                                        #   completeReminder(id): cancels notif, marks completed
│   │                                        #   removeReminder(id): cancels notif, deletes
│   ├── stores/
│   │   ├── hiveStore.ts     ✅              # Zustand: hives: HiveWithStatus[], selectedHiveId, isLoading
│   │   │                                    #   actions: setHives, addHive, updateHive, removeHive
│   │   └── uiStore.ts       ✅              # Zustand: globalLoading, toastQueue: Toast[]
│   │                                        #   action: showToast(message, type, duration?)
│   ├── components/
│   │   ├── hive/
│   │   │   ├── HiveCard.tsx         ✅      # Tappable card: amber stripe, status dot, name, location,
│   │   │   │                                #   last inspection date (or "Nije pregledano")
│   │   │   ├── HiveStatusDot.tsx    ✅      # Colored circle: green=healthy, yellow=warning,
│   │   │   │                                #   red=danger, grey=unknown
│   │   │   └── HiveForm.tsx         ✅      # TextInput form: name (required, 56dp), location, notes
│   │   │                                    #   56dp Cancel + Save buttons
│   │   ├── inspection/
│   │   │   ├── InspectionSummaryBar.tsx ✅  # Tappable bar at top of Inspections tab:
│   │   │   │                                #   last date + health badge (colored pill)
│   │   │   ├── InspectionCard.tsx   ✅      # List row: date, health badge, brood label, delete ✕ (56dp)
│   │   │   ├── EquipmentChecklist.tsx ✅    # Maps 7 equipmentComponents → EquipmentConditionRow each
│   │   │   ├── EquipmentConditionRow.tsx ✅ # Label + 3-option SegmentedControl (Dobro/Popravak/Zamij.)
│   │   │   └── TreatmentFields.tsx  ✅      # TextInput for substance + DateTimePickerField for date
│   │   │                                    #   shown conditionally when treatment_applied = true
│   │   ├── harvest/
│   │   │   ├── HarvestCard.tsx      ✅      # Amber stripe, date, honey type label, kg, delete ✕
│   │   │   └── HarvestForm.tsx      ✅      # date + honey type SegmentedControl + custom TextInput
│   │   │                                    #   (shown when Ostalo) + kg + notes + Save
│   │   ├── feeding/
│   │   │   ├── FeedingCard.tsx      ✅      # Green stripe, date, food type label, kg, delete ✕
│   │   │   └── FeedingForm.tsx      ✅      # date + food type SegmentedControl + custom TextInput
│   │   │                                    #   (shown when Ostalo, stored in food_type_custom) + kg + notes
│   │   ├── reminders/
│   │   │   ├── ReminderCard.tsx     ✅      # Amber stripe (pending) or grey (completed), description,
│   │   │   │                                #   datetime, checkmark button (56dp), delete ✕ (56dp)
│   │   │   │                                #   completed state: 65% opacity, strikethrough, "Obavljeno" badge
│   │   │   └── ReminderForm.tsx     ✅      # TextInput description (required, validated) +
│   │   │                                    #   DateTimePickerField datetime (default: tomorrow 09:00)
│   │   └── ui/
│   │       ├── SegmentedControl.tsx    ✅   # Full-width, 56dp min, amber fill on selected
│   │       │                                #   flex:1 per segment, outer border-radius only
│   │       ├── BooleanButtonField.tsx  ✅   # Two side-by-side 56dp buttons (Da / Ne default)
│   │       │                                #   REPLACES all Switch/Toggle — never use Switch
│   │       ├── TemperamentPicker.tsx   ✅   # 5 numbered buttons (1–5), 56dp, emoji row below,
│   │       │                                #   "Vrlo mirna" … "Vrlo agresivna" labels
│   │       ├── DateTimePickerField.tsx ✅   # Tappable row 56dp, shows formatted date/datetime
│   │       │                                #   Android datetime: two sequential dialogs (date then time)
│   │       │                                #   pendingDate state bridges the two dialogs
│   │       ├── FormField.tsx           ✅   # Label (14px bold) + child slot + optional error/hint
│   │       ├── FAB.tsx                 ✅   # 56×56dp fixed amber button, bottom-right, elevation 6
│   │       ├── EmptyState.tsx          ✅   # Centered icon + title + optional action button (56dp min)
│   │       ├── LoadingOverlay.tsx      ✅   # Full-screen ActivityIndicator from uiStore.globalLoading
│   │       ├── Toast.tsx               ✅   # Bottom toast from uiStore.toastQueue, auto-dismiss 3s
│   │       │                                #   types: 'success' | 'error' | 'info'
│   │       ├── BottomSheet.tsx         ✅   # Animated Modal slide-up, backdrop dismiss, optional title,
│   │       │                                #   internal ScrollView, KeyboardAvoidingView
│   │       │                                #   prop: snapPoint (fraction of screen height, default 0.6)
│   │       ├── SectionHeader.tsx       ✅   # Amber uppercase label + horizontal divider line
│   │       └── ConfirmDialog.tsx       ✅   # showConfirmDialog({title,message,confirmLabel,onConfirm})
│   │                                        #   wraps Alert.alert with Cancel (cancel) + action (destructive)
│   ├── constants/
│   │   ├── colors.ts        ✅              # primary:#F59E0B, primaryDark:#D97706, primaryLight:#FDE68A,
│   │   │                                    #   surface, background:#FFF8E1, text, textMuted, textOnPrimary,
│   │   │                                    #   border, success:#4CAF50, warning:#FFC107, danger:#F44336,
│   │   │                                    #   white, disabled, disabledText, overlay
│   │   ├── spacing.ts       ✅              # xs=4 sm=8 md=12 base=16 lg=24 xl=32 xxl=48
│   │   │                                    #   radius: sm=6 md=10 lg=16 full=9999
│   │   │                                    #   MIN_TAP_TARGET=56, MIN_BUTTON_HEIGHT=56
│   │   ├── labels.ts        ✅              # L object: ~90 Croatian UI strings (all text in the app)
│   │   │                                    #   never hardcode Croatian text — always use L.xxx
│   │   └── options.ts       ✅              # SelectOption arrays for all SegmentedControl fields:
│   │                                        #   broodQuantityOptions, broodQualityOptions, queenAgeOptions,
│   │                                        #   foodStoresOptions, hygienicBehaviorOptions,
│   │                                        #   healthStatusOptions, swarmEventOptions,
│   │                                        #   equipmentConditionOptions, honeyTypeOptions, feedingTypeOptions
│   │                                        #   equipmentComponents: [{key,label}×7] (floor,super1-3,frames,feeder,roof)
│   ├── types/
│   │   ├── hive.ts          ✅              # Hive, HiveWithStatus (adds status+lastInspectedAt),
│   │   │                                    #   HiveStatus ('healthy'|'warning'|'danger'|'unknown'),
│   │   │                                    #   HiveFormValues
│   │   ├── inspection.ts    ✅              # Inspection, EquipmentCondition, EquipmentConditionMap,
│   │   │                                    #   InspectionDraft; enum types: BroodQuantity, BroodQuality,
│   │   │                                    #   QueenAge, FoodStores, HygienicBehavior, HealthStatus,
│   │   │                                    #   SwarmEvent, EquipmentConditionValue
│   │   ├── harvest.ts       ✅              # HoneyHarvest
│   │   ├── feeding.ts       ✅              # Feeding
│   │   └── reminder.ts      ✅              # Reminder
│   └── utils/
│       ├── uuid.ts          ✅              # generateUUID() via expo-crypto randomUUID()
│       ├── dateUtils.ts     ✅              # formatDate(iso), formatDateTime(iso), nowISO(), daysSince(iso)
│       │                                    #   locale: 'hr-HR' (Croatian format)
│       ├── statusUtils.ts   ✅              # computeHiveStatus(inspection) → HiveStatus
│       │                                    #   DANGER: health varroa/nosema OR brood_quality poor
│       │                                    #           OR food_stores low OR temperament ≥ 5
│       │                                    #   WARNING: (brood_quantity low AND queen_seen=0)
│       │                                    #           OR hygienic_behavior poor
│       │                                    #           OR (food_stores adequate AND >21 days since inspection)
│       │                                    #           OR swarm_event natural OR temperament = 4
│       │                                    #   HEALTHY: none of the above + inspection exists
│       │                                    #   UNKNOWN: no inspection ever
│       └── notificationUtils.ts ✅          # scheduleReminderNotification(id, description, remindAt, hiveId)
│                                            #   → returns notificationId|null (null if remindAt is past)
│                                            # cancelReminderNotification(notificationId|null) → void
│
├── assets/                                  # App icon, splash screen (amber #F59E0B theme)
├── PROGRESS.md              ✅              # This file
├── app.json                 ✅              # name="Pčelar", slug="pcelar", Android only, portrait
├── package.json             ✅              # main="expo-router/entry"
├── tsconfig.json            ✅              # @/* → src/* path alias, strict mode
└── babel.config.js          ✅              # babel-plugin-module-resolver for @/* alias
```

---

## Database Schema (all 6 tables, migration v1)

```sql
PRAGMA foreign_keys = ON;  -- set on every DB open in client.ts

schema_version (version INTEGER PRIMARY KEY, applied_at TEXT)

hives (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  notes TEXT,
  created_at TEXT NOT NULL
)

inspections (
  id TEXT PRIMARY KEY,
  hive_id TEXT NOT NULL REFERENCES hives(id) ON DELETE CASCADE,
  inspected_at TEXT NOT NULL,
  brood_quantity TEXT CHECK(IN 'low','normal','high'),
  brood_quality TEXT CHECK(IN 'good','spotty','poor'),
  queen_seen INTEGER NOT NULL DEFAULT 1,       -- 0|1
  queen_age TEXT CHECK(IN 'under1','one_to_two','over2','unknown'),
  food_stores TEXT CHECK(IN 'low','adequate','full'),
  temperament INTEGER CHECK(BETWEEN 1 AND 5),
  hygienic_behavior TEXT CHECK(IN 'poor','normal','good'),
  honey_intake_daily_g INTEGER,
  health_status TEXT CHECK(IN 'healthy','varroa','nosema','other'),
  treatment_applied INTEGER NOT NULL DEFAULT 0, -- 0|1
  treatment_substance TEXT,
  treatment_date TEXT,
  swarm_event TEXT CHECK(IN 'none','natural','artificial'),
  swarm_destination_hive_id TEXT REFERENCES hives(id),
  notes TEXT,
  created_at TEXT NOT NULL
)

equipment_conditions (
  id TEXT PRIMARY KEY,
  inspection_id TEXT NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  component TEXT NOT NULL,   -- 'floor'|'super1'|'super2'|'super3'|'frames'|'feeder'|'roof'
  condition TEXT NOT NULL,   -- 'good'|'needs_attention'|'replaced'
  notes TEXT                 -- reserved, not shown in UI
)

honey_harvests (
  id TEXT PRIMARY KEY,
  hive_id TEXT NOT NULL REFERENCES hives(id) ON DELETE CASCADE,
  harvested_at TEXT NOT NULL,
  honey_type TEXT,           -- 'bagremov'|'livadni'|'šumski'|'other'|<custom string>
  quantity_kg REAL,
  notes TEXT
)
-- Note: no honey_type_custom column — custom types stored directly in honey_type

feedings (
  id TEXT PRIMARY KEY,
  hive_id TEXT NOT NULL REFERENCES hives(id) ON DELETE CASCADE,
  fed_at TEXT NOT NULL,
  food_type TEXT CHECK(IN 'sugar_syrup','fondant','other'),
  food_type_custom TEXT,     -- populated when food_type = 'other'
  quantity_kg REAL,
  notes TEXT
)

reminders (
  id TEXT PRIMARY KEY,
  hive_id TEXT NOT NULL REFERENCES hives(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  remind_at TEXT NOT NULL,
  is_completed INTEGER NOT NULL DEFAULT 0,  -- 0|1
  notification_id TEXT,      -- expo-notifications ID, NULL after completion/delete
  created_at TEXT NOT NULL
)
```

---

## Key Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | Honey types: Bagremov / Livadni / Šumski / Ostalo | User specified these exact options |
| D2 | Harvest/Feeding/Reminders use BottomSheet; Inspection uses full Stack screen | Inspection has 15+ fields — too long for a sheet |
| D3 | InspectionSummaryBar rendered inside each tab screen | Expo Router Tabs have no native persistent subheader slot |
| D4 | Equipment `notes` column exists in schema but hidden in MVP | Keeps the inspection form shorter |
| D5 | Swarm destination list shown but empty when only 1 hive exists | Field is optional |
| D6 | **No Switch or ToggleField anywhere** — use `BooleanButtonField` (Da/Ne) | Glove-friendly UX rule |
| D7 | Swarm destination: tappable hive name list, never a Picker/dropdown | Glove-friendly UX rule |
| D8 | All interactive elements: **minimum 56dp height** (not 48dp) | Glove-friendly UX rule |
| D9 | Harvest custom type stored directly in `honey_type` column | Schema has no separate custom column; display falls back to raw string |

---

## ⚠️ Critical UX Rules — Read Before Writing Any UI Code

This app is used outdoors with beekeeping gloves. **NON-NEGOTIABLE:**

**ALWAYS use buttons/taps for:**
- Any predefined options → `SegmentedControl` (full width, 56dp min)
- Yes/No fields → `BooleanButtonField` (two large Da/Ne buttons side by side)
- Temperament scale → `TemperamentPicker` (5 numbered buttons, 56dp)
- All dates/times → `DateTimePickerField` (tappable row, never text input)
- Swarm destination → scrollable list of tappable hive name buttons

**ONLY keyboard input for:**
- Hive name
- Quantity in kg or grams (numeric keyboard)
- Treatment substance name
- Free-text notes (optional)
- Custom honey/food type name (only when "Ostalo" selected)

**NEVER use:**
- `Picker` component (dropdown) — forbidden
- `Switch` / any toggle — forbidden; use `BooleanButtonField`
- `ToggleField` — was planned but **never built**, do not create it

---

## Known Gotchas

1. **`ToggleField` was planned but never built** — use `BooleanButtonField` for all booleans.
2. **Expo SDK 54 uses the new async SQLite API**: `openDatabaseAsync`, `runAsync`, `getAllAsync`, `getFirstAsync`, `execAsync`. The old sync API (`openDatabase`, `executeSql`) is deprecated — never use it.
3. **`withTransaction` in `client.ts`** uses a `result!` workaround because `withTransactionAsync` returns `void` and cannot return values normally.
4. **`@react-native-community/datetimepicker` on Android** requires two sequential modal dialogs for `datetime` mode: date picker first, time picker second. `DateTimePickerField` manages this with `pendingDate` state — do not change this logic.
5. **`npm install` requires `--legacy-peer-deps`** — `react-dom` is a peer dep of Expo 54 that conflicts. Always use `--legacy-peer-deps` when adding packages.
6. **`PRAGMA foreign_keys = ON`** is set in `client.ts` on every DB open — required for `ON DELETE CASCADE` to work. Do not remove it.
7. **Double-header prevention**: `app/hives/_layout.tsx` sets `headerShown: false` for the `[id]` Stack entry, so the inner Tabs layout provides the only header.
8. **`useHives()` loads on every mount** — intentional for MVP simplicity; no global inspection cache.
9. **`@/*` → `src/*`** path alias is configured in both `tsconfig.json` (for TypeScript) and `babel.config.js` (for runtime). Always use `@/...` imports, never relative paths from within `src/`.
10. **expo-notifications trigger on Android** requires `channelId: 'reminders'` explicitly in the trigger object — the channel is created in `app/_layout.tsx` on first boot.
11. **Inspection + equipment are written in a single transaction** — `useInspections.addInspection` and `editInspection` both use `withTransaction` to atomically write both tables. Equipment rows are always deleted and re-inserted on edit.
12. **`useReminders` stale cleanup on mount** — on every mount of the Reminders tab, overdue incomplete reminders are auto-completed and their OS notifications cancelled. This is intentional.

---

## Installed Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `expo` | ~54.0.33 | Core Expo SDK 54 |
| `expo-router` | ~6.0.23 | File-based routing (v3 API — `Stack`, `Tabs`, `useLocalSearchParams`, `router`) |
| `expo-sqlite` | ~16.0.10 | Local SQLite database, new async API |
| `expo-crypto` | ~15.0.8 | `randomUUID()` for UUID generation |
| `expo-notifications` | ~0.32.16 | Local push notifications (schedule, cancel, tap listener) |
| `expo-status-bar` | ~3.0.9 | Android status bar styling |
| `babel-preset-expo` | ~54.0.10 | Babel preset required by Expo |
| `react-native` | 0.81.5 | Core React Native framework |
| `react` | ^19.2.5 | React |
| `react-dom` | ^19.2.5 | Required by Expo 54 as peer dep (causes `--legacy-peer-deps` requirement) |
| `@react-native-async-storage/async-storage` | 2.2.0 | Inspection draft persistence (AsyncStorage) |
| `@react-native-community/datetimepicker` | 8.4.4 | Native date/time picker dialogs on Android |
| `react-native-safe-area-context` | ~5.6.0 | Safe area insets (notches, nav bars) |
| `react-native-screens` | ~4.16.0 | Native screen optimization, required by expo-router |
| `react-native-gesture-handler` | ~2.28.0 | Gesture support, required by expo-router |
| `zustand` | ^5.0.12 | Lightweight global state (Zustand v5 API — `useStore`, `create`) |
| `babel-plugin-module-resolver` | ^5.0.3 | (dev) `@/*` path alias in Babel |
| `typescript` | ~5.9.2 | (dev) TypeScript compiler |
| `@types/react` | ~19.1.0 | (dev) React type definitions |

---

## How to Run

```bash
cd "D:\Coding Projects\beekeeping-app"
npx expo start --android
```

## TypeScript Check

```bash
cd "D:\Coding Projects\beekeeping-app"
npx tsc --noEmit
```

## Add a Package

```bash
# Use --legacy-peer-deps for npm (react-dom peer dep conflict):
npm install <package> --legacy-peer-deps

# Or use expo install for SDK-compatible versions:
npx expo install <package>
```
