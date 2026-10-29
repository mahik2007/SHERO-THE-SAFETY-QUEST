/**
 * SHERO Player Personalization Utility
 * Ensures the protagonist's chosen name is seamlessly and dynamically applied
 * across all dialogues, narrations, thoughts, prompts, level completions, and results.
 */

export function personalizeText(text: string | undefined | null, heroName: string): string {
  if (!text) return '';
  const name = heroName?.trim() || 'Hero';

  return text
    // Possessive forms
    .replace(/\bAira's\b/g, `${name}'s`)
    .replace(/\baira's\b/g, `${name}'s`)
    // Standard names
    .replace(/\bAira\b/g, name)
    .replace(/\baira\b/g, name)
    // Template placeholders
    .replace(/\{heroName\}/g, name)
    .replace(/\{hero\}/g, name);
}

/**
 * Generates natural scenario entry prompts addressing the protagonist
 * e.g. "Gyanvi, the bus is approaching. Stay aware of your surroundings."
 */
export function getScenarioEntryPrompt(heroName: string, missionNumber: number, environmentName: string): string {
  const name = heroName?.trim() || 'Hero';
  switch (missionNumber) {
    case 1:
      return `${name}, the bus is approaching. Stay aware of your surroundings.`;
    case 2:
      return `${name}, you are navigating a quiet sidewalk corridor. Notice who is in your vicinity.`;
    case 3:
      return `${name}, a vehicle has stopped at your pickup spot. Verify all credentials before approaching.`;
    case 4:
      return `${name}, a digital invitation requires verification. Protect your private coordinates.`;
    case 5:
      return `${name}, a gathering is underway. Maintain boundary awareness and monitor your refreshments.`;
    case 6:
      return `${name}, someone is testing boundaries in your workspace. Keep clear professional limits.`;
    case 7:
      return `${name}, an unfamiliar transit route lies ahead. Stay alert and keep your safety network informed.`;
    default:
      return `${name}, assess the environment carefully and prepare your strategy.`;
  }
}

/**
 * Standard decision prompt addressing the protagonist
 * e.g. "Gyanvi, how would you like to respond?"
 */
export function getDecisionPrompt(heroName: string): string {
  const name = heroName?.trim() || 'Hero';
  return `${name}, how would you like to respond?`;
}

/**
 * Mission completion message
 * e.g. "Mission complete, Gyanvi! You made a thoughtful decision."
 */
export function getMissionCompletionMessage(heroName: string): string {
  const name = heroName?.trim() || 'Hero';
  return `Mission complete, ${name}! You made a thoughtful decision.`;
}

/**
 * Game Over notice addressing the protagonist
 */
export function getGameOverMessage(heroName: string): string {
  const name = heroName?.trim() || 'Hero';
  return `${name}, an unsafe situation developed. Review the consequences below and restart the level.`;
}
