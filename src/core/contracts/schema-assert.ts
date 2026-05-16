import fs from 'node:fs';

import { attachment } from 'allure-js-commons';

import { compileSchema, formatAjvErrors } from './ajv.js';

export type SchemaAssertOptions = {
  /** Human label shown in failure message (e.g. checked-in contract path). */
  contractLabel: string;
  /** Optional: attach live JSON + schema to Allure for triage. */
  attachToAllure?: boolean;
};

/**
 * Shift-left contract check: live API payload must satisfy the checked-in JSON Schema.
 * Fails with explicit Ajv paths when fields are missing, renamed, or wrong type.
 */
export async function assertMatchesJsonSchema(
  schema: object,
  data: unknown,
  options: SchemaAssertOptions,
): Promise<void> {
  const validate = compileSchema(schema);
  const ok = validate(data);

  if (options.attachToAllure !== false) {
    await attachment('contract-schema.json', JSON.stringify(schema, null, 2), 'application/json');
    await attachment('live-api-response.json', JSON.stringify(data, null, 2), 'application/json');
  }

  if (!ok) {
    const detail = formatAjvErrors(validate.errors);
    throw new Error(
      [
        `Contract drift detected (${options.contractLabel}).`,
        'The live API response no longer matches the checked-in JSON Schema.',
        'Typical causes: field removed, renamed, type changed, or new required partner field missing.',
        `Validation errors: ${detail}`,
      ].join('\n'),
    );
  }
}

export function loadJsonSchemaFromFile(absolutePath: string): object {
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8')) as object;
}
