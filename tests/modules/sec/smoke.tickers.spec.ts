import { expectStatus } from '../../../src/core/assertions/http.js';
import { expect, test } from '../../fixtures.js';

test.describe('SEC public data @smoke', () => {
  test('company tickers JSON is reachable with compliant User-Agent', async ({ api }) => {
    const res = await api.get('/files/company_tickers.json');
    await expectStatus(res, 200);
    const text = await res.text();
    const body = JSON.parse(text) as Record<string, { cik_str: number; ticker: string; title: string }>;
    const firstKey = Object.keys(body)[0];
    expect(body[firstKey]).toHaveProperty('ticker');
  });
});
