import { describe, it, expect } from 'vitest';
import {
  personalizeText,
  getScenarioEntryPrompt,
  getDecisionPrompt,
  getMissionCompletionMessage,
  getGameOverMessage
} from '../utils/player';
import { MISSIONS } from '../../shared/missionsData';

describe('Player Personalization System', () => {
  it('should substitute Aira with custom hero name across various grammatical cases', () => {
    const raw = "Aira waits for her evening bus. Aira's phone vibrated. Will aira cross the street?";
    const personalized = personalizeText(raw, 'Gyanvi');
    expect(personalized).toBe("Gyanvi waits for her evening bus. Gyanvi's phone vibrated. Will Gyanvi cross the street?");
  });

  it('should work with arbitrary player names without hardcoding', () => {
    const customNames = ['Anya', 'Elena', 'Priya', 'Mahima', 'Zoya'];
    customNames.forEach(name => {
      const situation = "Aira is waiting at the designated curbside rideshare zone.";
      const res = personalizeText(situation, name);
      expect(res).toContain(name);
      expect(res).not.toContain('Aira');
    });
  });

  it('generates decision prompts addressing the protagonist naturally', () => {
    const prompt = getDecisionPrompt('Gyanvi');
    expect(prompt).toBe('Gyanvi, how would you like to respond?');
  });

  it('generates scenario entry prompts addressing the protagonist', () => {
    const m1Prompt = getScenarioEntryPrompt('Gyanvi', 1, 'City Bus Stop');
    expect(m1Prompt).toBe('Gyanvi, the bus is approaching. Stay aware of your surroundings.');
  });

  it('generates mission completion messages addressing the protagonist', () => {
    const msg = getMissionCompletionMessage('Gyanvi');
    expect(msg).toBe('Mission complete, Gyanvi! You made a thoughtful decision.');
  });

  it('generates game over message addressing the protagonist', () => {
    const msg = getGameOverMessage('Gyanvi');
    expect(msg).toContain('Gyanvi');
    expect(msg).toContain('Review the consequences below and restart the level');
  });

  it('properly personalizes all 7 mission summaries and dialogues', () => {
    const testHero = 'Gyanvi';
    MISSIONS.forEach(mission => {
      const personalizedSummary = personalizeText(mission.summary, testHero);
      expect(personalizedSummary).not.toContain('Aira');

      Object.values(mission.nodes).forEach(node => {
        const persSit = personalizeText(node.situation, testHero);
        expect(persSit).not.toContain('Aira');
        const persDial = personalizeText(node.dialogue, testHero);
        expect(persDial).not.toContain('Aira');
      });
    });
  });
});
