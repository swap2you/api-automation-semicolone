import { expectStatus } from '../../../src/core/assertions/http.js';
import { OPEN_METEO_PATHS } from '../../../src/modules/open-meteo/config.js';
import { buildForecastParams } from '../../../src/modules/open-meteo/builders/forecast-request.js';
import { locations } from '../../../src/modules/open-meteo/factories/locations.js';
import { test } from '../../fixtures.js';

test.describe('Open-Meteo forecast @negative', () => {
  test('invalid latitude yields error response', async ({ api }) => {
    const params = buildForecastParams({
      latitude: locations.invalidLat.latitude,
      longitude: 0,
    });
    const res = await api.get(OPEN_METEO_PATHS.forecast, { params });
    await expectStatus(res, 400);
  });

  test('missing required latitude', async ({ api }) => {
    const res = await api.get(OPEN_METEO_PATHS.forecast, {
      params: { longitude: 0, hourly: 'temperature_2m' },
    });
    await expectStatus(res, 400);
  });
});
