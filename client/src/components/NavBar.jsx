import { AppBar, Button, Container, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import { NavLink, useLocation } from 'react-router-dom';
import React, { useState } from 'react';

const COUNTRY_PAGES = [
  { to: '/countries-living-conditions', label: 'Living Conditions' },
  { to: '/countries-temperature', label: 'Temperature' },
  { to: '/countries-labor', label: 'Labor' },
  { to: '/countries-wages', label: 'Wages' },
  { to: '/countries-wage-growth', label: 'Wage Growth' },
];

const activeStyle = { opacity: 1, bgcolor: 'rgba(255, 255, 255, 0.18)', boxShadow: 'inset 0 -3px 0 #fff' };

const linkStyle = {
  color: 'inherit', fontSize: '1rem', opacity: 0.8, px: 1.5, borderRadius: 1,
  '&:hover': { opacity: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' },
  '&.active': activeStyle,
};

export default function NavBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { pathname } = useLocation();
  const onCountryPage = pathname.startsWith('/countries');

  return (
    <AppBar position='sticky' color='primary'>
      <Container maxWidth='lg'>
        <Toolbar disableGutters sx={{ gap: 1 }}>
          <Typography
            component={NavLink}
            to='/'
            variant='h6'
            sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 800, letterSpacing: '.05rem', mr: 'auto' }}
          >
            TradeSphere
          </Typography>
          <Button component={NavLink} to='/' end sx={linkStyle}>Home</Button>
          <Button component={NavLink} to='/trades' sx={linkStyle}>Trades</Button>
          <Button
            onClick={e => setAnchorEl(e.currentTarget)}
            sx={{ ...linkStyle, ...(onCountryPage && activeStyle) }}
            endIcon={<span style={{ fontSize: '0.7rem' }}>▼</span>}
          >
            Countries
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            {COUNTRY_PAGES.map(page => (
              <MenuItem key={page.to} component={NavLink} to={page.to} selected={pathname === page.to} onClick={() => setAnchorEl(null)}>
                {page.label}
              </MenuItem>
            ))}
          </Menu>
          <Button component={NavLink} to='/about' sx={linkStyle}>About</Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
