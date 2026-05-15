import fs from 'node:fs';
import path from 'node:path';

import { importPostmanCollectionV21 } from '../src/core/contracts/postman-import.js';

/**
 * Developer utility: print normalized endpoints from a Postman collection v2.1 JSON.
 * Usage: npx tsx scripts/import-postman-demo.ts [path-to-collection.json]
 */
const collectionPath =
  process.argv[2] ??
  path.join(process.cwd(), 'assets/Weather Forecast.postman_collection.json');

if (!fs.existsSync(collectionPath)) {
  console.error('Collection not found:', collectionPath);
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
const endpoints = importPostmanCollectionV21(raw);
console.log(JSON.stringify(endpoints, null, 2));
