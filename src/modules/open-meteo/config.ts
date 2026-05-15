/** Path constants and defaults for Open-Meteo HTTP API. */
export const OPEN_METEO_PATHS = {
  forecast: '/v1/forecast',
} as const;

export const defaultForecastHourlyFields = [
  'temperature_2m',
  'precipitation_probability',
  'weather_code',
] as const;
