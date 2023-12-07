import { AppBar, Container, Toolbar, Typography, Menu, MenuItem } from '@mui/material'
import { NavLink } from 'react-router-dom';
import React, { useState } from 'react';


// The hyperlinks in the NavBar contain a lot of repeated formatting code so a
// helper component NavText local to the file is defined to prevent repeated code.
function NavText({ href, text, isMain }) {
  return (
    <Typography
      variant={isMain ? 'h5' : 'h7'}
      noWrap
      style={{
        marginRight: '30px',
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
      }}
    >
      <NavLink
        to={href}
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  )
}

export default function NavBar() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position='static' style={{ background: 'teal' }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <NavText href='/' text='TRADESPHERE' isMain />
          <Typography
            variant='h7'
            noWrap
            style={{
              marginRight: '30px',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              cursor: 'pointer',
              color: 'inherit',
              textDecoration: 'none',
            }}
            onClick={handleMenuClick}
          >
            COUNTRIES
          </Typography>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            getContentAnchorEl={null}
          >
            <MenuItem component={NavLink} to='/countries-living-conditions' onClick={handleMenuClose}>Living Conditions</MenuItem>
            <MenuItem component={NavLink} to='/countries-temperature' onClick={handleMenuClose}>Temperature</MenuItem>
            <MenuItem component={NavLink} to='/countries-labor' onClick={handleMenuClose}>Labor</MenuItem>
            <MenuItem component={NavLink} to='/countries-wages' onClick={handleMenuClose}>Wages</MenuItem>
            <MenuItem component={NavLink} to='/countries-wage-growth' onClick={handleMenuClose}>Wage Growth</MenuItem>
            {/* Add more MenuItems as needed */}
          </Menu>
          <NavText href='/trades' text='TRADES' />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
