import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Input } from '@mui/material';
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet';
import { backend } from '../../declarations/backend';

interface Desk {
  id: string;
  number: number;
  x: number;
  y: number;
  isBlocked: boolean;
}

interface Floor {
  id: string;
  name: string;
  map: Uint8Array;
}

const FloorMap = () => {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [desks, setDesks] = useState<Desk[]>([]);
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const floorsResult = await backend.getFloors();
        const desksResult = await backend.getDesks();
        setFloors(floorsResult);
        setDesks(desksResult);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeskClick = (desk: Desk) => {
    setSelectedDesk(desk);
    setShowConfirmation(true);
  };

  const handleConfirmReservation = async () => {
    if (selectedDesk) {
      try {
        const result = await backend.makeReservation(selectedDesk.id, BigInt(Date.now()), false, []);
        if ('ok' in result) {
          alert('Reservation confirmed!');
        } else {
          alert(`Failed to make reservation: ${result.err}`);
        }
      } catch (error) {
        console.error('Error making reservation:', error);
        alert('An error occurred while making the reservation');
      }
    }
    setShowConfirmation(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setUploadedFile(file);
    } else {
      alert('Please upload a valid .jpg or .png file');
    }
  };

  const handleUploadConfirm = async () => {
    if (uploadedFile) {
      try {
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const result = await backend.uploadFloorMap(
          `floor_${Date.now()}`,
          uploadedFile.name,
          uint8Array
        );
        if ('ok' in result) {
          alert('Floor map uploaded successfully');
          const floorsResult = await backend.getFloors();
          setFloors(floorsResult);
        } else {
          alert(`Failed to upload floor map: ${result.err}`);
        }
      } catch (error) {
        console.error('Error uploading floor map:', error);
        alert('An error occurred while uploading the floor map');
      }
    }
    setShowUploadDialog(false);
    setUploadedFile(null);
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
        Floor Map
      </Typography>
      <Button variant="contained" onClick={() => setShowUploadDialog(true)} sx={{ mb: 2 }}>
        Upload Floor Map
      </Button>
      {floors.length > 0 && (
        <MapContainer center={[50, 50]} zoom={2} style={{ height: '500px', width: '100%' }}>
          <ImageOverlay
            bounds={[[0, 0], [100, 100]]}
            url={URL.createObjectURL(new Blob([floors[0].map], { type: 'image/png' }))}
          />
          {desks.map((desk) => (
            <Marker
              key={desk.id}
              position={[desk.y, desk.x]}
              eventHandlers={{
                click: () => handleDeskClick(desk),
              }}
            >
              <Popup>
                Desk {desk.number}
                <br />
                {desk.isBlocked ? 'Blocked' : 'Available'}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
      <Dialog open={showConfirmation} onClose={() => setShowConfirmation(false)}>
        <DialogTitle>Confirm Reservation</DialogTitle>
        <DialogContent>
          Do you want to reserve Desk {selectedDesk?.number}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmation(false)}>Cancel</Button>
          <Button onClick={handleConfirmReservation} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showUploadDialog} onClose={() => setShowUploadDialog(false)}>
        <DialogTitle>Upload Floor Map</DialogTitle>
        <DialogContent>
          <Input type="file" onChange={handleFileUpload} accept="image/jpeg,image/png" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUploadDialog(false)}>Cancel</Button>
          <Button onClick={handleUploadConfirm} color="primary" disabled={!uploadedFile}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FloorMap;
