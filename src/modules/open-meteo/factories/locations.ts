/** Reusable geo fixtures for forecast scenarios */

export const locations = {
  sfBay: { latitude: 37.77, longitude: -122.42, timezone: 'America/Los_Angeles' },
  nyc: { latitude: 40.71, longitude: -74.01, timezone: 'America/New_York' },
  london: { latitude: 51.51, longitude: -0.13, timezone: 'Europe/London' },
  invalidLat: { latitude: 999, longitude: 0 },
  invalidLon: { latitude: 0, longitude: 999 },
} as const;

export const hourlyFieldSets = {
  minimal: ['temperature_2m'] as const,
  extended: ['temperature_2m', 'precipitation_probability', 'wind_speed_10m', 'weather_code'] as const,
};
