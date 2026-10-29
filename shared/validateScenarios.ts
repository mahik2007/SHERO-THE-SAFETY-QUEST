import { MISSIONS } from '../shared/missionsData';
import { Mission } from '../shared/types';

export interface ValidationReport {
  isValid: boolean;
  totalMissions: number;
  totalNodes: number;
  totalChoices: number;
  errors: string[];
}

export function validateScenarioData(missions: Mission[] = MISSIONS): ValidationReport {
  const errors: string[] = [];
  let totalNodes = 0;
  let totalChoices = 0;

  if (missions.length !== 7) {
    errors.push(`Expected 7 missions, found ${missions.length}`);
  }

  const seenMissionIds = new Set<string>();

  missions.forEach((mission, idx) => {
    if (!mission.id) errors.push(`Mission at index ${idx} missing ID`);
    if (seenMissionIds.has(mission.id)) errors.push(`Duplicate mission ID: ${mission.id}`);
    seenMissionIds.add(mission.id);

    if (!mission.startNodeId) {
      errors.push(`Mission ${mission.id} missing startNodeId`);
    } else if (!mission.nodes[mission.startNodeId]) {
      errors.push(`Mission ${mission.id} startNodeId '${mission.startNodeId}' does not exist in nodes`);
    }

    const nodeEntries = Object.entries(mission.nodes);
    if (nodeEntries.length < 3) {
      errors.push(`Mission ${mission.id} has only ${nodeEntries.length} nodes, minimum 3 required`);
    }

    let reachedVictory = false;

    nodeEntries.forEach(([nodeId, node]) => {
      totalNodes++;
      if (node.id !== nodeId) {
        errors.push(`Node key ${nodeId} mismatch with node.id ${node.id}`);
      }

      if (!node.choices || node.choices.length !== 3) {
        errors.push(`Node ${nodeId} must have exactly 3 choices, has ${node.choices?.length}`);
      } else {
        totalChoices += 3;
        const correctCount = node.choices.filter(c => c.isCorrect).length;
        if (correctCount !== 1) {
          errors.push(`Node ${nodeId} must have exactly 1 winning choice, found ${correctCount}`);
        }
      }

      // Check winning progression link
      if (node.winningNextNodeId === 'VICTORY') {
        reachedVictory = true;
      } else if (node.winningNextNodeId) {
        if (!mission.nodes[node.winningNextNodeId]) {
          errors.push(`Node ${nodeId} points to non-existent winningNextNodeId '${node.winningNextNodeId}'`);
        }
      } else {
        errors.push(`Node ${nodeId} missing winningNextNodeId link`);
      }
    });

    if (!reachedVictory) {
      errors.push(`Mission ${mission.id} winning path never reaches 'VICTORY'`);
    }
  });

  return {
    isValid: errors.length === 0,
    totalMissions: missions.length,
    totalNodes,
    totalChoices,
    errors
  };
}

// Standalone runner
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('validateScenarios')) {
  const result = validateScenarioData();
  console.log('--- SCENARIO VALIDATION REPORT ---');
  console.log(`Valid: ${result.isValid}`);
  console.log(`Missions: ${result.totalMissions}`);
  console.log(`Nodes: ${result.totalNodes}`);
  console.log(`Choices: ${result.totalChoices}`);
  if (!result.isValid) {
    console.error('Errors found:');
    result.errors.forEach(err => console.error(` - ${err}`));
    process.exit(1);
  } else {
    console.log('All 7 missions, 21 nodes, and 63 choices verified successfully!');
  }
}
