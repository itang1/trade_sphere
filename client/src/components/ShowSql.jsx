import React, { useState } from 'react';
import { Box, Button, Collapse, Typography } from '@mui/material';

import queries, { QUERY_ORIGINS } from '../queries';
import { colors } from '../theme';

function dedent(sql) {
  const lines = sql.replace(/^\n+|\s+$/g, '').split('\n');
  const indent = Math.min(...lines.filter(line => line.trim()).map(line => line.match(/^ */)[0].length));
  return lines.map(line => line.slice(indent)).join('\n');
}

export function CodeBlock({ children }) {
  return (
    <Box
      component='pre'
      sx={{
        mt: 1.5, mb: 0, p: 2, borderRadius: 1, overflowX: 'auto',
        bgcolor: colors.tealDark, color: '#F8F7F1', fontSize: '0.8rem', lineHeight: 1.6,
      }}
    >
      {children}
    </Box>
  );
}

const ROUTES_URL = 'https://github.com/itang1/trade_sphere/blob/main/server/routes.js';

const ORIGIN_TEXT = {
  ported: 'Written by the team in 2023 for MySQL, then adapted for SQLite in 2026 with small changes, such as ? placeholders for the filter values.',
  fixed: 'Written by the team in 2023 for MySQL, then adapted for SQLite in 2026. The 2026 revamp also fixed it so that no product is counted twice.',
  added: 'Added in the 2026 revamp.',
};

const formatParam = value => (typeof value === 'string' ? `'${value}'` : String(value));

export default function ShowSql({ route, params = {} }) {
  const [open, setOpen] = useState(false);
  const [sql, values] = queries[route](params);

  return (
    <Box sx={{ mt: 2 }}>
      <Button size='small' variant='outlined' onClick={() => setOpen(!open)}>
        {open ? 'Hide SQL' : 'Show SQL'}
      </Button>
      <Collapse in={open}>
        <CodeBlock>{dedent(sql)}</CodeBlock>
        {values.length > 0 && (
          <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
            Parameters, in order: {values.map(formatParam).join(', ')}
          </Typography>
        )}
        <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
          {ORIGIN_TEXT[QUERY_ORIGINS[route] ?? 'ported']}
          {QUERY_ORIGINS[route] !== 'added' && <> <a href={ROUTES_URL}>See the original in server/routes.js.</a></>}
        </Typography>
      </Collapse>
    </Box>
  );
}
