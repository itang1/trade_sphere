import React, { useState } from 'react';
import { Box, Button, Collapse, Typography } from '@mui/material';

import queries from '../queries';
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
      </Collapse>
    </Box>
  );
}
