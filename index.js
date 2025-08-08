const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

async function start() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'yoxigen_EtrFra',
      password: process.env.DB_PASSWORD || 'x05cl5FLuyF!',
      database: process.env.DB_NAME || 'yoxigen_EtrFra'
    });

    console.log('Connected to MySQL database');
    app.locals.db = connection;

    app.get('/', (req, res) => {
      res.send('Hello, Etrange France API!');
    });

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MySQL:', err);
    process.exit(1);
  }
}

start();
