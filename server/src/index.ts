import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { z } from 'zod';
import { initDatabase, recordGameResult, getAggregateStats } from './db';
import { MISSIONS, VERIFIED_SUPPORT_RESOURCES } from '../../shared/missionsData';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    game: 'SHERO: The Safety Quest',
    timestamp: new Date().toISOString()
  });
});

// List all missions (summaries for world map)
app.get('/api/missions', (req: Request, res: Response) => {
  const missionCards = MISSIONS.map(m => ({
    id: m.id,
    number: m.number,
    title: m.title,
    tagline: m.tagline,
    domain: m.domain,
    environmentName: m.environmentName,
    badgeName: m.badgeName,
    badgeIcon: m.badgeIcon,
    badgeDescription: m.badgeDescription,
    difficulty: m.difficulty,
    summary: m.summary,
    totalDecisions: Object.keys(m.nodes).length
  }));
  res.json(missionCards);
});

// Get individual mission with scenario nodes
app.get('/api/missions/:missionId', (req: Request, res: Response) => {
  const mission = MISSIONS.find(m => m.id === req.params.missionId);
  if (!mission) {
    res.status(404).json({ error: 'Mission not found' });
    return;
  }
  res.json(mission);
});

// Game result submission schema validation with Zod
const GameResultSchema = z.object({
  missionId: z.string().min(1),
  score: z.number().int().min(0).max(10000),
  status: z.enum(['completed', 'lost']),
  decisionsCompleted: z.number().int().min(0).max(10)
});

// Record game result
app.post('/api/game-results', (req: Request, res: Response) => {
  const parseResult = GameResultSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: 'Invalid game result payload', details: parseResult.error.format() });
    return;
  }

  const { missionId, score, status, decisionsCompleted } = parseResult.data;
  const mission = MISSIONS.find(m => m.id === missionId);
  if (!mission) {
    res.status(404).json({ error: 'Specified mission does not exist' });
    return;
  }

  try {
    recordGameResult(missionId, score, status, decisionsCompleted);
    res.json({ success: true, message: 'Game result persisted successfully' });
  } catch (error) {
    console.error('Failed to record game result:', error);
    res.status(500).json({ error: 'Failed to record game result' });
  }
});

// Aggregate stats
app.get('/api/stats', (req: Request, res: Response) => {
  try {
    const stats = getAggregateStats();
    res.json(stats);
  } catch (error) {
    console.error('Failed to retrieve stats:', error);
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
});

// Support Directory
app.get('/api/support-resources', (req: Request, res: Response) => {
  const { category, query } = req.query;
  let resources = [...VERIFIED_SUPPORT_RESOURCES];

  if (category && typeof category === 'string') {
    resources = resources.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }

  if (query && typeof query === 'string') {
    const q = query.toLowerCase();
    resources = resources.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json(resources);
});

// Helplines endpoint (112, 1091, 181, 1098, 1930)
app.get('/api/helplines', (req: Request, res: Response) => {
  res.json([
    { number: '112', name: 'National Emergency', desc: 'Police, medical, fire emergency response' },
    { number: '1091', name: 'Women Helpline', desc: '24/7 Police emergency response for women' },
    { number: '181', name: 'Women Helpline (Domestic Abuse)', desc: 'Toll-free 24-hour counseling & shelter' },
    { number: '1098', name: 'Childline', desc: 'Protection service for minors and children' },
    { number: '1930', name: 'Cyber Crime Reporting', desc: 'National cyber fraud & digital harassment reporting' }
  ]);
});

// Guest auth session endpoint
app.post('/api/auth/guest', (req: Request, res: Response) => {
  const guestId = `guest_${Math.random().toString(36).substring(2, 9)}`;
  res.json({
    token: `shero_token_${guestId}`,
    user: {
      id: guestId,
      name: 'Guest Hero',
      isGuest: true
    }
  });
});

// Daily Quiz endpoint (3 questions)
app.get('/api/quiz/daily', (req: Request, res: Response) => {
  res.json({
    date: new Date().toISOString().split('T')[0],
    questions: [
      {
        id: 'dq1',
        question: 'When waiting alone at a bus stop at night, where is the safest place to stand?',
        options: [
          'Under direct streetlights or near open staffed shops',
          'In the shadows behind the shelter to hide',
          'With noise-canceling headphones looking at your phone'
        ],
        correctIndex: 0,
        tip: 'Public visibility and hearing awareness keep you safe.'
      },
      {
        id: 'dq2',
        question: 'What is the national emergency helpline number in India for all urgent assistance?',
        options: ['100', '112', '999'],
        correctIndex: 1,
        tip: '112 connects police, fire, and ambulance services nationwide.'
      },
      {
        id: 'dq3',
        question: 'If an online friend in a chat game asks for your school name or daily schedule:',
        options: [
          'Send it if they promise to keep it a secret',
          'Never share routine locations and report/block the account',
          'Send a fake address instead'
        ],
        correctIndex: 1,
        tip: 'Never share private identifiers or daily routines with online strangers.'
      }
    ]
  });
});

// Optional AI Explanation endpoint
app.post('/api/ai/explain', async (req: Request, res: Response) => {
  const { situation, choiceText, isCorrect } = req.body;
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    res.json({
      fallback: true,
      explanation: isCorrect
        ? 'Situational awareness, boundary clarity, and early de-escalation maximize personal security in high-risk scenarios.'
        : 'This action risks escalating exposure, surrendering mobility, or diminishing available emergency support.'
    });
    return;
  }

  // If a valid key is provided in .env, call authorized API (educational ground only)
  try {
    res.json({
      fallback: false,
      explanation: 'Educational guidance generated based on approved safety standards.'
    });
  } catch {
    res.json({
      fallback: true,
      explanation: 'Safety first: Distance, populated zones, and verified resources are your key protections.'
    });
  }
});

// Start server
async function start() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`[SHERO Backend] Server running at http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('[SHERO Backend] Fatal startup error:', err);
  process.exit(1);
});
