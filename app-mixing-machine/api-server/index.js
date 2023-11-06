const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
app.use(cors());
// middleware
app.use(bodyParser.json());

// database connection
const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'interactions',
  password: 'postgres',
  port: 5432,
});

// routes
app.get('/users', async (req, res) => {
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM users');
  res.json(result.rows);
  client.release();
});
app.get('/users/:userid', async (req, res) => {
  const { userid } = req.params;
  const client = await pool.connect();
  const result = await client.query(
    'SELECT role FROM users WHERE userid = $1',
    [userid]
  );
  res.json(result.rows[0]);
  client.release();
});
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const client = await pool.connect();
  const result = await client.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [name, email]
  );
  res.json(result.rows[0]);
  client.release();
});
app.post('/interactions', async (req, res) => {
  try {
    // get the user ID and element ID from the request body
    const { userId, elementId } = req.body;

    // get the current time in epoch format
    const timestamp = Math.floor(Date.now() / 1000);

    // create a new database client from the pool
    const client = await pool.connect();

    // insert a new record in the interactions table
    await client.query(
      'INSERT INTO interactions (user_id, timestamp, epoch_time, element_id) VALUES ($1, $2, $3, $4)',
      [userId, new Date(), timestamp, elementId]
    );

    // release the client back to the pool
    client.release();

    // send a success response to the client
    res.status(201).send('Interaction recorded successfully');
  } catch (err) {
    // if there's an error, log it and send an error response to the client
    console.error(err);
    res.status(500).send('Error recording interaction');
  }
});


// start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

