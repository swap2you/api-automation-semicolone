import { Ajv, type ErrorObject, type ValidateFunction } from 'ajv';
import addFormatsImport from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, strict: false });
const addFormats = addFormatsImport as unknown as (a: Ajv) => void;
addFormats(ajv);

export function compileSchema<T = unknown>(schema: object): ValidateFunction<T> {
  return ajv.compile<T>(schema);
}

export function formatAjvErrors(errors: ErrorObject[] | null | undefined): string {
  if (!errors?.length) return '';
  return errors.map((e) => `${e.instancePath || '/'} ${e.message}`).join('; ');
}
