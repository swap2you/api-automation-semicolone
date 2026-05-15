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

test.describe('Open-Meteo forecast @contract', () => {
  test('response matches contract schema for default city', async ({ api, validateAgainstSchema }) => {
    const params = buildForecastParams({
      latitude: locations.nyc.latitude,
      longitude: locations.nyc.longitude,
      timezone: locations.nyc.timezone,
    });
    const res = await api.get(OPEN_METEO_PATHS.forecast, { params });
    await expectStatus(res, 200);
    const body = await res.json();
    expect(() => validateAgainstSchema(forecastSchema)(body)).not.toThrow();
  });
});
