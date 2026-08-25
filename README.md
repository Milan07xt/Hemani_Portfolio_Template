Contact form server

This repository contains a static portfolio site and a small Node/Express server (server.js) that accepts contact form submissions and appends them to `contact.csv`.

Quick start

1. Install Node.js (if you don't have it): https://nodejs.org/
2. Open a terminal in the project folder:

```powershell
cd "c:\Users\ABC\Downloads\Milan_Portfolio_Website"
npm install
npm run start:local
```

3. Serve the site files in a browser. Easiest options:
- Use VS Code Live Server extension to serve the site (recommended). Open `index.html` via Live Server (e.g., http://127.0.0.1:5500).
- Or open `index.html` directly — the form uses fetch to http://localhost:3000 so the server must be running. If you open the file via `file://` origin some browsers may restrict requests; use Live Server if you see CORS/network errors.

4. Fill and submit the contact form. Submissions are appended to `contact.csv`.

Notes
- The server allows any origin (CORS '*') so it can receive requests from the page served from Live Server or other local hosts.
- `contact.csv` will be created if missing and will contain header row: Name,Mail,Number,Subject,Message

If you want I can also add a simple confirmation UI or save a timestamp column — tell me which option you prefer.
