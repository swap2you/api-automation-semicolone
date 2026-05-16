import fs from 'node:fs';
import path from 'node:path';

import { expect } from '@playwright/test';

import { expectStatus } from '../../../src/core/assertions/http.js';
import { ApiClient } from '../../../src/core/client/api-client.js';
import { assertMatchesJsonSchema } from '../../../src/core/contracts/schema-assert.js';
import { OPEN_METEO_PATHS } from '../../../src/modules/open-meteo/config.js';
import { buildForecastParams } from '../../../src/modules/open-meteo/builders/forecast-request.js';
import { locations } from '../../../src/modules/open-meteo/factories/locations.js';
import { test } from '../../fixtures.js';

const forecastSchema = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), 'src/modules/open-meteo/schemas/forecast-response.json'),
    'utf8',
  ),
) as object;

/** Broken schema — simulates contract drift after an upstream API change. */
const strictPartnerSchema = {
  ...forecastSchema,
  required: [...((forecastSchema as { required?: string[] }).required ?? []), 'partner_portfolio_id'],
};

function annotateScenario(testInfo: import('@playwright/test').TestInfo, scenario: string, detail: string) {
  testInfo.annotations.push({ type: 'scenario', description: scenario });
  testInfo.annotations.push({ type: 'detail', description: detail });
}

/**
 * Intentionally failing scenarios for Allure / triage demos.
 * Excludes from normal CI: npx playwright test --grep-invert @demo-failure
 */
test.describe('Open-Meteo realtime failure scenarios @negative @demo-failure', () => {
  test('SERVICE_DOWN — forecast host unreachable (connection refused)', async ({ request }, testInfo) => {
    annotateScenario(
      testInfo,
      'SERVICE_DOWN',
      'Mimics API gateway or microservice offline; no TCP listener on loopback.',
    );

    const api = new ApiClient({
      context: request,
      baseURL: 'http://127.0.0.1:9',
      auth: { type: 'none' },
    });

    const params = buildForecastParams({
      latitude: locations.sfBay.latitude,
      longitude: locations.sfBay.longitude,
    });

    // Intentionally expect success — when the host is down, fetch throws or never returns 200 (fails in Allure).
    const res = await api.get(OPEN_METEO_PATHS.forecast, { params });
    await expectStatus(
      res,
      200,
    );
  });

  test('ROUTING_ERROR — deprecated path returns 404 (release regression)', async ({ api }, testInfo) => {
    annotateScenario(
      testInfo,
      'ROUTING_ERROR',
      'Mimics wrong base path after deployment (v1 route removed or renamed).',
    );

    const params = buildForecastParams({
      latitude: locations.nyc.latitude,
      longitude: locations.nyc.longitude,
    });

    const res = await api.get('/v1/forecast-deprecated-route', { params });
    const bodySnippet = (await res.text()).slice(0, 300);

    expect(
      res.status(),
      `Expected 200 from live route but got ${res.status()}. Body: ${bodySnippet}`,
    ).toBe(200);
  });

  test('AUTH_DENIED — missing partner API key (expect 401)', async ({ api }, testInfo) => {
    annotateScenario(
      testInfo,
      'AUTH_DENIED',
      'Mimics fintech partner gateway: call without valid Authorization should be rejected.',
    );

    const params = buildForecastParams({
      latitude: locations.london.latitude,
      longitude: locations.london.longitude,
    });

    const res = await api.get(OPEN_METEO_PATHS.forecast, {
      params,
      headers: {
        Authorization: 'Bearer invalid-demo-key-no-permission',
      },
    });

    expect(
      res.status(),
      'Open-Meteo is public; this assertion simulates a protected downstream that must return 401 without a valid key',
    ).toBe(401);
  });

  test('AUTH_DENIED — expired credentials (expect 403)', async ({ api }, testInfo) => {
    annotateScenario(
      testInfo,
      'AUTH_FORBIDDEN',
      'Mimics revoked API key / insufficient scope on partner integration.',
    );

    const res = await api.get(OPEN_METEO_PATHS.forecast, {
      params: buildForecastParams(locations.sfBay),
      headers: {
        'X-API-Key': 'revoked-key-demo-00000000',
      },
    });

    expect(res.status(), 'Simulates forbidden response when key lacks forecast:read scope').toBe(403);
  });

  test('CONTRACT_DRIFT — response missing required partner field', async ({ api }, testInfo) => {
    annotateScenario(
      testInfo,
      'CONTRACT_DRIFT',
      'Mimics breaking schema change: consumer expects partner_portfolio_id in payload.',
    );

    const res = await api.get(OPEN_METEO_PATHS.forecast, {
      params: buildForecastParams(locations.nyc),
    });
    await expectStatus(res, 200);
    const body = await res.json();

    await assertMatchesJsonSchema(strictPartnerSchema, body, {
      contractLabel: 'strictPartnerSchema (partner_portfolio_id required)',
      attachToAllure: true,
    });
  });

  test('DATA_QUALITY — hourly series must not be empty (SLA breach)', async ({ api }, testInfo) => {
    annotateScenario(
      testInfo,
      'DATA_QUALITY',
      'Mimics silent degradation: HTTP 200 but empty time series breaks downstream jobs.',
    );

    const res = await api.get(OPEN_METEO_PATHS.forecast, {
      params: {
        latitude: locations.sfBay.latitude,
        longitude: locations.sfBay.longitude,
        hourly: 'temperature_2m',
        forecast_days: 1,
      },
    });
    await expectStatus(res, 200);
    const body = (await res.json()) as { hourly?: { time?: string[] } };

    expect(
      body.hourly?.time?.length ?? 0,
      'Forecast hourly.time must contain at least 48 points for intraday SLA (simulated strict check)',
    ).toBeGreaterThanOrEqual(48);
  });

  test('ENV_MISCONFIG — wrong regional base URL (expect 200 from primary)', async (
    { request },
    testInfo,
  ) => {
    annotateScenario(
      testInfo,
      'ENV_MISCONFIG',
      'Mimics qa.env pointing at decommissioned regional hostname.',
    );

    const api = new ApiClient({
      context: request,
      baseURL: 'https://api.open-meteo.invalid-region.example',
      auth: { type: 'none' },
    });

    const res = await api.get(OPEN_METEO_PATHS.forecast, {
      params: buildForecastParams(locations.sfBay),
    });

    expect(res.status(), 'Misconfigured host should not return a successful forecast').toBe(200);
  });
});
