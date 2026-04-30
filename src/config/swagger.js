import swaggerJsdoc from "swagger-jsdoc";

const definition = {
  openapi: "3.0.3",
  info: {
    title: "Plataforma de Servicos Locais API",
    version: "1.0.0",
    description:
      "API REST para clientes e prestadores com autenticacao, servicos, solicitacoes, avaliacoes, chat e pagamento simulado.",
  },
  servers: [{ url: "http://localhost:3000" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: {
          200: {
            description: "Servidor online",
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        summary: "Cadastro de usuario",
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Login de usuario",
      },
    },
    "/api/services": {
      get: {
        summary: "Listar servicos com filtros e geolocalizacao",
      },
      post: {
        summary: "Criar servico (provider)",
        security: [{ bearerAuth: [] }],
      },
    },
    "/api/requests": {
      post: {
        summary: "Criar solicitacao (client)",
        security: [{ bearerAuth: [] }],
      },
    },
    "/api/requests/me": {
      get: {
        summary: "Listar solicitacoes do usuario autenticado",
        security: [{ bearerAuth: [] }],
      },
    },
    "/api/reviews": {
      post: {
        summary: "Criar avaliacao (client)",
        security: [{ bearerAuth: [] }],
      },
    },
    "/api/payments/simulate": {
      post: {
        summary: "Pagamento simulado",
        security: [{ bearerAuth: [] }],
      },
    },
  },
};

export const swaggerSpec = swaggerJsdoc({
  definition,
  apis: [],
});
