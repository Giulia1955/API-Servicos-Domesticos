import { Service } from "../models/Service.js";
import { User } from "../models/User.js";
import { haversineDistanceKm } from "../utils/haversine.js";
import { AppError, asyncHandler } from "../utils/http.js";

export const createService = asyncHandler(async (req, res) => {
  const { title, description, category, pricingType, price, location } = req.body;
  if (!title || !description || !category || !pricingType || typeof price !== "number") {
    throw new AppError(400, "Campos obrigatorios: title, description, category, pricingType, price.");
  }

  const provider = await User.findById(req.user._id);
  const resolvedLocation =
    location && typeof location.lat === "number" && typeof location.lng === "number"
      ? { type: "Point", coordinates: [location.lng, location.lat] }
      : provider.location;

  const service = await Service.create({
    provider: req.user._id,
    title,
    description,
    category,
    pricingType,
    price,
    location: resolvedLocation,
  });

  res.status(201).json(service);
});

export const listServices = asyncHandler(async (req, res) => {
  const {
    category,
    pricingType,
    minPrice,
    maxPrice,
    search,
    lat,
    lng,
    maxDistanceKm = 20,
  } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (pricingType) filter.pricingType = pricingType;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (search) {
    filter.$or = [
      { title: { $regex: String(search), $options: "i" } },
      { description: { $regex: String(search), $options: "i" } },
      { category: { $regex: String(search), $options: "i" } },
    ];
  }

  const services = await Service.find(filter)
    .populate("provider", "name bio portfolio ratingAvg ratingCount availability categories location")
    .sort({ createdAt: -1 });

  if (typeof lat === "undefined" || typeof lng === "undefined") {
    res.json(services);
    return;
  }

  const userLat = Number(lat);
  const userLng = Number(lng);
  const withDistance = services
    .map((service) => {
      const coords = service.location?.coordinates || [0, 0];
      const distanceKm = haversineDistanceKm(userLat, userLng, coords[1], coords[0]);
      return {
        ...service.toObject(),
        distanceKm: Number(distanceKm.toFixed(2)),
      };
    })
    .filter((item) => item.distanceKm <= Number(maxDistanceKm))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  res.json(withDistance);
});

export const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).populate(
    "provider",
    "name bio portfolio ratingAvg ratingCount availability categories"
  );
  if (!service) {
    throw new AppError(404, "Servico nao encontrado.");
  }
  res.json(service);
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    throw new AppError(404, "Servico nao encontrado.");
  }
  if (String(service.provider) !== String(req.user._id)) {
    throw new AppError(403, "Apenas o prestador dono do servico pode editar.");
  }

  const allowed = ["title", "description", "category", "pricingType", "price"];
  for (const field of allowed) {
    if (typeof req.body[field] !== "undefined") {
      service[field] = req.body[field];
    }
  }
  if (req.body.location && typeof req.body.location.lat === "number" && typeof req.body.location.lng === "number") {
    service.location = { type: "Point", coordinates: [req.body.location.lng, req.body.location.lat] };
  }

  await service.save();
  res.json(service);
});

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    throw new AppError(404, "Servico nao encontrado.");
  }
  if (String(service.provider) !== String(req.user._id)) {
    throw new AppError(403, "Apenas o prestador dono do servico pode remover.");
  }
  await service.deleteOne();
  res.status(204).send();
});
