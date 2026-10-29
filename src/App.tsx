import React, { useState, useCallback } from 'react';
import { PersistentCityWorld } from './components/PersistentCityWorld';
import { TitleScreen } from './components/TitleScreen';
import { NameEntryScreen } from './components/NameEntryScreen';
import { CharacterSelectScreen, PlayableCharacter, CHARACTERS } from './components/CharacterSelectScreen';
import { MissionSelectWorld } from './components/MissionSelectWorld';
import { GameplayView } from './components/GameplayView';
import { FinalResultsScreen } from './components/FinalResultsScreen';
import { SafeCircleToolkit } from './components/SafeCircleToolkit';
import { ProgressView } from './components/ProgressView';
import { HowToPlay } from './components/HowToPlay';
import { SettingsModal } from './components/SettingsModal';
import { CreditsModal } from './components/CreditsModal';
import { CharacterIntroModal } from './components/CharacterIntroModal';
import { MissionBriefingModal } from './components/MissionBriefingModal';
import { Mission } from '../shared/types';
import { MISSIONS } from '../shared/missionsData';
import { storage } from './utils/storage';

/**
 * Application flow:
 *
 *  title → name_entry → character_select → character_intro → mission_select → mission_briefing → gameplay → final_results
 *                              ↑                   ↑
 *                           overlays          overlays
 *
 * The PersistentCityWorld renders at z-0 always.
 * Every "screen" is an overlay at z-10 or higher.
 * This means the city is ALWAYS visible behind every panel.
 */

