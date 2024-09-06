import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Button } from '@mui/material';
import { backend } from '../../declarations/backend';

interface Reservation {
  id: string;
  deskId: string;
  userId: string;
  date: bigint;
  isRecurring: boolean;
  recurringDays: number[];
}

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const result = await backend.getReservations('user123'); // Replace with actual user ID
        setReservations(result);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleMarkPreferred = async (deskId: string) => {
    try {
      const result = await backend.markPreferredDesk(deskId);
      if ('ok' in result) {
        alert('Desk marked as preferred!');
      } else {
        alert(`Failed to mark desk as preferred: ${result.err}`);
      }
    } catch (error) {
      console.error('Error marking preferred desk:', error);
      alert('An error occurred while marking the desk as preferred');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        My Reservations
      </Typography>
      {reservations.length > 0 ? (
        <List>
          {reservations.map((reservation) => (
            <ListItem key={reservation.id}>
              <ListItemText
                primary={`Desk ${reservation.deskId}`}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="textPrimary">
                      Date: {new Date(Number(reservation.date)).toLocaleDateString()}
                    </Typography>
                    {reservation.isRecurring && (
                      <Typography component="span" variant="body2" color="textSecondary">
                        Recurring: {reservation.recurringDays.join(', ')}
                      </Typography>
                    )}
                  </>
                }
              />
              <Button onClick={() => handleMarkPreferred(reservation.deskId)}>Mark Preferred</Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No reservations found</Typography>
      )}
    </Box>
  );
};

export default Reservations;
