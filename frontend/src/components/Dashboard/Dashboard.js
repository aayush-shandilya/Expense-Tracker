import React, { useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  styled,
  useTheme,
  useMediaQuery 
} from '@mui/material';

import { useGlobalContext } from '../../context/globalContext';
import History from '../../History/History';
import Chart from '../Chart/Chart';

// Styled components with optimized sizing
const QuadrantPaper = styled(Paper)(({ theme }) => ({
  background: '#FCF6F9',
  border: '2px solid #FFFFFF',
  boxShadow: '0px 1px 15px rgba(0, 0, 0, 0.06)',
  borderRadius: '10px',
  padding: theme.spacing(1),  // Reduced base padding
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const StatsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),  // Reduced gap
  height: '100%',
  justifyContent: 'space-around',
}));

const StatItem = styled(Box)(({ theme }) => ({
  background: '#FCF6F9',
  border: '1px solid #FFFFFF',  // Reduced border thickness
  boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.06)',
  borderRadius: '8px',
  padding: theme.spacing(1),  // Reduced padding
  textAlign: 'center',
  minHeight: '60px',  // Set minimum height
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const AmountTypography = styled(Typography)(({ variant }) => ({
  fontWeight: 600,  // Slightly reduced weight
  fontSize: variant === 'balance' ? '1.25rem' : '1.1rem',  // Further reduced font sizes
  color: variant === 'balance' ? 'var(--color-green)' : 'inherit',
  opacity: variant === 'balance' ? 0.6 : 1,
  fontFamily: 'Roboto, sans-serif'
}));

function Dashboard() {
  const {
    totalExpense,
    incomes,
    expenses,
    totalIncome,
    totalBalance,
    getIncomes,
    getExpenses
  } = useGlobalContext();

  useEffect(() => {
    getIncomes();
    getExpenses();
  }, []);



  return (
    <Grid container spacing={0} sx={{ height: '100%' }}>
      {/* Quadrant 1: Chart */}
      <Grid item xs={12} md={6} sx={{ 
        height: '50%',
        paddingLeft: '5px',
        paddingRight: '5px',
        paddingTop: '5px',
        paddingBottom: '5px',
      }}>
        <QuadrantPaper>
          <Box sx={{ flex: 1 }}>
            <Chart />
          </Box>
        </QuadrantPaper>
      </Grid>

      {/* Quadrant 2: Financial Stats */}
      <Grid item xs={12} md={6} sx={{ 
        height: '50%',
        paddingLeft: '5px',
        paddingRight: '5px',
        paddingTop: '5px',
        paddingBottom: '5px',
      }}>
        <QuadrantPaper>
          <StatsBox>
            <StatItem>
              <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', fontFamily: 'Roboto, sans-serif' }}>
                Total Income
              </Typography>
              <AmountTypography>₹{totalIncome()}</AmountTypography>
            </StatItem>
            
            <StatItem>
              <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', fontFamily: 'Roboto, sans-serif' }}>
                Total Expense
              </Typography>
              <AmountTypography>₹{totalExpense()}</AmountTypography>
            </StatItem>
            
            <StatItem>
              <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', fontFamily: 'Roboto, sans-serif' }}>
                Total Balance
              </Typography>
              <AmountTypography variant="balance">₹{totalBalance()}</AmountTypography>
            </StatItem>
          </StatsBox>
        </QuadrantPaper>
      </Grid>

      {/* Quadrant 3: Recent History */}
      <Grid item xs={12} md={6} sx={{ 
        height: '50%',
        paddingLeft: '5px',
        paddingRight: '5px',
        paddingTop: '5px',
        paddingBottom: '5px',
      }}>
        <QuadrantPaper>
          <Box sx={{ 
            flex: 1,
            overflow: 'hidden',
          }}>
            <History />
          </Box>
        </QuadrantPaper>
      </Grid>

      {/* Quadrant 4: Min-Max Stats */}
      <Grid item xs={12} md={6} sx={{ 
        height: '50%',
        paddingLeft: '5px',
        paddingRight: '5px',
        paddingTop: '5px',
        paddingBottom: '5px',
      }}>
        <QuadrantPaper>
          <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 1,fontWeight: 'bold',fontFamily: 'Roboto, sans-serif' }}>
            Income & Expense Range
          </Typography>
          
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1
          }}>
            {/* Salary Range */}
            <Box>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', mb: 0.5,fontWeight:'bold',color: 'green', fontFamily: 'Roboto, sans-serif' }}>
                Salary Range
              </Typography>
              <StatItem>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontSize: '0.7rem',color: '#4caf50',fontFamily: 'Roboto, sans-serif' }}>
                      Min
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem',fontFamily: 'Roboto, sans-serif' }}>
                      ₹{Math.min(...incomes.map(item => item.amount))}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontSize: '0.7rem',color:'#357a38',fontFamily: 'Roboto, sans-serif'}}>
                      Max
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem',fontFamily: 'Roboto, sans-serif' }}>
                      ₹{Math.max(...incomes.map(item => item.amount))}
                    </Typography>
                  </Box>
                </Box>
              </StatItem>
            </Box>

            {/* Expense Range */}
            <Box>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', mb: 0.5 ,fontWeight:'bold',color:'#ff1744',fontFamily: 'Roboto, sans-serif'}}>
                Expense Range
              </Typography>
              <StatItem>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontSize: '0.7rem' , color:'#ff4569',fontFamily: 'Roboto, sans-serif'}}>
                      Min
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem',fontFamily: 'Roboto, sans-serif' }}>
                      ₹{Math.min(...expenses.map(item => item.amount))}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontSize: '0.7rem', color:'#b2102f',fontFamily: 'Roboto, sans-serif' }}>
                      Max
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem',fontFamily: 'Roboto, sans-serif' }}>
                      ₹{Math.max(...expenses.map(item => item.amount))}
                    </Typography>
                  </Box>
                </Box>
              </StatItem>
            </Box>
          </Box>
        </QuadrantPaper>
      </Grid>
    </Grid>
  );
}

export default Dashboard;