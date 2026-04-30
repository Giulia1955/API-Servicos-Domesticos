import { Message } from "../models/Message.js";
import { ServiceRequest } from "../models/ServiceRequest.js";
import { AppError, asyncHandler } from "../utils/http.js";
import { createAndDispatchNotification } from "../services/notificationService.js";

function assertParticipant(request, userId) {
  return String(request.client) === String(userId) || String(request.provider) === String(userId);
}

export const listMessagesByRequest = asyncHandler(async (req, res) => {
  const request = await ServiceRequest.findById(req.params.requestId);
  if (!request) {
    throw new AppError(404, "Solicitacao nao encontrada.");
  }
  if (request.status !== "accepted") {
    throw new AppError(400, "Chat disponivel apenas para solicitacoes aceitas.");
  }
  if (!assertParticipant(request, req.user._id)) {
    throw new AppError(403, "Sem permissao para acessar mensagens desta solicitacao.");
  }

  const messages = await Message.find({ request: request._id }).sort({ createdAt: 1 });
  res.json(messages);
});

export const sendMessageByRequest = asyncHandler(async (req, res) => {
  const request = await ServiceRequest.findById(req.params.requestId);
  if (!request) {
    throw new AppError(404, "Solicitacao nao encontrada.");
  }
  if (request.status !== "accepted") {
    throw new AppError(400, "Chat disponivel apenas para solicitacoes aceitas.");
  }
  if (!assertParticipant(request, req.user._id)) {
    throw new AppError(403, "Sem permissao para enviar mensagens desta solicitacao.");
  }

  const content = String(req.body.content || "").trim();
  if (!content) {
    throw new AppError(400, "Campo obrigatorio: content.");
  }

  const senderId = String(req.user._id);
  const receiver = String(request.client) === senderId ? request.provider : request.client;
  const message = await Message.create({
    request: request._id,
    sender: req.user._id,
    receiver,
    content,
  });

  if (req.io) {
    req.io.to(`request:${String(request._id)}`).emit("chat:new_message", {
      id: message._id,
      request: message.request,
      sender: message.sender,
      receiver: message.receiver,
      content: message.content,
      createdAt: message.createdAt,
    });
  }

  await createAndDispatchNotification(req.io, {
    user: receiver,
    request: request._id,
    type: "chat_message",
    message: "Nova mensagem recebida no chat.",
    sound: "message",
  });

  res.status(201).json(message);
});
