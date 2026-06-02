# ⚡ Quick Start - Testes

## 30 Segundos para Começar

### 1️⃣ Instalar Dependências

```bash
npm install --save-dev mongodb-memory-server sinon supertest
```

### 2️⃣ Rodar Testes

```bash
npm test
```

## 📌 Comandos

| Comando | Descrição |
|---------|-----------|
| `npm test` | Todos os testes |
| `npm run test:watch` | Modo watch |
| `npm test tests/unit/*.test.js` | Unitários |
| `npm test tests/integration/*.test.js` | Integrados |

## 🎯 Estrutura (19 testes)

```
✅ Utilidades           (3 testes)
✅ Auth (unitário)      (7 testes)
✅ Auth (integrado)     (6 testes)
✅ Serviços (integrado) (3 testes)
```

## 📚 Documentação

- **[tests/README.md](tests/README.md)** - Guia detalhado
- **[TESTES_SUMMARY.md](TESTES_SUMMARY.md)** - Overview

## 🆘 Troubleshooting

```bash
# Reinstalar tudo
rm -rf node_modules package-lock.json
npm install --save-dev mongodb-memory-server sinon supertest
npm test
```


