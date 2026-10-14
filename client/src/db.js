import initSqlJs from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm-browser.wasm?url';

const DB_URL = `${import.meta.env.BASE_URL}tradesphere.sqlite.gz`;

// Stands in for MySQL's FORMAT(value, 0): thousands separators, no decimals
function formatNumber(value) {
  return value == null ? null : Math.round(value).toLocaleString('en-US');
}

async function gunzip(response) {
  if (!response.ok) {
    throw new Error(`Database download failed: ${response.status}`);
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  // Some servers already decode .gz files, so only decompress if the gzip header is still there
  if (bytes[0] !== 0x1f || bytes[1] !== 0x8b) {
    return bytes;
  }
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

const SQLITE_HEADER = 'SQLite format 3';

export function openDatabase(SQL, bytes) {
  // Static hosts can answer a missing file with an HTML page, which would otherwise open as an empty database
  if (new TextDecoder().decode(bytes.subarray(0, SQLITE_HEADER.length)) !== SQLITE_HEADER) {
    throw new Error('Downloaded file is not a SQLite database');
  }
  const db = new SQL.Database(bytes);
  db.create_function('format_number', formatNumber);
  return db;
}

let database;

export function getDatabase() {
  database ??= Promise.all([
    initSqlJs({ locateFile: () => wasmUrl }),
    fetch(DB_URL).then(gunzip),
  ]).then(([SQL, bytes]) => openDatabase(SQL, bytes));
  return database;
}

export function rowsOf(db, sql, params = []) {
  const statement = db.prepare(sql);
  statement.bind(params);
  const rows = [];
  while (statement.step()) {
    rows.push(statement.getAsObject());
  }
  statement.free();
  return rows;
}

export async function query(sql, params) {
  return rowsOf(await getDatabase(), sql, params);
}
