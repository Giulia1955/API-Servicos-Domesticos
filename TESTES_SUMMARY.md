# 📋 Sumário de Testes

## Overview

Uma suite **compacta e essencial** de testes para a API de Serviços Domésticos.

## 📁 Estrutura

```
tests/
├── setup.js                           ✅ Configuração (MongoDB em memória)
├── README.md                          ✅ Guia de execução
├── unit/
│   ├── utils.test.js                  ✅ 3 testes (utilitários)
│   └── auth.controller.test.js        ✅ 7 testes (autenticação)
└── integration/
    ├── auth.integration.test.js       ✅ 6 testes (autenticação)
    └── services.integration.test.js   ✅ 3 testes (serviços)
```

## ✅ Total de Testes: 19

| Tipo | Arquivo | Testes |
|------|---------|--------|
| **Unitários** | utils.test.js | 3 |
| **Unitários** | auth.controller.test.js | 7 |
| **Integrados** | auth.integration.test.js | 6 |
| **Integrados** | services.integration.test.js | 3 |
| | **TOTAL** | **19** |

## 🎯 O que é Testado

### Unitários (10 testes)

**tests/unit/utils.test.js** (3)
- ✅ Cálculo de distância Haversine
- ✅ Distância simétrica
- ✅ Distância zero (mesmo ponto)

**tests/unit/auth.controller.test.js** (7)
- ✅ Register - criar usuário
- ✅ Register - email duplicado
- ✅ Register - campos obrigatórios
- ✅ Register - role inválida
- ✅ Login - sucesso
- ✅ Login - credenciais inválidas
- ✅ Login - senha incorreta

### Integrados (9 testes)

**tests/integration/auth.integration.test.js** (6)
- ✅ Register cliente
- ✅ Register - rejeitar duplicado
- ✅ Login com sucesso
- ✅ Login - credenciais inválidas
- ✅ GET /me com token
- ✅ GET /me sem token

**tests/integration/services.integration.test.js** (3)
- ✅ Criar serviço
- ✅ Listar serviços
- ✅ Obter serviço específico

## 🚀 Como Começar

```bash
# 1. Instalar dependências
npm install --save-dev mongodb-memory-server sinon supertest

# 2. Rodar testes
npm test

# 3. Modo watch
npm run test:watch
```

## 📊 Características

- ✅ **19 testes** - compactos e essenciais
- ✅ **MongoDB em memória** - sem dependências externas
- ✅ **Rápido** - 10-20 segundos
- ✅ **Unitários + Integrados** - ambos tipos
- ✅ **CI/CD pronto** - compatível com pipelines

## 📚 Documentação

- **[QUICK_START.md](QUICK_START.md)** - Comece em 30 segundos
- **[tests/README.md](tests/README.md)** - Guia detalhado

## 🔧 Scripts NPM

```bash
npm test              # Rodar testes
npm run test:watch    # Modo watch
```

---

**Status:** ✅ Pronto para uso


