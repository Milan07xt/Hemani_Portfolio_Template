require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const sqlite3 = require('sqlite3').verbose();

const app = express();

function startAIAgentBackend() {
  const backendDir = path.join(__dirname, 'ai-agent', 'backend');
  const pythonExecutable = process.platform === 'win32'
    ? path.join(backendDir, 'venv', 'Scripts', 'python.exe')
    : path.join(backendDir, 'venv', 'bin', 'python');

  const command = fs.existsSync(pythonExecutable) ? pythonExecutable : (process.platform === 'win32' ? 'python' : 'python3');
  const args = fs.existsSync(pythonExecutable)
    ? ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8000']
    : ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8000'];

  const child = spawn(command, args, {
    cwd: backendDir,
    stdio: 'inherit',
    env: process.env
  });

  child.on('error', (err) => {
    console.error('Failed to start AI backend:', err.message);
  });

  return child;
}

startAIAgentBackend();
// Serve static site files so visiting http://localhost:3000 shows your portfolio
app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());

// Initialize SQLite3 Database
const dbPath = path.join(__dirname, 'portfolio.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Auto-create the contacts table on startup
function initDb() {
  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      number TEXT,
      subject TEXT,
      message TEXT,
      timestamp TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Failed to initialize SQLite table:', err);
    } else {
      console.log('SQLite database initialized');
    }
  });
}
initDb();

app.post('/submit-contact', async (req, res) => {
  try {
    const { name, email, number, subject, message } = req.body || {};
    if (!name || !email) {
      return res.status(400).send('Name and email are required');
    }

    // Capture metadata
    const timestamp = new Date().toISOString();
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const referrer = req.headers['referer'] || req.headers['referrer'] || 'Direct';

    // Parse user agent to extract browser and device info
    let browser = 'Unknown';
    let device = 'Unknown';

    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Opera')) browser = 'Opera';

    if (userAgent.includes('Mobile')) device = 'Mobile';
    else if (userAgent.includes('Tablet')) device = 'Tablet';
    else if (userAgent.includes('iPad')) device = 'Tablet';
    else device = 'Desktop';

    // Insert into SQLite or fallback to CSV
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO contacts (name, email, number, subject, message, timestamp) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, number || '', subject || '', message || '', timestamp],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    }).catch(dbErr => {
      console.error('Database insert failed, falling back to CSV:', dbErr.message);
      const fs = require('fs');
      const csvLine = `"${name.replace(/"/g, '""')}","${email.replace(/"/g, '""')}","${(number||'').replace(/"/g, '""')}","${(subject||'').replace(/"/g, '""')}","${(message||'').replace(/"/g, '""')}","${timestamp}"\n`;
      fs.appendFileSync(path.join(__dirname, 'contact.csv'), csvLine);
    });


    // Prepare email notification formatting
    const detailedContent = `
╔═══════════════════════════════════════════════════════════════════════════╗
║                    NEW PORTFOLIO CONTACT SUBMISSION                        ║
╚═══════════════════════════════════════════════════════════════════════════╝

📋 VISITOR INFORMATION:
  • Name: ${name}
  • Email: ${email}
  • Phone: ${number || 'Not provided'}

📝 MESSAGE DETAILS:
  • Subject: ${subject || 'No subject'}
  • Message: ${message || 'No message'}

🔍 TECHNICAL INFORMATION:
  • IP Address: ${ipAddress}
  • Browser: ${browser}
  • Device: ${device}
  • User Agent: ${userAgent}
  • Referrer: ${referrer}

⏰ TIMESTAMP:
  • ${timestamp}

═══════════════════════════════════════════════════════════════════════════
`;

    // Send email logic has been moved to the frontend (script.js) 
    // to bypass Cloudflare's serverless bot protection.

    // Send SMS notification via SMS API (using free SMS service)
    const smsMessage = `📱 New Portfolio Contact!\nName: ${name}\nEmail: ${email}\nPhone: ${number || 'N/A'}\nSubject: ${subject || 'No subject'}\nMessage: ${message?.substring(0, 50) || 'N/A'}...`;

    fetch('https://api.sandbox.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'username': process.env.SMS_USERNAME || 'sandbox',
        'APIkey': process.env.SMS_API_KEY || '',
        'recipients': '9327599254',
        'message': smsMessage
      })
    }).then(async (response) => {
      if (response.ok) {
        console.log('📱 SMS notification sent to 9327599254');
      }
    }).catch(error => {
      // Silently fail if SMS is not configured
    });

    res.status(200).send('Saved');
  } catch (err) {
    console.error('Unexpected error in /submit-contact', err);
    res.status(500).send('Server error');
  }
});

// Admin Login (simple password verification)
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (password === 'milan123') { // Simple secure password for local dashboard
    return res.status(200).json({ token: 'milan_session_token_xyz' });
  }
  return res.status(401).send('Incorrect password');
});

// Middleware helper to check token
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader === 'Bearer milan_session_token_xyz') {
    return next();
  }
  return res.status(401).send('Unauthorized');
}

// Get all contacts from Database
app.get('/api/admin/contacts', requireAuth, (req, res) => {
  db.all('SELECT * FROM contacts ORDER BY id ASC', [], (err, rows) => {
    if (err) {
      console.error('Failed to read contacts DB', err);
      return res.status(500).send('Failed to read contacts');
    }
    const contacts = rows.map(row => ({
      ...row,
      index: row.id
    }));
    res.json(contacts);
  });
});

// Delete specific contact by id (mapped from index)
app.post('/api/admin/contacts/delete', requireAuth, (req, res) => {
  const { index } = req.body;
  if (index === undefined) return res.status(400).send('Index is required');

  db.run('DELETE FROM contacts WHERE id = ?', [index], function(err) {
    if (err) {
      console.error('Failed to delete contact', err);
      return res.status(500).send('Failed to delete');
    }
    res.status(200).send('Deleted successfully');
  });
});

// Clear all contacts
app.post('/api/admin/contacts/clear', requireAuth, (req, res) => {
  db.run('DELETE FROM contacts', [], function(err) {
    if (err) {
      console.error('Failed to clear contacts', err);
      return res.status(500).send('Failed to clear');
    }
    // Also reset auto-increment
    db.run("DELETE FROM sqlite_sequence WHERE name='contacts'", [], () => {
      res.status(200).send('Cleared all contacts');
    });
  });
});

// Health check
app.get('/health', (req, res) => res.send('OK'));

// API Chat endpoint (mirroring Vercel Serverless Function)
try {
  const chatHandler = require('./api/chat.js');
  app.post('/api/chat', chatHandler);
  app.options('/api/chat', chatHandler);
} catch (err) {
  console.error('Failed to load local chat handler:', err);
}

// Default route: send index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Contact server listening on http://localhost:${port}`);
});
