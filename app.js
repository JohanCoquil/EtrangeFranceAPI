const express = require('express');
const mysql = require('mysql2/promise');

const app = express();

// >>> mets tes routes ici (sans app.listen !) <<<
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/professions', async (req, res) => {
  try {
    // exemple simple (tu pourras remettre ta connexion pool ensuite)
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    const [rows] = await conn.query(
      'SELECT id, name, description, image FROM professions'
    );
    await conn.end();
    res.json(rows);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: err.code || err.message });
  }
});

// **IMPORTANT**: on *exporte* l’app pour Passenger
module.exports = app;
