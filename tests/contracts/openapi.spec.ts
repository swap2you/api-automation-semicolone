import fs from 'node:fs';
import path from 'node:path';

import { compileSchema } from '../../src/core/contracts/ajv.js';
import { extractResponseSchema, validateOpenApi } from '../../src/core/contracts/openapi.js';
import { expect, test } from '../fixtures.js';

test.describe('contracts', () => {
  test('validates checked-in OpenAPI document', async () => {
    const specPath = path.join(process.cwd(), 'specs/openapi/minimal.json');
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf8')) as Record<string, unknown>;
    const doc = await validateOpenApi(spec);
    expect(doc).toBeTruthy();
    const schema = extractResponseSchema(doc, 'get', '/ping', '200');
    expect(schema).toBeTruthy();
    const v = compileSchema(schema as object);
    expect(v({ status: 'ok' })).toBe(true);
  });
});
