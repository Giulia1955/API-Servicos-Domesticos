import { Service } from "../models/Service.js";
import { ServiceRequest } from "../models/ServiceRequest.js";
import { AppError, asyncHandler } from "../utils/http.js";
import { createAndDispatchNotification } from "../services/notificationService.js";

export const createRequest = asyncHandler(async (req, res) => {
  const { serviceId, details, scheduledAt } = req.body;
  if (!serviceId) {
    throw new AppError(400, "Campo obrigatorio: serviceId.");
  }

  const service = await Service.findById(serviceId);
  if (!service) {
    throw new AppError(404, "Servico nao encontrado.");
  }
  if (String(service.provider) === String(req.user._id)) {
    throw new AppError(400, "Nao e permitido solicitar o proprio servico.");
  }

  const request = await ServiceRequest.create({
    service: service._id,
    client: req.user._id,
    provider: service.provider,
    details: details || "",
    scheduledAt: scheduledAt || null,
    priceSnapshot: service.price,
  });

  await createAndDispatchNotification(req.io, {
    user: service.provider,
    request: request._id,
    type: "request_pending",
    message: "Nova solicitacao pendente recebida.",
    sound: "alert",
  });

  res.status(201).json(request);
});

export const listMyRequests = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === "provider"
      ? { provider: req.user._id }
      : { client: req.user._id };

  const requests = await ServiceRequest.find(filter)
    .populate("service", "title category pricingType price")
    .populate("client", "name email address location")
    .populate("provider", "name email address location")
    .sort({ createdAt: -1 });

  res.json(requests);
});

export const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["accepted", "completed"].includes(status)) {
    throw new AppError(400, "Status permitido: accepted ou completed.");
  }

  const request = await ServiceRequest.findById(req.params.id);
  if (!request) {
    throw new AppError(404, "Solicitacao nao encontrada.");
  }

  const isProvider = String(request.provider) === String(req.user._id);
  const isClient = String(request.client) === String(req.user._id);

  if (status === "accepted") {
    if (!isProvider) {
      throw new AppError(403, "Apenas o prestador pode aceitar a solicitacao.");
    }
    if (request.status !== "pending") {
      throw new AppError(400, "Somente solicitacoes pendentes podem ser aceitas.");
    }
    request.status = "accepted";
    await request.save();
    await createAndDispatchNotification(req.io, {
      user: request.client,
      request: request._id,
      type: "request_accepted",
      message: "Sua solicitacao foi aceita.",
      sound: "success",
    });
    res.json(request);
    return;
  }

  if (!isProvider && !isClient) {
    throw new AppError(403, "Apenas participantes da solicitacao podem concluir.");
  }
  if (request.status !== "accepted") {
    throw new AppError(400, "Somente solicitacoes aceitas podem ser concluidas.");
  }

  request.status = "completed";
  await request.save();

  const targetUser = isProvider ? request.client : request.provider;
  await createAndDispatchNotification(req.io, {
    user: targetUser,
    request: request._id,
    type: "request_completed",
    message: "Solicitacao concluida.",
    sound: "success",
  });

  res.json(request);
});
