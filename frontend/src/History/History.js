import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Stack,
  styled 
} from '@mui/material';
import { useGlobalContext } from '../context/globalContext';
import { useAuth } from '../context/AuthContext';

// Styled components using MUI styled
const HistoryItem = styled(Paper)(({ theme }) => ({
  background: '#FCF6F9',
  border: '1px solid #FFFFFF',
  boxShadow: '0px 1px 8px rgba(0, 0, 0, 0.06)',
  padding: theme.spacing(0.75),
  borderRadius: '8px',
}));

const LoadingItem = styled(Box)({
  height: '2.5rem',
  background: '#eee',
  borderRadius: '8px',
});

const History = () => {
    const { transactionHistory, loading, error } = useGlobalContext();
    const { user } = useAuth();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (user) {
            setHistory(transactionHistory);
        }
    }, [user, transactionHistory]);

    if (loading) {
        return (
            <Box>
                <Typography variant="subtitle2" sx={{ 
                    mb: 1,
                    fontSize: '0.9rem',
                    fontWeight: 600
                }}>
                    Recent History
                </Typography>
                <Stack spacing={1}>
                    {[1, 2, 3].map((i) => (
                        <LoadingItem key={i} />
                    ))}
                </Stack>
            </Box>
        );
    }

    if (error) {
        return (
            <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.9rem' }}>
                    Recent History
                </Typography>
                <Paper sx={{
                    background: '#fee',
                    color: 'red',
                    p: 1,
                    borderRadius: 1,
                    fontSize: '0.8rem'
                }}>
                    {error}
                </Paper>
            </Box>
        );
    }

    if (!history.length) {
        return (
            <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.9rem' }}>
                    Recent History
                </Typography>
                <Paper sx={{
                    background: '#FCF6F9',
                    p: 1,
                    borderRadius: 1,
                    color: 'text.secondary',
                    textAlign: 'center',
                    fontSize: '0.8rem'
                }}>
                    No transactions yet
                </Paper>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="subtitle2" sx={{ 
                mb: 1,
                fontSize: '0.9rem',
                fontWeight: 'bold',
                fontFamily: 'Roboto, sans-serif'
            }}>
                Recent History
            </Typography>
            <Stack spacing={0.75}>
                {history.map((item) => {
                    const { _id, title, amount, type, createdAt } = item;
                    const isExpense = type === 'expense';

                    return (
                        <HistoryItem key={_id}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Box>
                                    <Typography sx={{
                                        fontSize: '0.85rem',
                                        fontWeight: 'bold',
                                        color: 'text.primary',
                                        lineHeight: 1.2,
                                        fontFamily: 'Roboto, sans-serif',
                                        
                                    }}>
                                        {title}
                                    </Typography>
                                    <Typography sx={{
                                        fontSize: '0.7rem',
                                        color: 'text.secondary',
                                        mt: 0.25,
                                        fontFamily: 'Roboto, sans-serif'
                                    }}>
                                        {new Date(createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Typography sx={{
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    color: isExpense ? 'error.main' : 'success.main',
                                }}>
                                    {isExpense 
                                        ? `-₹${amount <= 0 ? 0 : amount.toLocaleString()}`
                                        : `+₹${amount <= 0 ? 0 : amount.toLocaleString()}`
                                    }
                                </Typography>
                            </Box>
                        </HistoryItem>
                    );
                })}
            </Stack>
        </Box>
    );
};

export default History;