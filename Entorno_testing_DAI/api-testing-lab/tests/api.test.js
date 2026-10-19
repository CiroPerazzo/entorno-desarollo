const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../src/app');
const auth = { Authorization: 'Bearer token-demo-dai' };

test('Salud: status, header y body', async () => {
  const res = await request(createApp()).get('/api/health').expect(200).expect('Content-Type', /json/);
  assert.deepEqual(res.body, { status: 'ok' });
});
test('Login válido devuelve token y no contraseña', async () => {
  const res = await request(createApp()).post('/api/login').send({ email: 'alumno@demo.com', password: 'Demo1234!' }).expect(200);
  assert.equal(res.body.token, 'token-demo-dai');
  assert.equal(res.body.user.email, 'alumno@demo.com');
  assert.equal('password' in res.body.user, false);
});
test('Login incorrecto: 401', async () => {
  await request(createApp()).post('/api/login').send({ email: 'alumno@demo.com', password: 'mal' }).expect(401).expect({ error: 'Credenciales inválidas' });
});
test('Crear sin token: 401 y sin cambios', async () => {
  const app = createApp();
  await request(app).post('/api/tasks').send({ title: 'Nueva tarea' }).expect(401);
  assert.equal((await request(app).get('/api/tasks')).body.tasks.length, 1);
});
test('Crear con token inválido: 401', async () => {
  await request(createApp()).post('/api/tasks').set('Authorization', 'Bearer incorrecto').send({ title: 'Nueva tarea' }).expect(401);
});
test('Títulos inválidos: 400 y sin cambios', async () => {
  const app = createApp();
  for (const title of ['', 'ab', '   ', 123, 'a'.repeat(101)]) {
    await request(app).post('/api/tasks').set(auth).send({ title }).expect(400);
  }
  assert.equal((await request(app).get('/api/tasks')).body.tasks.length, 1);
});
test('Flujo completo: crear, consultar, completar, borrar y consultar ausente', async () => {
  const app = createApp();
  const created = await request(app).post('/api/tasks').set(auth).send({ title: '  Probar API  ' }).expect(201).expect('Location', '/api/tasks/2');
  assert.deepEqual(created.body, { id: 2, title: 'Probar API', completed: false });
  await request(app).get('/api/tasks/2').expect(200).expect(created.body);
  const updated = await request(app).patch('/api/tasks/2').set(auth).send({ completed: true }).expect(200);
  assert.equal(updated.body.completed, true);
  await request(app).delete('/api/tasks/2').set(auth).expect(204).expect('');
  await request(app).get('/api/tasks/2').expect(404);
});
test('completed debe ser booleano: 400 y sin cambios', async () => {
  const app = createApp();
  await request(app).patch('/api/tasks/1').set(auth).send({ completed: 'true' }).expect(400);
  assert.equal((await request(app).get('/api/tasks/1')).body.completed, false);
});
test('Recurso inexistente: 404 para consulta, modificación y borrado', async () => {
  const app = createApp();
  await request(app).get('/api/tasks/999').expect(404);
  await request(app).patch('/api/tasks/999').set(auth).send({ completed: true }).expect(404);
  await request(app).delete('/api/tasks/999').set(auth).expect(404);
});
test('Reset restablece datos e identificadores', async () => {
  const app = createApp();
  await request(app).post('/api/tasks').set(auth).send({ title: 'Temporal' }).expect(201);
  await request(app).post('/api/testing/reset').expect(200).expect({ reset: true });
  assert.equal((await request(app).get('/api/tasks')).body.tasks.length, 1);
  assert.equal((await request(app).post('/api/tasks').set(auth).send({ title: 'Otra tarea' })).body.id, 2);
});
test('JSON mal formado: 400', async () => {
  await request(createApp()).post('/api/login').set('Content-Type', 'application/json').send('{').expect(400);
});
