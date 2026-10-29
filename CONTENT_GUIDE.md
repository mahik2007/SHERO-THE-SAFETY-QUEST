# SHERO: The Safety Quest — Content Authoring Guide

This guide explains how to add or customize story missions and scenarios in **SHERO: The Safety Quest** using pure JSON files in `/content/missions/` without touching application code.

---

## 1. Mission File Structure

Each mission follows this structure:

```json
{
  "id": "mission-01",
  "number": 1,
  "title": "The Late Bus Stop",
  "tagline": "Dusk falls over the transit hub, and an unexpected stranger closes the distance.",
  "domain": "Public Transit Safety",
  "environmentName": "City Bus Stop at Night",
  "badgeName": "COMMUTE GUARDIAN",
  "badgeIcon": "ShieldCheck",
  "difficulty": "Beginner",
  "learningGoal": "Recognize boundary testing early, shift to illuminated staffed zones, and verify arrival protocols.",
  "startNodeId": "m1_node_1",
  "nodes": {
    "m1_node_1": {
      "id": "m1_node_1",
      "decisionNumber": 1,
      "situation": "Dusk has settled. Aira stands near a dimly lit edge of the bus shelter...",
      "speaker": "Stranger",
      "dialogue": "\"Hey, you're waiting alone? I can drop you home.\"",
      "heroResponseDialogue": "\"No, thank you. I'm okay waiting here, and I'm calling someone I trust.\"",
      "strangerType": "cap_hoodie",
      "airaThought": "He keeps stepping closer even though I deliberately shifted away.",
      "choices": [
        {
          "id": "m1_c1_a",
          "text": "Ignore him silently and put on noise-cancelling headphones while staying in the dark corner.",
          "isCorrect": false,
          "feedback": "Blocking your hearing in a dim area eliminates situational awareness.",
          "educationalTip": "Never block your auditory senses when dealing with suspicious individuals."
        },
        {
          "id": "m1_c1_b",
          "text": "Move immediately towards the brightly lit convenience store with cashier staff.",
          "isCorrect": true,
          "feedback": "Excellent choice! Moving toward well-lit staffed spaces deters unwanted contact.",
          "educationalTip": "Distance and public visibility are your strongest first-line defenses."
        },
        {
          "id": "m1_c1_c",
          "text": "Confront him aggressively with insults alone in the dark.",
          "isCorrect": false,
          "feedback": "Escalating hostile language when isolated risks triggering aggression.",
          "educationalTip": "Disengage toward populated areas rather than starting solo verbal fights."
        }
      ],
      "winningNextNodeId": "m1_node_2"
    }
  }
}
```

---

## 2. Rules for Writing Dialogue & Content

1. **Simple, Accessible Language:** Target ~Grade 5–6 readability. Use short sentences and everyday words.
2. **Respect & Empowerment:** Never blame the victim. The hero's intuition is affirmed and rewarded.
3. **Choice Balance:** Provide exactly 3 choices:
   - 1 safe, recommended response.
   - 2 realistic, unsafe pitfalls (e.g. freezing, escalating confrontation alone, or giving away privacy).
4. **Educational Takeaways:** Provide a single actionable safety takeaway for each decision node.
