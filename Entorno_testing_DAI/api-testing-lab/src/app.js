const express = require('express');

// Cada instancia tiene sus propios datos: Supertest no modifica la demo abierta.
function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));
  let tasks, nextId;
  function reset() {
    tasks = [{ id: 1, title: 'Preparar presentación DAI', completed: false }];
    nextId = 2;
  }
  reset();
  const token = 'token-demo-dai'; // Simulación didáctica: no es JWT ni autenticación real.
  app.get('/', (_req, res) => res.type('html').send(`<!doctype html><html lang="es"><meta charset="utf-8"><title>Laboratorio DAI</title><style>body{font:18px system-ui;max-width:800px;margin:60px auto;padding:20px;background:#f4f7fb;color:#17243b}code{background:#e0e8f3;padding:3px 6px}li{margin:16px 0}</style><h1>Laboratorio de testing de APIs</h1><p>La API está encendida. Usá Postman, Insomnia o Newman para probarla.</p><ul><li><a href="/api/health">GET /api/health</a>: estado del servidor</li><li><a href="/api/tasks">GET /api/tasks</a>: tareas actuales</li><li>POST /api/login: usuario <code>alumno@demo.com</code> y contraseña <code>Demo1234!</code></li><li>POST, PATCH y DELETE de tareas requieren <code>Authorization: Bearer token-demo-dai</code></li></ul><p>Datos en memoria. Al reiniciar vuelven al estado inicial. Solo para práctica local.</p></html>`));
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.post('/api/testing/reset', (_req, res) => { reset(); res.json({ reset: true }); });
  app.post('/api/login', (req, res) => {
    const { email, password } = req.body || {};
    if (email !== 'alumno@demo.com' || password !== 'Demo1234!') {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    res.json({ token, user: { id: 1, email } });
  });
  app.get('/api/tasks', (_req, res) => res.json({ tasks }));
  app.get('/api/tasks/:id', (req, res) => {
    const task = tasks.find(t => String(t.id) === req.params.id);
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json(task);
  });
  function auth(req, res, next) {
    if (req.get('Authorization') !== `Bearer ${token}`) {
      return res.status(401).json({ error: 'Token ausente o inválido' });
    }
    next();
  }
  function validTitle(title) {
    return typeof title === 'string' && title.trim().length >= 3 && title.trim().length <= 100;
  }
  app.post('/api/tasks', auth, (req, res) => {
    if (!validTitle(req.body?.title)) return res.status(400).json({ error: 'El título debe tener entre 3 y 100 caracteres' });
    const task = { id: nextId++, title: req.body.title.trim(), completed: false };
    tasks.push(task);
    res.status(201).location(`/api/tasks/${task.id}`).json(task);
  });
  app.patch('/api/tasks/:id', auth, (req, res) => {
    const task = tasks.find(t => String(t.id) === req.params.id);
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
    if (typeof req.body?.completed !== 'boolean') return res.status(400).json({ error: 'completed debe ser booleano' });
    task.completed = req.body.completed;
    res.json(task);
  });
  app.delete('/api/tasks/:id', auth, (req, res) => {
    const index = tasks.findIndex(t => String(t.id) === req.params.id);
    if (index < 0) return res.status(404).json({ error: 'Tarea no encontrada' });
    tasks.splice(index, 1);
    res.status(204).end();
  });
  app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
  app.use((err, _req, res, _next) => {
    const status = err.status >= 400 && err.status < 500 ? err.status : 500;
    res.status(status).json({ error: status === 500 ? 'Error interno' : 'JSON inválido o cuerpo demasiado grande' });
  });
  return app;
}
module.exports = { createApp };
