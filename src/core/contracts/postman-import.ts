/**
 * Postman Collection v2.1 → internal endpoint manifest (requests only; no full script runtime).
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type EndpointDefinition = {
  name: string;
  method: HttpMethod;
  /** Absolute or collection-relative URL from Postman */
  url: string;
  headers: Record<string, string>;
  bodyMode?: 'raw' | 'urlencoded' | 'formdata' | 'none';
  /** Raw body string when present */
  rawBody?: string;
};

type PmUrl = string | { raw?: string; host?: string[]; path?: string[]; query?: { key: string; value?: string }[] };

function urlToString(u: PmUrl | undefined): string {
  if (!u) return '';
  if (typeof u === 'string') return u;
  if (u.raw) return u.raw;
  const host = (u.host ?? []).join('.');
  const path = (u.path ?? []).join('/');
  const proto = host ? 'https://' : '';
  return `${proto}${host}/${path}`.replace(/\/+/g, '/').replace('https:/', 'https://');
}

function normalizeMethod(m: string): HttpMethod {
  const x = m.toUpperCase();
  if (x === 'GET' || x === 'POST' || x === 'PUT' || x === 'PATCH' || x === 'DELETE') return x;
  return 'GET';
}

export function importPostmanCollectionV21(json: unknown): EndpointDefinition[] {
  const root = json as { item?: unknown[] };
  const out: EndpointDefinition[] = [];

  function walk(items: unknown[], prefix: string) {
    for (const it of items) {
      const node = it as {
        name?: string;
        item?: unknown[];
        request?: {
          method?: string;
          url?: PmUrl;
          header?: { key: string; value?: string }[];
          body?: { mode?: string; raw?: string };
        };
      };
      if (node.item?.length) {
        walk(node.item, prefix ? `${prefix}/${node.name ?? ''}` : (node.name ?? ''));
        continue;
      }
      if (!node.request) continue;
      const name = [prefix, node.name].filter(Boolean).join(' / ');
      const method = normalizeMethod(node.request.method ?? 'GET');
      const url = urlToString(node.request.url as PmUrl);
      const headers: Record<string, string> = {};
      for (const h of node.request.header ?? []) {
        if (h?.key) headers[h.key] = h.value ?? '';
      }
      const mode = node.request.body?.mode as EndpointDefinition['bodyMode'];
      out.push({
        name,
        method,
        url,
        headers,
        bodyMode: mode === 'raw' ? 'raw' : mode === 'urlencoded' ? 'urlencoded' : 'none',
        rawBody: node.request.body?.raw,
      });
    }
  }

  if (Array.isArray(root.item)) walk(root.item, '');
  return out;
}
