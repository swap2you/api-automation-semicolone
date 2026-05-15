import { OPEN_METEO_PATHS } from '../../../src/modules/open-meteo/config.js';
import { buildForecastParams } from '../../../src/modules/open-meteo/builders/forecast-request.js';
import { locations } from '../../../src/modules/open-meteo/factories/locations.js';
import { expect, test } from '../../fixtures.js';

/**
 * POST support for Open-Meteo forecast is **provisional**.
 * Verify against https://open-meteo.com/en/docs before treating POST as a stable contract.
 */
test.describe('Open-Meteo forecast POST @provisional', () => {
  test('POST may mirror GET or be rejected — document outcome', async ({ api }) => {
    test.info().annotations.push({
      type: 'risk',
      description:
        'POST is not documented as primary; if this fails with 405, keep tests skipped in CI or accept non-200.',
    });
    const params = buildForecastParams({
      latitude: locations.sfBay.latitude,
      longitude: locations.sfBay.longitude,
      timezone: locations.sfBay.timezone,
    });
    const res = await api.post(OPEN_METEO_PATHS.forecast, {
      params,
    });
    if (res.status() === 405) {
      test.skip(true, 'Open-Meteo returned 405 for POST — use GET as stable contract');
    }
    if (res.status() !== 200) {
      test.skip(true, `POST returned ${res.status()} — verify API before enabling`);
    }
    const body = await res.json();
    expect(body).toHaveProperty('hourly');
  });
});
