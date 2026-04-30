# Plataforma de Servicos Locais - API

API RESTful para o MVP da plataforma de servicos locais, com:
- cadastro/login com JWT e hash de senha
- perfis `client` e `provider`
- cadastro e busca de servicos com filtro por categoria/preco/proximidade
- solicitacoes com status `pending -> accepted -> completed`
- avaliacoes de 1 a 5 com comentario
- chat em tempo real com Socket.IO (somente para solicitacoes aceitas)
- notificacoes persistidas + eventos em tempo real
- pagamento simulado
- documentacao Swagger

## Executar

1. Instale dependencias:
```bash
npm install
```

2. Configure ambiente:
```bash
cp .env.example .env
```

3. Inicie a API:
```bash
npm start
```

Swagger: `http://localhost:3000/api/docs`

## Scripts

- `npm start`: inicia servidor
- `npm run dev`: modo watch
- `npm run seed`: popula dados iniciais
