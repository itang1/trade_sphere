import React, { useEffect, useState } from 'react';
import { Alert, Box, LinearProgress, Typography } from '@mui/material';

import { usesBrowserDatabase } from '../api';
import { getDatabase } from '../db';

// The first visit downloads a 10 MB database, so say so instead of showing empty tables
export default function DatabaseStatus() {
  const [status, setStatus] = useState(usesBrowserDatabase ? 'loading' : 'ready');

  useEffect(() => {
    if (!usesBrowserDatabase) return;
    getDatabase().then(() => setStatus('ready')).catch(() => setStatus('error'));
  }, []);

  if (status === 'ready') return null;
  if (status === 'error') {
    return <Alert severity='error' sx={{ borderRadius: 0 }}>The database couldn't load. Try refreshing the page.</Alert>;
  }
  return (
    <Box sx={{ position: 'sticky', top: 64, zIndex: 1, bgcolor: 'background.default' }}>
      <LinearProgress />
      <Typography variant='body2' color='text.secondary' align='center' sx={{ py: 1 }}>
        Loading the database (about 10 MB)…
      </Typography>
    </Box>
  );
}
