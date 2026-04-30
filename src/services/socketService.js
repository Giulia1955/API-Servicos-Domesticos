import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ServiceRequest } from "../models/ServiceRequest.js";
import { Message } from "../models/Message.js";
import { createAndDispatchNotification } from "./notificationService.js";

export function setupSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) {
        next(new Error("Token ausente"));
        return;
      }
      const payload = jwt.verify(token, env.jwtSecret);
      const user = await User.findById(payload.sub);
      if (!user) {
        next(new Error("Usuario nao encontrado"));
        return;
      }
      socket.user = { id: String(user._id), role: user.role };
      next();
    } catch {
      next(new Error("Token invalido"));
    }
  });

  io.on("connection", (socket) => {
    const userRoom = `user:${socket.user.id}`;
    socket.join(userRoom);

    socket.on("chat:join_request", async ({ requestId }) => {
      const request = await ServiceRequest.findById(requestId);
      if (!request || request.status !== "accepted") {
        socket.emit("chat:error", { message: "Solicitacao nao aceita." });
        return;
      }

      const isParticipant =
        String(request.client) === socket.user.id || String(request.provider) === socket.user.id;
      if (!isParticipant) {
        socket.emit("chat:error", { message: "Usuario nao participa desta solicitacao." });
        return;
      }

      socket.join(`request:${requestId}`);
      socket.emit("chat:joined", { requestId });
    });

    socket.on("chat:send", async ({ requestId, content }) => {
      if (!content || !String(content).trim()) {
        socket.emit("chat:error", { message: "Mensagem vazia." });
        return;
      }

      const request = await ServiceRequest.findById(requestId);
      if (!request || request.status !== "accepted") {
        socket.emit("chat:error", { message: "Chat disponivel apenas para solicitacoes aceitas." });
        return;
      }

      const senderId = socket.user.id;
      const senderIsClient = String(request.client) === senderId;
      const senderIsProvider = String(request.provider) === senderId;
      if (!senderIsClient && !senderIsProvider) {
        socket.emit("chat:error", { message: "Usuario nao autorizado." });
        return;
      }

      const receiver = senderIsClient ? request.provider : request.client;
      const message = await Message.create({
        request: request._id,
        sender: senderId,
        receiver,
        content: String(content).trim(),
      });

      const eventPayload = {
        id: message._id,
        request: message.request,
        sender: message.sender,
        receiver: message.receiver,
        content: message.content,
        createdAt: message.createdAt,
      };

      io.to(`request:${requestId}`).emit("chat:new_message", eventPayload);
      await createAndDispatchNotification(io, {
        user: receiver,
        request: request._id,
        type: "chat_message",
        message: "Nova mensagem recebida no chat.",
        sound: "message",
      });
    });
  });

  return io;
}
