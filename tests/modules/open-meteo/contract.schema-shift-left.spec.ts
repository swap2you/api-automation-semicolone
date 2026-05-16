import path from 'node:path';

import { label } from 'allure-js-commons';

import { expectStatus } from '../../../src/core/assertions/http.js';
import {
  assertMatchesJsonSchema,
  loadJsonSchemaFromFile,
} from '../../../src/core/contracts/schema-assert.js';
import { OPEN_METEO_PATHS } from '../../../src/modules/open-meteo/config.js';
import { buildForecastParams } from '../../../src/modules/open-meteo/builders/forecast-request.js';
import { locations } from '../../../src/modules/open-meteo/factories/locations.js';
import { test } from '../../fixtures.js';

const checkedInSchemaPath = path.join(
  process.cwd(),
  'src/modules/open-meteo/schemas/forecast-response.json',
);

/**
 * Shift-left contract: checked-in schema is the source of truth.
 * This demo test adds a fictional required field to force failure until schema is updated
 * after intentional API changes (rename/remove/add fields).
 */
test.describe('Open-Meteo schema shift-left @contract @demo-failure', () => {
  test('SCHEMA_SHIFT_LEFT — live response must match versioned forecast contract', async ({ api }) => {
    await label('shift-left', 'schema-regression');
    await label('contract', checkedInSchemaPath);

    const res = await api.get(OPEN_METEO_PATHS.forecast, {
      params: buildForecastParams(locations.nyc),
    });
    await expectStatus(res, 200);
    const body = await res.json();

    const golden = loadJsonSchemaFromFile(checkedInSchemaPath);
    const driftedConsumerSchema = {
      ...golden,
      required: [
        ...((golden as { required?: string[] }).required ?? []),
        'api_version_tag',
      ],
      properties: {
        ...((golden as { properties?: Record<string, unknown> }).properties ?? {}),
        api_version_tag: { type: 'string', description: 'Simulates partner-required version tag' },
      },
    };

    await assertMatchesJsonSchema(driftedConsumerSchema, body, {
      contractLabel: 'open-meteo/forecast-response.json + consumer extension api_version_tag',
      attachToAllure: true,
    });
  });
});
