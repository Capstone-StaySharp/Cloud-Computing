const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

app.use(express.json());

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

app.get('/news', async(req, res) => {
  try {
    const result = await pool.query('SELECT * FROM news');
    res.json({
      status: 'ok',
      totalResults: result.rows.length,
      articles: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
});

app.get('/news/:id', async(req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM news WHERE id = $1', [id]);

    if (result.rows.length > 0) {
      res.json({
        status: 'ok',
        article: result.rows[0],
      });
    } else {
      res.status(404).json({ 
        status: 'error',
        message: 'Article Not Found',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      status: 'error',
      message: 'Internal Server Error',
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});