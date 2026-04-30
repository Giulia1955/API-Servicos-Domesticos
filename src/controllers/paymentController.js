import crypto from "node:crypto";
import { Payment } from "../models/Payment.js";
import { ServiceRequest } from "../models/ServiceRequest.js";
import { AppError, asyncHandler } from "../utils/http.js";
import { createAndDispatchNotification } from "../services/notificationService.js";

export const simulatePayment = asyncHandler(async (req, res) => {
  const { requestId, forceFail = false } = req.body;
  if (!requestId) {
    throw new AppError(400, "Campo obrigatorio: requestId.");
  }

  const serviceRequest = await ServiceRequest.findById(requestId);
  if (!serviceRequest) {
    throw new AppError(404, "Solicitacao nao encontrada.");
  }
  if (String(serviceRequest.client) !== String(req.user._id)) {
    throw new AppError(403, "Somente o cliente pode efetuar o pagamento.");
  }
  if (serviceRequest.paymentStatus === "paid") {
    throw new AppError(409, "Solicitacao ja foi paga.");
  }

  const status = forceFail ? "simulated_failed" : "simulated_paid";
  const payment = await Payment.create({
    request: serviceRequest._id,
    client: serviceRequest.client,
    provider: serviceRequest.provider,
    amount: serviceRequest.priceSnapshot,
    status,
    reference: crypto.randomUUID(),
  });

  if (status === "simulated_paid") {
    serviceRequest.paymentStatus = "paid";
    await serviceRequest.save();
    await createAndDispatchNotification(req.io, {
      user: serviceRequest.provider,
      request: serviceRequest._id,
      type: "payment_received",
      message: "Pagamento simulado confirmado para a solicitacao.",
      sound: "success",
    });
  }

  res.status(201).json(payment);
});
