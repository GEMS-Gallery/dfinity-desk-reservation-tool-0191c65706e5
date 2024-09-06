import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import FloorMap from './components/FloorMap';
import Reservations from './components/Reservations';
import AdminDashboard from './components/AdminDashboard';
import Reports from './components/Reports';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976D2',
    },
    secondary: {
      main: '#4CAF50',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Routes>
        <Route path="/" element={<FloorMap />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
