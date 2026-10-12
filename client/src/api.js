const config = require('./config.json');

export const API_URL = process.env.REACT_APP_API_URL ?? `http://${config.server_host}:${config.server_port}`;

export function getJson(path, params = {}) {
  const query = new URLSearchParams(params).toString();
  return fetch(`${API_URL}${path}${query ? `?${query}` : ''}`).then(res => res.json());
}

export function getText(path) {
  return fetch(`${API_URL}${path}`).then(res => res.text());
}
