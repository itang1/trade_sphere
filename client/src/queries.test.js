/**
 * @jest-environment node
 */
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import initSqlJs from 'sql.js';

import { openDatabase, rowsOf } from './db';
import queries from './queries';

// Built by scripts/build_sqlite.py
const DB_PATH = path.join(__dirname, '..', 'public', 'tradesphere.sqlite.gz');

let db;

beforeAll(async () => {
  const SQL = await initSqlJs();
  db = openDatabase(SQL, zlib.gunzipSync(fs.readFileSync(DB_PATH)));
});

afterAll(() => db.close());

const run = (route, params = {}) => rowsOf(db, ...queries[route](params));

test('every route returns rows with its default parameters', () => {
  const examples = {
    '/trading_data': { type: 'Export', category: 'Coffee, tea, mate and spices' },
    '/trading_partner': { type: 'Export', category: 'Coffee, tea, mate and spices' },
    '/trading_partner_catg': { type: 'Export', country2: 'Mexico' },
    '/trading_volume': { type: 'Import' },
    '/country/wages': { country1: 'United States', country2: 'Mexico' },
  };
  for (const route of Object.keys(queries)) {
    expect([route, run(route, examples[route]).length > 0]).toEqual([route, true]);
  }
});

test('top trading partners come with map coordinates and formatted values', () => {
  const partners = run('/trading_partner', { type: 'Export', category: 'Coffee, tea, mate and spices' });
  expect(partners).toHaveLength(5);
  for (const partner of partners) {
    expect(partner.Latitude).toEqual(expect.any(Number));
    expect(partner.Value).toMatch(/^[\d,]+$/);
  }
});

test('trade types match case-insensitively, like MySQL did', () => {
  const lower = run('/trading_volume', { type: 're-export' });
  const mixed = run('/trading_volume', { type: 'Re-Export' });
  expect(lower).toEqual(mixed);
  expect(mixed.length).toBeGreaterThan(0);
});

test('slider values filter the computed columns as numbers', () => {
  const rows = run('/country/population', { urban_low: 90, urban_high: 100 });
  expect(rows.length).toBeGreaterThan(0);
  for (const row of rows) {
    expect(row.UrbanProportion).toBeGreaterThan(90);
  }
});
