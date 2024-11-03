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
import ExpensesForm from './ExpensesForm';

// Styled components
const ContentContainer = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 100px)',
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

const ExpenseItemCard = styled(Card)(({ theme }) => ({
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

// Expense Item Component
const ExpenseItem = ({ id, title, amount, date, category, categories, description, deleteItem }) => {
  const formattedDate = new Date(date).toLocaleDateString();
  const categoryDisplay = categories ? categories.join(', ') : category;
  
  return (
    <ExpenseItemCard>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle1" component="div" color="error" sx={{ fontWeight: 'bold' }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              {categoryDisplay} • {formattedDate}
            </Typography>
            {description && (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mt: 0.5 }}>
                {description}
              </Typography>
            )}
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="subtitle1" color="error" sx={{ mr: 1 }}>
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
    </ExpenseItemCard>
  );
};

// Main Expenses Component
function Expenses() {
  const {
    addExpense,
    expenses,
    getExpenses,
    deleteExpense,
    totalExpense,
    loading,
    error,
    setError,
    user
  } = useGlobalContext();

  useEffect(() => {
    if (user) {
      getExpenses();
    }
  }, [user]);

  const handleDelete = useCallback(async (id) => {
    try {
      const result = await deleteExpense(id);
      if (result.success) {
        getExpenses();
      } else {
        setError(result.error || 'Failed to delete expense');
      }
    } catch (err) {
      setError('Failed to delete expense. Please try again.');
    }
  }, [deleteExpense, setError, getExpenses]);

  const memoizedTotalExpense = useMemo(() => totalExpense(), [expenses]);

  if (!user) {
    return (
      <Container>
        <Alert severity="warning">
          Please log in to view your expense data.
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
              color="error"
              sx={{ fontWeight: 'bold' }}
            >
              Total: ₹{memoizedTotalExpense.toLocaleString()}
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
                <ExpensesForm />
              </ContentWrapper>
            </StyledPaper>
          </Grid>
          
          {/* Expense List Section */}
          <Grid item xs={12} md={6} sx={{ height: '100%' }}>
            <StyledPaper>
              <ContentWrapper>
                {loading ? (
                  <Box display="flex" justifyContent="center" p={2}>
                    <CircularProgress size={24} />
                  </Box>
                ) : expenses && expenses.length > 0 ? (
                  expenses.map((expense) => (
                    <ExpenseItem
                      key={expense._id}
                      id={expense._id}
                      title={expense.title}
                      description={expense.description}
                      amount={expense.amount}
                      date={expense.date}
                      category={expense.category}
                      categories={expense.categories}
                      deleteItem={handleDelete}
                    />
                  ))
                ) : (
                  <Alert severity="info">
                    No expense records found.
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

export default Expenses;