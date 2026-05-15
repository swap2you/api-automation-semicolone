import { expectStatus } from '../../../src/core/assertions/http.js';
import { expect, test } from '../../fixtures.js';

const hasFred = !!process.env.FRED_API_KEY;
const describeFred = hasFred ? test.describe : test.describe.skip;

describeFred('FRED series @smoke', () => {
  test('observations series returns JSON', async ({ api }) => {
    const res = await api.get('/fred/series/observations', {
      params: {
        series_id: 'GNPCA',
        api_key: process.env.FRED_API_KEY,
        file_type: 'json',
        limit: 3,
      },
    });
    await expectStatus(res, 200);
    const body = (await res.json()) as { observations: unknown[] };
    expect(Array.isArray(body.observations)).toBeTruthy();
  });
});
