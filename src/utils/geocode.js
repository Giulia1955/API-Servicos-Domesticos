export async function geocodeAddress(address) {
  if (!address) return null;
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": "plataforma-servicos/1.0 (dev@local)" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data || data.length === 0) return null;
  const { lat, lon } = data[0];
  return { lat: Number(lat), lng: Number(lon) };
}
