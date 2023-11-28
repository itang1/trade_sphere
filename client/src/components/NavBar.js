import { AppBar, Container, Toolbar, Typography, Menu, MenuItem } from '@mui/material'
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

// import '../Style.css'; // Create a separate CSS file for styling

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
        // fontFamily: 'Roboto',
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

// Here, we define the NavBar. Note that we heavily leverage MUI components
// to make the component look nice. Feel free to try changing the formatting
// props to how it changes the look of the component.
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
          <NavText href='/' text='TRADING ECONOMICS WEBAPP' isMain />
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
            <MenuItem component={NavLink} to='/countries-living-conditions' onClick={handleMenuClose}>
              Living Conditions
            </MenuItem>
            <MenuItem component={NavLink} to='/countries-temperature' onClick={handleMenuClose}>
              Temperature
            </MenuItem>
            {/* Add more MenuItems as needed */}
          </Menu>
          <NavText href='/trades' text='TRADES' />
        </Toolbar>
      </Container>
    </AppBar>
  );
}