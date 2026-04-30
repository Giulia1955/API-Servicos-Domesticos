export function notFoundHandler(_req, res) {
  res.status(404).json({ message: "Rota nao encontrada." });
}

export function errorHandler(error, _req, res, _next) {
  const status = error.status || 500;
  const message = error.message || "Erro interno do servidor.";
  res.status(status).json({ message });
}
