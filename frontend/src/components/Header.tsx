import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Office Desk Booking
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Map
        </Button>
        <Button color="inherit" component={Link} to="/reservations">
          My Reservations
        </Button>
        <Button color="inherit" component={Link} to="/admin">
          Admin
        </Button>
        <Button color="inherit" component={Link} to="/reports">
          Reports
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
