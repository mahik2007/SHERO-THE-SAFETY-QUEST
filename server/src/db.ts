import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

let db: Database | null = null;
const dbDir = path.resolve(process.cwd(), 'data');
const dbFilePath = path.join(dbDir, 'shero.sqlite');

export async function initDatabase(): Promise<Database> {
  if (db) return db;

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(dbFilePath)) {
    const fileBuffer = fs.readFileSync(dbFilePath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS game_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mission_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      status TEXT NOT NULL,
      decisions_completed INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS mission_completions (
      mission_id TEXT PRIMARY KEY,
      best_score INTEGER NOT NULL,
      completed_count INTEGER DEFAULT 1,
      last_completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS global_stats (
      key TEXT PRIMARY KEY,
      value_num INTEGER DEFAULT 0
    );
  `);

  persistDatabase();
  return db;
}

export function persistDatabase() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbFilePath, buffer);
}

export function recordGameResult(
  missionId: string,
  score: number,
  status: 'completed' | 'lost',
  decisionsCompleted: number
) {
  if (!db) throw new Error('Database not initialized');

  db.run(
    `INSERT INTO game_results (mission_id, score, status, decisions_completed) VALUES (?, ?, ?, ?)`,
    [missionId, score, status, decisionsCompleted]
  );

  if (status === 'completed') {
    const existing = db.exec(`SELECT best_score, completed_count FROM mission_completions WHERE mission_id = '${missionId.replace(/'/g, "''")}'`);
    if (existing.length > 0 && existing[0].values.length > 0) {
      const currentBest = Number(existing[0].values[0][0]);
      const newBest = Math.max(currentBest, score);
      db.run(
        `UPDATE mission_completions SET best_score = ?, completed_count = completed_count + 1, last_completed_at = CURRENT_TIMESTAMP WHERE mission_id = ?`,
        [newBest, missionId]
      );
    } else {
      db.run(
        `INSERT INTO mission_completions (mission_id, best_score, completed_count) VALUES (?, ?, 1)`,
        [missionId, score]
      );
    }
  }

  persistDatabase();
}

export function getAggregateStats() {
  if (!db) throw new Error('Database not initialized');

  const totalRunsRes = db.exec(`SELECT COUNT(*) FROM game_results`);
  const totalRuns = totalRunsRes.length > 0 && totalRunsRes[0].values.length > 0 ? Number(totalRunsRes[0].values[0][0]) : 0;

  const successfulRunsRes = db.exec(`SELECT COUNT(*) FROM game_results WHERE status = 'completed'`);
  const successfulRuns = successfulRunsRes.length > 0 && successfulRunsRes[0].values.length > 0 ? Number(successfulRunsRes[0].values[0][0]) : 0;

  const failedRuns = totalRuns - successfulRuns;

  const completionsRes = db.exec(`SELECT mission_id, best_score, completed_count FROM mission_completions`);
  const missionStats: Record<string, { bestScore: number; completions: number }> = {};
  if (completionsRes.length > 0) {
    completionsRes[0].values.forEach(row => {
      missionStats[String(row[0])] = {
        bestScore: Number(row[1]),
        completions: Number(row[2])
      };
    });
  }

  return {
    totalRuns,
    successfulRuns,
    failedRuns,
    missionStats
  };
}
