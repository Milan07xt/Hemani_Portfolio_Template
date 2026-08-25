/**
 * Vercel Serverless Function for Contact Submissions
 * Handles contact form submissions on Vercel gracefully.
 */

async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, number, subject, message } = req.body || {};
    
    if (!name || !email) {
        return res.status(400).send('Name and email are required');
    }

    const timestamp = new Date().toISOString();

    // If POSTGRES_URL is configured, try database insertion safely
    if (process.env.POSTGRES_URL) {
      try {
        const { Pool } = require('pg');
        const connectionUrl = process.env.POSTGRES_URL.split('?')[0];
        const pool = new Pool({
          connectionString: connectionUrl,
          ssl: { rejectUnauthorized: false }
        });
        await pool.query(
          `INSERT INTO contacts (name, email, number, subject, message, timestamp) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [name, email, number || '', subject || '', message || '', timestamp]
        );
        await pool.end();
      } catch (dbError) {
        console.warn('Postgres insertion warning (skipped):', dbError.message);
      }
    }

    return res.status(200).send('Saved');

  } catch (error) {
    console.error('Contact API Error:', error);
    return res.status(500).send(`Failed to process message: ${error.message}`);
  }
}

module.exports = handler;

