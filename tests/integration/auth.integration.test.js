import test from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { setupTestDB, teardownTestDB, clearDatabase } from '../setup.js';
import { createApp } from '../../src/app.js';
import { User } from '../../src/models/User.js';

let app;

test('Auth Integration Tests', async (t) => {
  await t.before(async () => {
    await setupTestDB();
    app = createApp();
  });

  await t.after(async () => {
    await teardownTestDB();
  });

  await t.beforeEach(async () => {
    await clearDatabase();
  });

  await t.test('POST /api/auth/register - registrar novo cliente', async (t) => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123456',
        role: 'client',
        address: 'Rua A, 123, São Paulo, SP'
      });

    assert.strictEqual(res.status, 201);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.email, 'joao@example.com');

    const user = await User.findOne({ email: 'joao@example.com' });
    assert.ok(user);
  });

  await t.test('POST /api/auth/register - rejeitar email duplicado', async (t) => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123456',
        role: 'client',
        address: 'Rua A, 123'
      });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Outro João',
        email: 'joao@example.com',
        password: 'outraSenha',
        role: 'client',
        address: 'Rua B, 456'
      });

    assert.strictEqual(res.status, 409);
  });

  await t.test('POST /api/auth/login - fazer login com sucesso', async (t) => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123456',
        role: 'client',
        address: 'Rua A, 123'
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'joao@example.com',
        password: 'senha123456'
      });

    assert.strictEqual(res.status, 200);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.email, 'joao@example.com');
  });

  await t.test('POST /api/auth/login - rejeitar credenciais inválidas', async (t) => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'inexistente@example.com',
        password: 'qualquerSenha'
      });

    assert.strictEqual(res.status, 401);
  });

  await t.test('GET /api/auth/me - retornar dados do usuário autenticado', async (t) => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123456',
        role: 'client',
        address: 'Rua A, 123'
      });

    const token = registerRes.body.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.email, 'joao@example.com');
  });

  await t.test('GET /api/auth/me - rejeitar sem token', async (t) => {
    const res = await request(app)
      .get('/api/auth/me');

    assert.strictEqual(res.status, 401);
  });
});
