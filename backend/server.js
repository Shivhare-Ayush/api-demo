// Performs RESTful API calls to the Nebula Labs API along with (other API) and sends information to the front end

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Compute __dirname in ES modules.
const __dirname = dirname(fileURLToPath(import.meta.url));
// Now, resolve the path to the .env file (one level up)
dotenv.config({ path: resolve(__dirname, '../.env') });

console.log('Current working directory:', process.cwd());
console.log('Loading .env from:', resolve(__dirname, '../.env'));
console.log('Nebula API Key:', process.env.NEBULA_KEY); // Debug: should show your key now

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// GET /api/grades/overall
app.get('/api/grades/overall', async (req, res) => {
  try {
    const externalAPIUrl = 'https://api.utdnebula.com/grades/overall';
    const response = await fetch(externalAPIUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-api-key': process.env.NEBULA_KEY
      },
    });

    if (!response.ok) {
      throw new Error(`Error from Grades Nebula API: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from Nebula API:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// GET /api/events/:date
app.get('/api/events/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const externalAPIUrl = `https://api.utdnebula.com/events/${date}`;
    const response = await fetch(externalAPIUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-api-key': process.env.NEBULA_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Error EVENTS from Nebula API: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from Nebula API:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Only one app.listen call is needed.
app.listen(PORT, () => {
  console.log(`Backend server is running on port: ${PORT}`);
});