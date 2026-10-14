import { query } from './db';
import queries from './queries';

// Set VITE_API_URL to use the Express server instead of the in-browser database
const API_URL = import.meta.env.VITE_API_URL;

export const usesBrowserDatabase = !API_URL;

export function getJson(path, params = {}) {
  if (!API_URL) {
    return query(...queries[path](params));
  }
  const search = new URLSearchParams(params).toString();
  return fetch(`${API_URL}${path}${search ? `?${search}` : ''}`).then(res => res.json());
}
