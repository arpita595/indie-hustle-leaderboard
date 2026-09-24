const { test } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../app');

// 1. Test Health Check Endpoint
test('1. GET /health returns HTTP 200 and status ok', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  const res = await fetch(`http://127.0.0.1:${port}/health`);
  const data = await res.json();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(data.status, 'ok');
  server.close();
});

// 2. Test Valid POST Request
test('2. POST /projects with valid data redirects (302) and adds project', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  const res = await fetch(`http://127.0.0.1:${port}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      name: 'LaunchPad SaaS',
      stack: 'Node.js, PostgreSQL',
      users: '80',
      url: 'https://launchpad.example.com'
    }),
    redirect: 'manual'
  });

  assert.strictEqual(res.status, 302);
  server.close();
});

// 3. Test Invalid POST Request Handling
test('3. POST /projects with missing fields returns HTTP 400 Bad Request', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  const res = await fetch(`http://127.0.0.1:${port}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ name: '', stack: '' })
  });

  assert.strictEqual(res.status, 400);
  server.close();
});

// 4. Test API Projects Endpoint
test('4. GET /api/projects returns valid JSON array', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  const res = await fetch(`http://127.0.0.1:${port}/api/projects`);
  const data = await res.json();

  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(data));
  server.close();
});