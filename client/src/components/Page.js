import { Box, Container, Paper, Typography } from '@mui/material';

export default function Page({ title, intro, children }) {
  return (
    <Container maxWidth='lg' sx={{ py: 5 }}>
      <Typography variant='h1' gutterBottom>{title}</Typography>
      {intro && (
        <Box sx={{ color: 'text.secondary', maxWidth: 820, mb: 4, '& p': { mt: 0, lineHeight: 1.7 } }}>
          {intro}
        </Box>
      )}
      {children}
    </Container>
  );
}

export function Section({ title, description, children }) {
  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
      {title && <Typography variant='h2' gutterBottom>{title}</Typography>}
      {description && (
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2, lineHeight: 1.7 }}>
          {description}
        </Typography>
      )}
      {children}
    </Paper>
  );
}

export function Note({ children }) {
  return (
    <Typography component='div' variant='body2' color='text.secondary' sx={{ mt: 2, fontStyle: 'italic', lineHeight: 1.7 }}>
      {children}
    </Typography>
  );
}
