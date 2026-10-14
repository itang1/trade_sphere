// Accepts numbers or the comma-formatted strings some queries return
export function dollars(value) {
  const number = typeof value === 'string' ? Number(value.replaceAll(',', '')) : value;
  if (number >= 1e9) return `$${(number / 1e9).toFixed(1)} billion`;
  if (number >= 1e6) return `$${(number / 1e6).toFixed(1)} million`;
  return `$${Math.round(number).toLocaleString('en-US')}`;
}

const TRADE_VERBS = {
  Export: { noun: 'exports', preposition: 'to', role: 'buyer' },
  Import: { noun: 'imports', preposition: 'from', role: 'source' },
  'Re-Export': { noun: 're-exports', preposition: 'to', role: 'buyer' },
};

export const tradeWords = type => TRADE_VERBS[type] ?? TRADE_VERBS.Export;
