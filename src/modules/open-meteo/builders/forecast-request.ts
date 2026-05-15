import { defaultForecastHourlyFields } from '../config.js';

export type ForecastQuery = {
  latitude: number;
  longitude: number;
  hourly?: readonly string[];
  timezone?: string;
  forecastDays?: number;
};

export function buildForecastParams(q: ForecastQuery): Record<string, string | number | undefined> {
  const hourly = q.hourly ?? defaultForecastHourlyFields;
  const forecastDays = q.forecastDays ?? 3;
  return {
    latitude: q.latitude,
    longitude: q.longitude,
    hourly: hourly.join(','),
    timezone: q.timezone ?? 'auto',
    forecast_days: Math.min(Math.max(forecastDays, 1), 16),
  };
}
