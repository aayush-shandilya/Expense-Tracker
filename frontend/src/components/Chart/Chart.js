import React from 'react';
import {
  Chart as ChartJs,
  Tooltip,
  CategoryScale,
  LineElement,
  LinearScale,
  Title,
  Legend,
  PointElement,
  ArcElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box, styled } from '@mui/material';
import { useGlobalContext } from '../../context/globalContext';
import { dateFormat } from '../../utils/dateFormat';

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const ChartContainer = styled(Box)(({ theme }) => ({
  background: '#FCF6F9',
  border: '1px solid #FFFFFF',
  boxShadow: '0px 1px 8px rgba(0, 0, 0, 0.06)',
  borderRadius: '8px',
  padding: theme.spacing(1),
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

function Chart() {
  const { incomes, expenses } = useGlobalContext();

  const data = {
    labels: incomes.map((inc) => {
      const { date } = inc;
      return dateFormat(date);
    }),
    datasets: [
      {
        label: 'Income',
        data: [
          ...incomes.map((income) => {
            const { amount } = income;
            return amount;
          }),
        ],
        backgroundColor: 'green',
        borderColor: 'green',
        tension: 0.2,
        pointRadius: 2,  // Smaller points
      },
      {
        label: 'Expenses',
        data: [
          ...expenses.map((expense) => {
            const { amount } = expense;
            return amount;
          }),
        ],
        backgroundColor: 'red',
        borderColor: 'red',
        tension: 0.2,
        pointRadius: 2,  // Smaller points
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 10,
          font: {
            size: 10
          }
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 8
          },
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          font: {
            size: 8
          }
        },
        grid: {
          display: true,
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  return (
    <ChartContainer>
      <Box sx={{ 
        width: '100%', 
        height: '100%',
        maxHeight: '200px'  // Adjust this value as needed
      }}>
        <Line data={data} options={options} />
      </Box>
    </ChartContainer>
  );
}

export default Chart;