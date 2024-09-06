import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, CircularProgress, List, ListItem, ListItemText, Switch } from '@mui/material';
import { backend } from '../../declarations/backend';

interface Reservation {
  id: string;
  deskId: string;
  userId: string;
  date: bigint;
  isRecurring: boolean;
  recurringDays: number[];
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [deskId, setDeskId] = useState('');
  const [deskNumber, setDeskNumber] = useState('');
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const result = await backend.getAllReservations();
      setReservations(result);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleAddDesk = async () => {
    setLoading(true);
    try {
      const result = await backend.addDesk(deskId, BigInt(deskNumber), BigInt(x), BigInt(y));
      if ('ok' in result) {
        alert('Desk added successfully');
        setDeskId('');
        setDeskNumber('');
        setX('');
        setY('');
      } else {
        alert(`Failed to add desk: ${result.err}`);
      }
    } catch (error) {
      console.error('Error adding desk:', error);
      alert('An error occurred while adding the desk');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockDesk = async (deskId: string, isBlocked: boolean) => {
    try {
      const result = await backend.blockDesk(deskId, isBlocked);
      if ('ok' in result) {
        alert(`Desk ${isBlocked ? 'blocked' : 'unblocked'} successfully`);
        fetchReservations();
      } else {
        alert(`Failed to ${isBlocked ? 'block' : 'unblock'} desk: ${result.err}`);
      }
    } catch (error) {
      console.error('Error blocking/unblocking desk:', error);
      alert('An error occurred while blocking/unblocking the desk');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Box component="form" onSubmit={(e) => e.preventDefault()} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="deskId"
          label="Desk ID"
          name="deskId"
          value={deskId}
          onChange={(e) => setDeskId(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="deskNumber"
          label="Desk Number"
          name="deskNumber"
          type="number"
          value={deskNumber}
          onChange={(e) => setDeskNumber(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="x"
          label="X Coordinate"
          name="x"
          type="number"
          value={x}
          onChange={(e) => setX(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="y"
          label="Y Coordinate"
          name="y"
          type="number"
          value={y}
          onChange={(e) => setY(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleAddDesk}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Add Desk'}
        </Button>
      </Box>
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        All Reservations
      </Typography>
      <List>
        {reservations.map((reservation) => (
          <ListItem key={reservation.id}>
            <ListItemText
              primary={`Desk ${reservation.deskId} - User ${reservation.userId}`}
              secondary={`Date: ${new Date(Number(reservation.date)).toLocaleDateString()}`}
            />
            <Switch
              onChange={(e) => handleBlockDesk(reservation.deskId, e.target.checked)}
              inputProps={{ 'aria-label': 'Block desk' }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AdminDashboard;
