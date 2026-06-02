import test from 'node:test';
import assert from 'node:assert';
import { haversineDistanceKm as calculateDistance } from '../../src/utils/haversine.js';
test('calculateDistance - deve calcular a distancia corretamente entre duas coordenadas', async (t) => {
  // São Paulo para Rio de Janeiro
  const lat1 = -23.5505;
  const lng1 = -46.6333;
  const lat2 = -22.9068;
  const lng2 = -43.1729;

  const distance = calculateDistance(lat1, lng1, lat2, lng2);

  // Distância real é aproximadamente 361 km
  assert.strictEqual(typeof distance, 'number');
  assert.ok(distance > 350 && distance < 380, `Distance should be ~361 km, got ${distance}`);
});

test('calculateDistance - distancia entre mesmo ponto deve ser zero', async (t) => {
  const lat = -23.5505;
  const lng = -46.6333;

  const distance = calculateDistance(lat, lng, lat, lng);

  assert.strictEqual(distance, 0);
});

test('calculateDistance - distancia deve ser simetrica', async (t) => {
  const lat1 = -23.5505;
  const lng1 = -46.6333;
  const lat2 = -22.9068;
  const lng2 = -43.1729;

  const distance1 = calculateDistance(lat1, lng1, lat2, lng2);
  const distance2 = calculateDistance(lat2, lng2, lat1, lng1);

  assert.strictEqual(distance1, distance2);
});
