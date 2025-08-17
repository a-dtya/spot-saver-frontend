export async function fetchCoordinates(url: string) {
  const res = await fetch(`http://localhost:4000/get-lat-lng?url=${encodeURIComponent(url)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch coordinates');
  return data.coordinates;
}