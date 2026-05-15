import SwaggerParser from '@apidevtools/swagger-parser';

export type OpenApiDocument = Awaited<ReturnType<typeof SwaggerParser.parse>>;

/** Validate OpenAPI 2/3 document; throws on invalid. Pass a file path, URL, or parsed object. */
export async function validateOpenApi(
  pathUrlOrSpec: string | Record<string, unknown>,
): Promise<OpenApiDocument> {
  return SwaggerParser.validate(pathUrlOrSpec as string) as Promise<OpenApiDocument>;
}

/** Extract JSON Schema for a response by operationId or method+path (best-effort). */
export function extractResponseSchema(
  doc: OpenApiDocument,
  method: string,
  path: string,
  statusCode = '200',
): object | null {
  const m = method.toLowerCase();
  const anyDoc = doc as Record<string, unknown>;
  if (anyDoc.swagger === '2.0') {
    const paths = (anyDoc.paths ?? {}) as Record<string, Record<string, { responses?: Record<string, unknown> }>>;
    const op = paths[path]?.[m];
    const res = op?.responses?.[statusCode] as { schema?: object } | undefined;
    return res?.schema ?? null;
  }
  const paths = (anyDoc.paths ?? {}) as Record<
    string,
    Record<
      string,
      {
        responses?: Record<
          string,
          { content?: Record<string, { schema?: object }> }
        >;
      }
    >
  >;
  const op = paths[path]?.[m];
  const res = op?.responses?.[statusCode];
  const json = res?.content?.['application/json'];
  return json?.schema ?? null;
}
