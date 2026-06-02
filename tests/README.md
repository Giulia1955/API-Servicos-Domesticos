# 🧪 Testes da API

Suite de testes unitários e integrados para a API de Serviços Domésticos.

## Estrutura

```
tests/
├── setup.js                       # Configuração (MongoDB em memória)
├── unit/
│   ├── utils.test.js              # Testes de utilidades (3 testes)
│   └── auth.controller.test.js    # Testes de autenticação (7 testes)
└── integration/
    ├── auth.integration.test.js    # Autenticação (7 testes)
    └── services.integration.test.js# Serviços (3 testes)
```

**Total: 20 testes** (10 unitários + 10 integrados)

## Executar

```bash
# Instalar dependências
npm install --save-dev mongodb-memory-server sinon supertest

# Rodar todos os testes
npm test

# Modo watch
npm run test:watch

# Apenas unitários
npm test tests/unit/*.test.js

# Apenas integrados
npm test tests/integration/*.test.js
```

## Testes Implementados

### 🧪 Unitários (10 testes)

**tests/unit/utils.test.js** (3 testes)
- ✅ Cálculo de distância Haversine
- ✅ Distância simétrica
- ✅ Distância zero (mesmo ponto)

**tests/unit/auth.controller.test.js** (7 testes)
- ✅ Register - criar usuário
- ✅ Register - email duplicado
- ✅ Register - validar campos obrigatórios
- ✅ Register - role inválida
- ✅ Login - sucesso
- ✅ Login - credenciais inválidas
- ✅ Login - senha incorreta

### 🔗 Integrados (10 testes)

**tests/integration/auth.integration.test.js** (7 testes)
- ✅ Register cliente
- ✅ Register - rejeitar duplicado
- ✅ Login com sucesso
- ✅ Login - credenciais inválidas
- ✅ GET /me com token
- ✅ GET /me sem token
- ✅ Fluxo completo auth

**tests/integration/services.integration.test.js** (3 testes)
- ✅ POST /api/services - criar
- ✅ GET /api/services - listar
- ✅ GET /api/services/:id - obter um

## Configuração de Banco

Usa `mongodb-memory-server` para criar banco em memória:
- ✅ Sem dependência com MongoDB externo
- ✅ Testes rápidos e isolados
- ✅ Cada teste começa limpo

## Exemplos

### Teste Unitário

```javascript
import test from 'node:test';
import assert from 'node:assert';
import sinon from 'sinon';

test('should do something', async (t) => {
  let stub = sinon.stub(Module, 'method').resolves(data);

  // test logic
  
  assert.strictEqual(result, expected);
  sinon.restore();
});
```

### Teste Integrado

```javascript
import request from 'supertest';

test('POST /api/endpoint', async (t) => {
  const res = await request(app)
    .post('/api/endpoint')
    .send({ data });

  assert.strictEqual(res.status, 201);
});
```

## Troubleshooting

**Erro: "Cannot find module"**
```bash
npm install && npm install --save-dev mongodb-memory-server sinon supertest
```

**Testes em timeout**
- Aumentar timeout: `node --test-timeout=10000 tests/**/*.test.js`

**Limpar tudo**
```bash
rm -rf node_modules package-lock.json
npm install --save-dev mongodb-memory-server sinon supertest
```

