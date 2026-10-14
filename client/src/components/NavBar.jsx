import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material'
import { NavLink, useLocation } from 'react-router-dom';
import React from 'react';

const activeStyle = { opacity: 1, bgcolor: 'rgba(255, 255, 255, 0.18)', boxShadow: 'inset 0 -3px 0 #fff' };

const linkStyle = {
  color: 'inherit', fontSize: { xs: '0.85rem', sm: '1rem' }, whiteSpace: 'nowrap', minWidth: 0,
  opacity: 0.8, px: { xs: 1, sm: 1.5 }, borderRadius: 1,
  '&:hover': { opacity: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' },
  '&.active': activeStyle,
};

export default function NavBar() {
  const { pathname } = useLocation();
  const onCountryPage = pathname.startsWith('/countries');

  return (
    <AppBar position='sticky' color='primary'>
      <Container maxWidth='lg'>
        <Toolbar disableGutters sx={{ gap: { xs: 0.25, sm: 1 }, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
          <Typography
            component={NavLink}
            to='/'
            variant='h6'
            sx={{ display: { xs: 'none', sm: 'block' }, color: 'inherit', textDecoration: 'none', fontWeight: 800, letterSpacing: '.05rem', mr: 'auto' }}
          >
            TradeSphere
          </Typography>
          <Button component={NavLink} to='/' end sx={linkStyle}>Home</Button>
          <Button component={NavLink} to='/trades' sx={linkStyle}>US Trade</Button>
          <Button component={NavLink} to='/countries-living-conditions' sx={{ ...linkStyle, ...(onCountryPage && activeStyle) }}>Country Profiles</Button>
          <Button component={NavLink} to='/about' sx={linkStyle}>About</Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
