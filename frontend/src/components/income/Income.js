import React, { useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Card,
  CardContent,
  styled
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGlobalContext } from '../../context/globalContext';
import Form from '../Form/Form';

// Styled components
const ContentContainer = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 100px)', // Adjust total height
  display: 'flex',
  flexDirection: 'column',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '100%',
  backgroundColor: '#FCF6F9',
  borderRadius: '15px',
  boxShadow: '0px 1px 15px rgba(0, 0, 0, 0.06)',
  display: 'flex',
  flexDirection: 'column',
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  flexGrow: 1,
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#555',
  },
}));

const IncomeItemCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#FCF6F9',
  borderRadius: '15px',
  marginBottom: theme.spacing(1),
  boxShadow: '0px 1px 15px rgba(0, 0, 0, 0.06)',
  '& .MuiCardContent-root': {
    padding: theme.spacing(1.5),
    '&:last-child': {
      paddingBottom: theme.spacing(1.5),
    },
  },
}));

// Income Item Component
const IncomeItem = ({ id, title, amount, date, category, description, deleteItem }) => {
  const formattedDate = new Date(date).toLocaleDateString();
  
  return (
    <IncomeItemCard>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle1" component="div" color="primary" sx={{ fontWeight: 'bold' }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              {category} • {formattedDate}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="subtitle1" color="success.main" sx={{ mr: 1 }}>
              ₹{amount.toLocaleString()}
            </Typography>
            <IconButton
              onClick={() => deleteItem(id)}
              color="error"
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </IncomeItemCard>
  );
};

// Main Income Component
function Income() {
  const {
    addIncome,
    incomes,
    getIncomes,
    deleteIncome,
    totalIncome,
    loading,
    error,
    user
  } = useGlobalContext();

  useEffect(() => {
    if (user) {
      getIncomes();
    }
  }, [user]);

  const handleDelete = useCallback(async (id) => {
    await deleteIncome(id);
    getIncomes();
  }, [deleteIncome, getIncomes]);

  const memoizedTotalIncome = useMemo(() => totalIncome(), [incomes]);

  if (!user) {
    return (
      <Container>
        <Alert severity="warning">
          Please log in to view your income data.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <ContentContainer>
        {/* Header Section */}
        <Box sx={{ mb: 2, mt: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h5" component="h1">
              
            </Typography>
            <Typography
              variant="h5"
              color="primary.main"
              sx={{ fontWeight: 'bold' }}
            >
              Total Income: ₹{memoizedTotalIncome.toLocaleString()}
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          )}
        </Box>

        {/* Main Content */}
        <Grid container spacing={3} sx={{ flexGrow: 1 }}>
          {/* Form Section */}
          <Grid item xs={12} md={6} sx={{ height: '100%' }}>
            <StyledPaper>
              <ContentWrapper>
                <Form />
              </ContentWrapper>
            </StyledPaper>
          </Grid>
          
          {/* Income List Section */}
          <Grid item xs={12} md={6} sx={{ height: '100%' }}>
            <StyledPaper>
              <ContentWrapper>
                {loading ? (
                  <Box display="flex" justifyContent="center" p={2}>
                    <CircularProgress size={24} />
                  </Box>
                ) : incomes && incomes.length > 0 ? (
                  incomes.map((income) => (
                    <IncomeItem
                      key={income._id}
                      id={income._id}
                      title={income.title}
                      description={income.description}
                      amount={income.amount}
                      date={income.date}
                      type={income.type}
                      category={income.category}
                      deleteItem={handleDelete}
                    />
                  ))
                ) : (
                  <Alert severity="info">
                    No income records found.
                  </Alert>
                )}
              </ContentWrapper>
            </StyledPaper>
          </Grid>
        </Grid>
      </ContentContainer>
    </Container>
  );
}

export default Income;