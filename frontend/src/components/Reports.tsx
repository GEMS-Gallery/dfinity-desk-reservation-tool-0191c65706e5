import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { backend } from '../../declarations/backend';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface OccupancyReport {
  totalDesks: bigint;
  occupiedDesks: bigint;
  date: bigint;
}

const Reports = () => {
  const [occupancyData, setOccupancyData] = useState<OccupancyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOccupancyReport = async () => {
      try {
        const endDate = BigInt(Date.now());
        const startDate = endDate - BigInt(7 * 24 * 60 * 60 * 1000); // 7 days ago
        const result = await backend.getOccupancyReport(startDate, endDate);
        setOccupancyData(result);
      } catch (error) {
        console.error('Error fetching occupancy report:', error);
        setError('Failed to load occupancy report. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOccupancyReport();
  }, []);

  const chartData = {
labels: occupancyData.map(data => new Date(Number(data.date)).toLocaleDateString()),
    datasets: [
      {
        label: 'Occupancy Rate',
        data: occupancyData.map(data => Number(data.occupiedDesks * BigInt(100) / data.totalDesks)),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Desk Occupancy Rate',
      },
    },
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => window.location.reload()} variant="contained" sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Occupancy Reports
      </Typography>
      {occupancyData.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <Typography>No occupancy data available</Typography>
      )}
    </Box>
  );
};

export default Reports;
