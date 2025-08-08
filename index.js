const express = require('express');
const mysql = require('mysql2/promise');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

let db = null;
let dbError = null;

function log(line) {
  try {
    fs.appendFileSync('app.log', `${new Date().toISOString()} ${line}\n`);
  } catch {}
  console.log(line);
}

async function connectDB() {
  try {
    log(`DB connect → host=${process.env.DB_HOST} db=${process.env.DB_NAME} user=${process.env.DB_USER}`);
    db = await mysql.createPool({
      host: process.env.DB_HOST,         // <-- mets bien tes vars dans cPanel
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    });
    await db.query('SELECT 1'); // smoke test
    log('✅ MySQL OK');
    dbError = null;
  } catch (err) {
    db = null;
    dbError = err;
    log('💥 MySQL ERROR: ' + (err && err.stack || err));
  }
}

app.get('/health', (req, res) => {
  res.status(db ? 200 : 500).json({
    ok: !!db,
    dbError: dbError ? (dbError.code || dbError.message) : null,
  });
});

app.get('/professions', async (req, res) => {
  if (!db) return res.status(500).json({ error: 'DB not connected' });
  try {
    const [rows] = await db.query('SELECT id, name, description, image FROM professions');
    res.json(rows);
  } catch (err) {
    log('💥 /professions error: ' + (err && err.stack || err));
    res.status(500).json({ error: err.code || err.message });
  }
});

async function start() {
  log('Booting app…');
  await connectDB(); // Essai 1 au boot
  app.listen(port, () => log(`Server listening on port ${port}`));

  // Retente la DB périodiquement si échec (au cas où credentials/host corrigés après coup)
  setInterval(() => {
    if (!db) connectDB();
  }, 30000);
}

start().catch(err => {
  log('💥 Startup fatal: ' + (err && err.stack || err));
});
