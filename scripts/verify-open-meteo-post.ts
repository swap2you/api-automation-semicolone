/**
 * One-off probe: does Open-Meteo accept POST on /v1/forecast with query-style params?
 * Run: npx tsx scripts/verify-open-meteo-post.ts
 */
const base = process.env.OPEN_METEO_BASE_URL ?? 'https://api.open-meteo.com';
const url = new URL('/v1/forecast', base);
url.searchParams.set('latitude', '37.77');
url.searchParams.set('longitude', '-122.42');
url.searchParams.set('hourly', 'temperature_2m');

const res = await fetch(url.toString(), { method: 'POST' });
console.log('POST', res.status, res.statusText);
const text = await res.text();
console.log(text.slice(0, 500));
