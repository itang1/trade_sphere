import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom';
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
  return (
    <AppBar position='static' style={{ background: 'teal' }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <NavText href='/' text='TRADING ECONOMICS PROJECT (CIS 5500)' isMain />
          <NavText href='/countries' text='COUNTRIES' />
          <NavText href='/trades' text='TRADES' />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
