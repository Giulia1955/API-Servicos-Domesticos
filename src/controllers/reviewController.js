import { Review } from "../models/Review.js";
import { ServiceRequest } from "../models/ServiceRequest.js";
import { User } from "../models/User.js";
import { AppError, asyncHandler } from "../utils/http.js";

export const createReview = asyncHandler(async (req, res) => {
  const { requestId, rating, comment } = req.body;
  if (!requestId || typeof rating !== "number") {
    throw new AppError(400, "Campos obrigatorios: requestId e rating.");
  }
  if (rating < 1 || rating > 5) {
    throw new AppError(400, "Rating deve estar entre 1 e 5.");
  }

  const request = await ServiceRequest.findById(requestId);
  if (!request) {
    throw new AppError(404, "Solicitacao nao encontrada.");
  }
  if (request.status !== "completed") {
    throw new AppError(400, "Avaliacao so permitida para solicitacoes concluidas.");
  }
  if (String(request.client) !== String(req.user._id)) {
    throw new AppError(403, "Apenas o cliente da solicitacao pode avaliar.");
  }

  const existing = await Review.findOne({ request: request._id });
  if (existing) {
    throw new AppError(409, "Solicitacao ja avaliada.");
  }

  const review = await Review.create({
    request: request._id,
    client: request.client,
    provider: request.provider,
    rating,
    comment: comment || "",
  });

  const provider = await User.findById(request.provider);
  const newCount = provider.ratingCount + 1;
  provider.ratingAvg = Number(((provider.ratingAvg * provider.ratingCount + rating) / newCount).toFixed(2));
  provider.ratingCount = newCount;
  await provider.save();

  res.status(201).json(review);
});

export const listProviderReviews = asyncHandler(async (req, res) => {
  const { providerId } = req.params;
  const reviews = await Review.find({ provider: providerId })
    .populate("client", "name")
    .sort({ createdAt: -1 });
  res.json(reviews);
});
