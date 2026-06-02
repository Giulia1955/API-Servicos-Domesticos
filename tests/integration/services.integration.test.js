import test from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { setupTestDB, teardownTestDB, clearDatabase } from '../setup.js';
import { createApp } from '../../src/app.js';

let app;

test('Services Integration Tests', async (t) => {
  let providerToken;
  let clientToken;
  let providerId;

  await t.before(async () => {
    await setupTestDB();
    app = createApp();
  });

  await t.after(async () => {
    await teardownTestDB();
  });

  await t.beforeEach(async () => {
    await clearDatabase();

    const providerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Maria Prestadora',
        email: 'maria@example.com',
        password: 'senha123456',
        role: 'provider',
        bio: 'Profissional',
        categories: ['limpeza']
      });

    providerToken = providerRes.body.token;
    providerId = providerRes.body.user.id;

    const clientRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'João Cliente',
        email: 'joao@example.com',
        password: 'senha123456',
        role: 'client',
        address: 'Rua A, 123'
      });

    clientToken = clientRes.body.token;
  });

  await t.test('POST /api/services - prestador cria serviço', async (t) => {
    const res = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${providerToken}`)
      .send({
        title: 'Limpeza residencial',
        description: 'Limpeza completa',
        category: 'limpeza',
        pricingType: 'hourly',
        price: 150.00
      });

    assert.strictEqual(res.status, 201);
    assert.ok(res.body._id);
    assert.strictEqual(res.body.title, 'Limpeza residencial');
  });

  await t.test('GET /api/services - listar serviços', async (t) => {
    await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${providerToken}`)
      .send({
        title: 'Limpeza residencial',
        description: 'Limpeza completa',
        category: 'limpeza',
        pricingType: 'hourly',
        price: 150.00
      });

    const res = await request(app)
      .get('/api/services');

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  await t.test('GET /api/services/:id - obter serviço específico', async (t) => {
    const createRes = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${providerToken}`)
      .send({
        title: 'Limpeza residencial',
        description: 'Limpeza completa',
        category: 'limpeza',
        pricingType: 'hourly',
        price: 150.00
      });

    const serviceId = createRes.body._id;

    const res = await request(app)
      .get(`/api/services/${serviceId}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body._id, serviceId);
  });
});
