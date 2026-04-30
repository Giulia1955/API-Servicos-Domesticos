import bcrypt from "bcryptjs";
import { connectDatabase } from "./config/db.js";
import { User } from "./models/User.js";
import { Service } from "./models/Service.js";

async function seed() {
  await connectDatabase();
  await Promise.all([User.deleteMany({}), Service.deleteMany({})]);

  const passwordHash = await bcrypt.hash("123456", 10);
  const provider = await User.create({
    name: "Joao Prestador",
    email: "prestador@example.com",
    passwordHash,
    role: "provider",
    bio: "Eletricista residencial.",
    categories: ["eletrica"],
    availability: [{ day: "monday", start: "08:00", end: "18:00" }],
    location: { type: "Point", coordinates: [-46.6333, -23.5505] },
  });

  await User.create({
    name: "Maria Cliente",
    email: "cliente@example.com",
    passwordHash,
    role: "client",
    location: { type: "Point", coordinates: [-46.6388, -23.5489] },
  });

  await Service.create({
    provider: provider._id,
    title: "Instalacao eletrica residencial",
    description: "Servico completo para manutencao e instalacao eletrica.",
    category: "eletrica",
    pricingType: "hourly",
    price: 120,
    location: provider.location,
  });

  process.stdout.write("Seed concluido.\n");
  process.exit(0);
}

seed().catch((error) => {
  process.stderr.write(`Falha ao executar seed: ${error.message}\n`);
  process.exit(1);
});
