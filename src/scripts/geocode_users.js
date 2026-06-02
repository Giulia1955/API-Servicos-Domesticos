import { connectDatabase } from "../config/db.js";
import { User } from "../models/User.js";
import { geocodeAddress } from "../utils/geocode.js";

async function run() {
  await connectDatabase();
  const users = await User.find({ address: { $exists: true, $ne: "" }, $or: [{ location: { $exists: false } }, { location: null }] });
  console.log(`Encontrados ${users.length} usuários para geocodificar.`);
  for (const u of users) {
    try {
      const geo = await geocodeAddress(u.address);
      if (geo) {
        u.location = { type: "Point", coordinates: [geo.lng, geo.lat] };
        await u.save();
        console.log(`Atualizado ${u.email} => ${geo.lat},${geo.lng}`);
      } else {
        console.log(`Nao encontrado coords para ${u.email}: ${u.address}`);
      }
      // Respeitar um pequeno delay para não sobrecarregar o Nominatim
      await new Promise((r) => setTimeout(r, 1200));
    } catch (err) {
      console.error(`Erro ao processar ${u.email}: ${err.message}`);
    }
  }
  console.log('Concluido.');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
