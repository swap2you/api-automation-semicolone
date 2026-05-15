import fs from 'node:fs';
import path from 'node:path';

import { expectStatus } from '../../../src/core/assertions/http.js';
import { OPEN_METEO_PATHS } from '../../../src/modules/open-meteo/config.js';
import { buildForecastParams } from '../../../src/modules/open-meteo/builders/forecast-request.js';
import { locations } from '../../../src/modules/open-meteo/factories/locations.js';
import { expect, test } from '../../fixtures.js';

const forecastSchema = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), 'src/modules/open-meteo/schemas/forecast-response.json'),
    'utf8',
  ),
) as object;

test.describe('Open-Meteo forecast @smoke', () => {
  test('GET forecast returns 200 with hourly time series', async ({ api, validateAgainstSchema }) => {
    const params = buildForecastParams({
      latitude: locations.sfBay.latitude,
      longitude: locations.sfBay.longitude,
      timezone: locations.sfBay.timezone,
    });
    let res = await api.get(OPEN_METEO_PATHS.forecast, { params });
    for (let attempt = 0; attempt < 3 && res.status() === 429; attempt++) {
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      res = await api.get(OPEN_METEO_PATHS.forecast, { params });
    }
    if (res.status() === 429) {
      test.skip(true, 'Open-Meteo rate-limited (429); retry later or run nightly');
    }
    await expectStatus(res, 200);
    const body = await res.json();
    validateAgainstSchema(forecastSchema)(body);
    const hourly = (body as { hourly: { time: string[] } }).hourly;
    expect(hourly.time.length).toBeGreaterThan(0);
  });
});
