import { describe, it, expect } from 'vitest';
import { MISSIONS, VERIFIED_SUPPORT_RESOURCES } from '../../shared/missionsData';
import { validateScenarioData } from '../../shared/validateScenarios';

describe('SHERO: Game Mechanics & Scenario Verification', () => {
  it('should validate all 7 missions structurally', () => {
    const report = validateScenarioData(MISSIONS);
    expect(report.isValid).toBe(true);
    expect(report.totalMissions).toBe(7);
    expect(report.totalNodes).toBe(21);
    expect(report.totalChoices).toBe(63);
    expect(report.errors.length).toBe(0);
  });

  it('each decision node must have exactly 3 choices and exactly 1 correct choice', () => {
    MISSIONS.forEach(mission => {
      Object.values(mission.nodes).forEach(node => {
        expect(node.choices.length).toBe(3);
        const correct = node.choices.filter(c => c.isCorrect);
        expect(correct.length).toBe(1);
        const incorrect = node.choices.filter(c => !c.isCorrect);
        expect(incorrect.length).toBe(2);
      });
    });
  });

  it('every mission must have a valid starting node and reach VICTORY', () => {
    MISSIONS.forEach(mission => {
      expect(mission.startNodeId).toBeDefined();
      expect(mission.nodes[mission.startNodeId]).toBeDefined();

      let curr = mission.nodes[mission.startNodeId];
      let steps = 0;
      while (curr && curr.winningNextNodeId !== 'VICTORY' && steps < 10) {
        steps++;
        const nextId = curr.winningNextNodeId!;
        curr = mission.nodes[nextId];
      }
      expect(curr.winningNextNodeId).toBe('VICTORY');
    });
  });

  it('verified support directory includes official Indian 112 emergency helpline', () => {
    const helpline112 = VERIFIED_SUPPORT_RESOURCES.find(r => r.contact === '112');
    expect(helpline112).toBeDefined();
    expect(helpline112?.category).toBe('Emergency');
  });
});
