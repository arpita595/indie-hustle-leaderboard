const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// In-memory data store for side-hustle projects
const projects = [
  {
    id: 1,
    name: 'DevPulse Analytics',
    stack: 'Node.js, Express',
    users: 120,
    url: 'https://devpulse.example.com'
  },
  {
    id: 2,
    name: 'PromptCraft AI',
    stack: 'Python, Flask',
    users: 450,
    url: 'https://promptcraft.example.com'
  }
];

// Helper function to prevent XSS (escapes user input)
const esc = (s) => String(s || '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// Read dynamic commit SHA provided by Render or local environment
const sha = process.env.GIT_SHA || process.env.RENDER_GIT_COMMIT || 'local-dev';
const commit = sha.slice(0, 7);

// 1. Home Page Route - Renders dynamic HTML leaderboard & submission form
app.get('/', (req, res) => {
  const totalUsers = projects.reduce((sum, p) => sum + p.users, 0);

  const rows = projects
    .map(
      (p) => `
      <tr>
        <td><b>${esc(p.name)}</b></td>
        <td><code>${esc(p.stack)}</code></td>
        <td>${p.users.toLocaleString()} users</td>
        <td><a href="${esc(p.url)}" target="_blank">Visit Site</a></td>
      </tr>`
    )
    .join('');

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Indie Hacker Micro-SaaS Leaderboard</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #333; }
    h1 { color: #2563eb; margin-bottom: 5px; }
    .stats { background: #f3f4f6; padding: 12px 20px; border-radius: 8px; font-weight: bold; margin-bottom: 25px; }
    form { background: #fafafa; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 30px; }
    .form-group { margin-bottom: 12px; }
    label { display: block; font-weight: 600; margin-bottom: 4px; font-size: 0.9em; }
    input { width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; }
    button { background: #2563eb; color: white; border: none; padding: 10px 18px; border-radius: 4px; cursor: pointer; font-weight: bold; }
    button:hover { background: #1d4ed8; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th, td { text-align: left; padding: 10px; border-bottom: 1px solid #e5e7eb; }
    th { background: #f8fafc; }
    footer { margin-top: 40px; text-align: center; font-size: 0.85em; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 15px; }
  </style>
</head>
<body>
  <h1>🚀 Indie Hacker Micro-SaaS Leaderboard</h1>
  <p>Showcase your side-hustle, track active users, and discover student projects.</p>

  <div class="stats">
    📊 Total Registered SaaS Projects: ${projects.length} | 👥 Total Active Users: ${totalUsers.toLocaleString()}
  </div>

  <form method="POST" action="/projects">
    <h3>Register Your Side-Hustle</h3>
    <div class="form-group">
      <label>Project Name:</label>
      <input name="name" placeholder="e.g. Acme Analytics" required>
    </div>
    <div class="form-group">
      <label>Tech Stack:</label>
      <input name="stack" placeholder="e.g. Node.js, React" required>
    </div>
    <div class="form-group">
      <label>Active Users Count:</label>
      <input name="users" type="number" min="0" placeholder="e.g. 150" required>
    </div>
    <div class="form-group">
      <label>Live URL:</label>
      <input name="url" type="url" placeholder="https://myproject.com" required>
    </div>
    <button type="submit">Submit to Leaderboard</button>
  </form>

  <h2>🏆 Live Community Leaderboard</h2>
  <table>
    <thead>
      <tr>
        <th>Project Name</th>
        <th>Tech Stack</th>
        <th>Active Users</th>
        <th>Link</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <footer>
    Indie Hacker Leaderboard | Running Commit: <code>${commit}</code>
  </footer>
</body>
</html>`);
});

// 2. POST Route - Validates input and adds new project
app.post('/projects', (req, res) => {
  const { name, stack, users, url } = req.body;

  // Input Validation (Rejects empty fields or invalid user numbers)
  if (!name || !stack || users === undefined || users === '' || isNaN(Number(users)) || !url) {
    return res.status(400).send('Bad Request: All fields (name, stack, numeric users, url) are required.');
  }

  projects.push({
    id: projects.length + 1,
    name: String(name).trim(),
    stack: String(stack).trim(),
    users: parseInt(users, 10),
    url: String(url).trim()
  });

  res.redirect('/');
});

// 3. JSON API Endpoint (Required by rubric)
app.get('/api/projects', (req, res) => res.json(projects));

// 4. Health Check Endpoint (Required by rubric)
app.get('/health', (req, res) => res.json({ status: 'ok', commit }));

module.exports = app;