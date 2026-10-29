import { GameProgress, TrustedContact, SafetyPlan } from '../../shared/types';

const PROGRESS_KEY = 'shero_progress_v1';
const CONTACTS_KEY = 'shero_contacts_v1';
const SAFETY_PLAN_KEY = 'shero_safety_plan_v1';
const SETTINGS_KEY = 'shero_settings_v1';

export interface AppSettings {
  music: boolean;
  sfx: boolean;
  voice: boolean;
  reducedMotion: boolean;
  fontSize: 'normal' | 'large';
  vfxIntensity: 'low' | 'high';
  heroName: string;
  characterId?: string;
  outfit: 'cyber_guardian' | 'neon_casual' | 'stealth_jacket';
}

const DEFAULT_PROGRESS: GameProgress = {
  unlockedMissionIds: ['mission-1'],
  completedMissionIds: [],
  highScores: {},
  earnedBadges: [],
  totalRuns: 0,
  successfulRuns: 0,
  failedRuns: 0
};

const DEFAULT_SETTINGS: AppSettings = {
  music: true,
  sfx: true,
  voice: true,
  reducedMotion: false,
  fontSize: 'normal',
  vfxIntensity: 'high',
  heroName: '',
  characterId: 'gyanvi',
  outfit: 'cyber_guardian'
};

const DEFAULT_PLAN: SafetyPlan = {
  safeHavens: ['Local 24/7 Pharmacy on 4th Ave', 'Campus Security Pavilion Room 102'],
  checkInPreferences: 'Send live pin and battery percentage upon arrival.',
  transitChecklist: [
    'Confirm license plate matches booking application',
    'Verify driver can state your name correctly',
    'Sit in back seat opposite driver'
  ],
  digitalSecurityChecklist: [
    'Enable Multi-Factor Authentication on primary email and social profiles',
    'Review third-party app privacy authorizations',
    'Check location permissions are set to "Only While Using App"'
  ],
  emergencyNotes: 'Allergy medication in backpack side pocket. Blood group O+.',
  updatedAt: new Date().toISOString()
};

// Safe JSON Parse wrapper to prevent corrupt local storage crashes
function safeJsonParse<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`[SHERO Storage] Corrupted data in ${key}, resetting to default:`, e);
    return fallback;
  }
}

export const storage = {
  getProgress(): GameProgress {
    const p = safeJsonParse<GameProgress>(PROGRESS_KEY, DEFAULT_PROGRESS);
    if (!p.unlockedMissionIds || !p.unlockedMissionIds.includes('mission-1')) {
      p.unlockedMissionIds = ['mission-1'];
    }
    return p;
  },

  saveProgress(progress: GameProgress) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  },

  recordRunResult(missionId: string, isSuccess: boolean, score: number, nextMissionId?: string, badge?: { badgeName: string; missionId: string }) {
    const p = this.getProgress();
    p.totalRuns += 1;

    if (isSuccess) {
      p.successfulRuns += 1;
      if (!p.completedMissionIds.includes(missionId)) {
        p.completedMissionIds.push(missionId);
      }
      p.highScores[missionId] = Math.max(p.highScores[missionId] || 0, score);

      if (nextMissionId && !p.unlockedMissionIds.includes(nextMissionId)) {
        p.unlockedMissionIds.push(nextMissionId);
      }

      if (badge && !p.earnedBadges.some(b => b.missionId === missionId)) {
        p.earnedBadges.push({
          badgeName: badge.badgeName,
          missionId,
          earnedAt: new Date().toISOString()
        });
      }
    } else {
      p.failedRuns += 1;
    }

    this.saveProgress(p);
    return p;
  },

  resetProgress(): GameProgress {
    this.saveProgress(DEFAULT_PROGRESS);
    return DEFAULT_PROGRESS;
  },

  getContacts(): TrustedContact[] {
    return safeJsonParse<TrustedContact[]>(CONTACTS_KEY, [
      {
        id: 'c-1',
        name: 'Maya Lin',
        relationship: 'Roommate / Campus Ally',
        phoneNumber: '+91 98765 43210',
        isFavorite: true
      },
      {
        id: 'c-2',
        name: 'Dr. Aris (Emergency Guardian)',
        relationship: 'Family Guardian',
        phoneNumber: '+91 91234 56789',
        isFavorite: true
      }
    ]);
  },

  saveContacts(contacts: TrustedContact[]) {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  },

  getSafetyPlan(): SafetyPlan {
    return safeJsonParse<SafetyPlan>(SAFETY_PLAN_KEY, DEFAULT_PLAN);
  },

  saveSafetyPlan(plan: SafetyPlan) {
    plan.updatedAt = new Date().toISOString();
    localStorage.setItem(SAFETY_PLAN_KEY, JSON.stringify(plan));
  },

  clearSafeCircleData() {
    localStorage.removeItem(CONTACTS_KEY);
    localStorage.removeItem(SAFETY_PLAN_KEY);
  },

  getSettings(): AppSettings {
    return safeJsonParse<AppSettings>(SETTINGS_KEY, DEFAULT_SETTINGS);
  },

  saveSettings(settings: AppSettings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  resetSettings(): AppSettings {
    this.saveSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
};