type AppView =
  | 'title'
  | 'name_entry'
  | 'character_select'
  | 'character_intro'
  | 'mission_select'
  | 'mission_briefing'
  | 'gameplay'
  | 'final_results'
  | 'safecircle'
  | 'progress'
  | 'how_to_play'
  | 'settings'
  | 'credits';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('title');
  const [returnView, setReturnView] = useState<AppView>('title');
  const [activeMission, setActiveMission] = useState<Mission | null>(null);

  // Persistent game state across all screens
  const [playerName, setPlayerName] = useState<string>(
    () => storage.getSettings().heroName || ''
  );
  const [selectedCharacter, setSelectedCharacter] = useState<PlayableCharacter | null>(
    () => {
      // Try to restore character from settings
      const settings = storage.getSettings();
      const saved = settings.characterId;
      return CHARACTERS.find(c => c.id === saved) || null;
    }
  );

  // Navigate to a modal/overlay screen, recording where to return
  const openOverlay = useCallback((view: AppView, from?: AppView) => {
    setReturnView(from || currentView);
    setCurrentView(view);
  }, [currentView]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleNameConfirmed = (name: string) => {
    setPlayerName(name);
    setCurrentView('character_select');
  };

  const handleCharacterSelected = (char: PlayableCharacter) => {
    setSelectedCharacter(char);
    // Persist character id alongside settings
    const settings = storage.getSettings();
    storage.saveSettings({ ...settings, heroName: playerName, characterId: char.id });
    setActiveMission(MISSIONS[0]);
    // Introduce the character properly with story and objective
    setCurrentView('character_intro');
  };

  const handleIntroComplete = () => {
    setCurrentView('mission_select');
  };

  const handleStartMission = (mission: Mission) => {
    setActiveMission(mission);
    setCurrentView('mission_briefing');
  };

  const handleBriefingStart = () => {
    setCurrentView('gameplay');
  };

  const handleContinueAdventure = () => {
    const progress = storage.getProgress();
    const unlocked = MISSIONS.filter(m => progress.unlockedMissionIds.includes(m.id));
    const toPlay =
      unlocked.find(m => !progress.completedMissionIds.includes(m.id)) ||
      unlocked[unlocked.length - 1] ||
      MISSIONS[0];
    setActiveMission(toPlay);
    setCurrentView('gameplay');
  };

  const handleStartFromTitle = () => {
    // If player has no name yet, go to name entry first
    if (!playerName || playerName.trim().length < 2) {
      setCurrentView('name_entry');
    } else if (!selectedCharacter) {
      setCurrentView('character_select');
    } else {
      setCurrentView('mission_select');
    }
  };

  const handleGameplayExit = () => {
    // Check if all missions complete — show final results
    const progress = storage.getProgress();
    if (progress.completedMissionIds.length >= 5) {
      setCurrentView('final_results');
    } else {
      setCurrentView('mission_select');
    }
  };

  const handlePlayAgain = () => {
    storage.resetProgress();
    setPlayerName('');
    setSelectedCharacter(null);
    setActiveMission(null);
    setCurrentView('title');
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-midnight text-[#F8FAFC]">
      {/* ═══════════════════════════════════════════════════════════════
          WORLD LAYER — Always rendered, always present.
          z-index: 0 (behind everything)
      ═══════════════════════════════════════════════════════════════ */}
      <PersistentCityWorld />

      {/* ═══════════════════════════════════════════════════════════════
          SCREEN LAYER — Overlays rendered on top of the world.
          The world shows through their semi-transparent backgrounds.
      ═══════════════════════════════════════════════════════════════ */}

      {/* ── TITLE SCREEN ─────────────────────────────────────────── */}
      {currentView === 'title' && (
        <div className="relative z-10 min-h-screen">
          <TitleScreen
            onPlay={handleStartFromTitle}
            onOpenSettings={() => openOverlay('settings', 'title')}
            onOpenCredits={() => openOverlay('credits', 'title')}
            onOpenMissions={() => openOverlay('mission_select', 'title')}
            onOpenHowToPlay={() => openOverlay('how_to_play', 'title')}
            onStartSpecificMission={(num) => {
              const m = MISSIONS.find(x => x.number === num) || MISSIONS[0];
              setActiveMission(m);
              if (!playerName || playerName.trim().length < 2) {
                setCurrentView('name_entry');
              } else {
                setCurrentView('gameplay');
              }
            }}
          />
        </div>
      )}

      {/* ── NAME ENTRY — overlay over world ─────────────────────── */}
      {currentView === 'name_entry' && (
        <NameEntryScreen
          onConfirmName={handleNameConfirmed}
          onBack={() => setCurrentView('title')}
        />
      )}

      {/* ── CHARACTER SELECT — overlay over world ───────────────── */}
      {currentView === 'character_select' && (
        <CharacterSelectScreen
          playerName={playerName}
          onSelectCharacter={handleCharacterSelected}
          onBack={() => setCurrentView(playerName ? 'name_entry' : 'title')}
        />
      )}

      {/* ── CHARACTER INTRO SEQUENCE ────────────────────────────── */}
      {currentView === 'character_intro' && selectedCharacter && activeMission && (
        <CharacterIntroModal
          character={selectedCharacter}
          playerName={playerName}
          mission={activeMission}
          onComplete={handleIntroComplete}
          onSkip={handleIntroComplete}
        />
      )}

      {/* ── MISSION SELECT ─────────────────────────────────────── */}
      {currentView === 'mission_select' && (
        <div className="relative z-10 min-h-screen">
          <MissionSelectWorld
            onSelectMission={handleStartMission}
            onBack={() => setCurrentView('title')}
          />
        </div>
      )}

      {/* ── MISSION BRIEFING MODAL ─────────────────────────────── */}
      {currentView === 'mission_briefing' && activeMission && selectedCharacter && (
        <MissionBriefingModal
          mission={activeMission}
          character={selectedCharacter}
          playerName={playerName}
          onStart={handleBriefingStart}
          onBack={() => setCurrentView('mission_select')}
        />
      )}

      {/* ── ACTIVE GAMEPLAY ────────────────────────────────────── */}
      {currentView === 'gameplay' && activeMission && (
        <div className="relative z-10 min-h-screen">
          <GameplayView
            mission={activeMission}
            selectedCharacter={selectedCharacter}
            onExit={handleGameplayExit}
            onNextMission={(nextMission) => {
              setActiveMission(nextMission);
            }}
          />
        </div>
      )}

      {/* ── FINAL RESULTS — overlay over world ─────────────────── */}
      {currentView === 'final_results' && (
        <FinalResultsScreen
          playerName={playerName}
          selectedCharacter={selectedCharacter}
          onPlayAgain={handlePlayAgain}
          onReturnMenu={() => setCurrentView('title')}
        />
      )}

      {/* ── SAFE CIRCLE TOOLKIT ────────────────────────────────── */}
      {currentView === 'safecircle' && (
        <div className="relative z-10 min-h-screen">
          <SafeCircleToolkit onBack={() => setCurrentView(returnView)} />
        </div>
      )}

      {/* ── PROGRESS VIEW ──────────────────────────────────────── */}
      {currentView === 'progress' && (
        <div className="relative z-10 min-h-screen">
          <ProgressView onBack={() => setCurrentView(returnView)} />
        </div>
      )}

      {/* ── HOW TO PLAY — overlay ──────────────────────────────── */}
      {currentView === 'how_to_play' && (
        <HowToPlay onBack={() => setCurrentView(returnView)} />
      )}

      {/* ── SETTINGS — overlay ─────────────────────────────────── */}
      {currentView === 'settings' && (
        <SettingsModal onBack={() => setCurrentView(returnView)} />
      )}

      {/* ── CREDITS — overlay ──────────────────────────────────── */}
      {currentView === 'credits' && (
        <CreditsModal onBack={() => setCurrentView(returnView)} />
      )}

      {/* ── PERSISTENT HUD (shown during gameplay screens) ─────── */}
      {(['gameplay', 'mission_select', 'final_results'].includes(currentView)) &&
        playerName && selectedCharacter && (
        <div
          className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
          style={{ height: 0 }} // zero-height so it doesn't block content
        >
          {/* Tiny persistent identity badge — bottom-right corner */}
          <div
            className="absolute bottom-0 right-4 pointer-events-auto"
            style={{ top: 'auto', height: 'auto', position: 'fixed', bottom: 16, right: 16 }}
          >
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md text-xs font-orbitron"
              style={{
                background: 'rgba(17,20,43,0.85)',
                border: `1px solid ${selectedCharacter.borderColor}40`
              }}
            >
              <span style={{ color: selectedCharacter.colorHex }}>{selectedCharacter.signatureEmoji}</span>
              <span className="text-white font-bold">{playerName}</span>
              <span className="text-mutedLavender">·</span>
              <span style={{ color: selectedCharacter.colorHex }}>{selectedCharacter.name}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
