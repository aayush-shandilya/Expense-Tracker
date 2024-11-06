import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  styled
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGlobalContext } from '../../context/globalContext';
import { getAllCategories, getCategoryIcon, getCategoryLabel } from '../../config/categories';
import { updateCategories } from '../../config/categories';
import AddCategoryModal from '../Modals/AddCategoryModels';
import DeleteCategoryModal from '../Modals/DeleteCateoryModal';

// Styled components
const ContentWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const CategoryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '20px',
  backgroundColor: '#FCF6F9',
  border: '2px solid #FFFFFF',
  boxShadow: '0px 1px 15px rgba(0, 0, 0, 0.06)',
  marginBottom: theme.spacing(2),
}));

const CategoryItem = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.03)',
}));

const TransactionItem = styled(ListItem)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 100,
  height: 100,
  borderRadius: '20px',
  backgroundColor: 'rgba(252, 246, 249, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid #FFFFFF',
  marginRight: theme.spacing(3),
}));

function ExpensesCategory() {
  const {
    expenses,
    getExpenses,
    user,
    loading,
    error,
    getCategories,
    customCategories
  } = useGlobalContext();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategoryForDelete, setSelectedCategoryForDelete] = useState(null);

  const allCategories = getAllCategories();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        await Promise.all([getExpenses(), getCategories()]);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const updatedCategories = updateCategories(customCategories);
    setCategories(getAllCategories());
  }, [customCategories]);

  const categoryData = useMemo(() => {
    const initialData = allCategories.reduce((acc, category) => {
      acc[category] = {
        total: 0,
        count: 0,
        expenses: []
      };
      return acc;
    }, {});

    if (!Array.isArray(expenses) || expenses.length === 0) {
      return initialData;
    }

    return expenses.reduce((acc, expense) => {
      if (expense && typeof expense === 'object') {
        const expenseCategories = Array.isArray(expense.categories)
          ? expense.categories
          : [expense.category];

        expenseCategories.forEach(category => {
          const categoryKey = category?.toLowerCase();
          if (categoryKey && acc[categoryKey]) {
            const amount = parseFloat(expense.amount) || 0;
            acc[categoryKey].total += amount;
            acc[categoryKey].count += 1;
            acc[categoryKey].expenses.push({
              ...expense,
              amount: amount
            });
          }
        });
      }
      return acc;
    }, initialData);
  }, [expenses, allCategories]);

  const selectedCategoryData = useMemo(() => {
    if (selectedCategory === 'all') {
      if (!Array.isArray(expenses)) {
        return { total: 0, count: 0, expenses: [] };
      }

      return {
        total: expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0),
        count: expenses.length,
        expenses: expenses.map(expense => ({
          ...expense,
          categories: Array.isArray(expense.categories)
            ? expense.categories.map(cat => getCategoryLabel(cat)).join(', ')
            : getCategoryLabel(expense.category)
        }))
      };
    }

    return categoryData[selectedCategory] || { total: 0, count: 0, expenses: [] };
  }, [selectedCategory, expenses, categoryData]);

  if (!user) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 2 }}>
          Please log in to view category data.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ mx: 1}}>
      <ContentWrapper>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            
          </Typography>
          <Box sx={{ display: 'flex', gap: 2,  }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setIsAddModalOpen(true)}
              sx={{
                borderRadius: '30px',
                bgcolor: '#FF8C00',
                '&:hover': {
                  bgcolor: '#FF7000',
                },
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              Add Category
            </Button>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              sx={{
                minWidth: 200,
                bgcolor: 'background.paper',
                borderRadius: '10px',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {getCategoryLabel(category)}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Category Management Section */}
            <CategoryCard>
              <Typography variant="h5" gutterBottom sx={{fontFamily: 'Roboto, sans-serif'}}>
                Manage Categories
              </Typography>
              <Grid container spacing={2}>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <Grid item xs={12} sm={6} md={4} key={category}>
                    <CategoryItem>
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <Box sx={{ mr: 2 }}>{getCategoryIcon(category)}</Box>
                        <Typography sx={{fontFamily: 'Roboto, sans-serif'}}>{getCategoryLabel(category)}</Typography>
                      </Box>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setSelectedCategoryForDelete({
                            key: category,
                            label: getCategoryLabel(category)
                          });
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CategoryItem>
                  </Grid>
                ))}
              </Grid>
            </CategoryCard>

            {/* Category Details Section */}
            <CategoryCard>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconWrapper>
                  {selectedCategory !== 'all' && getCategoryIcon(selectedCategory)}
                </IconWrapper>
                <Box>
                  <Typography variant="h5" gutterBottom sx={{fontFamily: 'Roboto, sans-serif'}}>
                    {selectedCategory === 'all' ? 'Total Expenses' : getCategoryLabel(selectedCategory)}
                  </Typography>
                  <Typography variant="h5" color="error.main" gutterBottom sx={{fontFamily: 'Roboto, sans-serif'}}>
                    ₹{selectedCategoryData.total.toFixed(2).toLocaleString()}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {selectedCategoryData.count} transactions
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 1}} />

              {selectedCategoryData.expenses.length > 0 ? (
                <>
                  <Typography variant="h6" gutterBottom sx={{fontFamily: 'Roboto, sans-serif'}}>
                    Recent Transactions in {selectedCategory === 'all' ? 'All Categories' : getCategoryLabel(selectedCategory)}
                  </Typography>
                  <List>
                    {selectedCategoryData.expenses
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .slice(0, 5)
                      .map((expense) => (
                        <TransactionItem key={expense._id}>
                          <ListItemText
                            primary={expense.title}
                            secondary={
                              <Box>
                                <Typography variant="body2" sx={{fontFamily: 'Roboto, sans-serif'}}>{expense.description}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{fontFamily: 'Roboto, sans-serif'}}>
                                  {new Date(expense.date).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{fontFamily: 'Roboto, sans-serif'}}>
                                  Categories: {Array.isArray(expense.categories) && expense.categories.length > 0
                                    ? expense.categories.map(cat => getCategoryLabel(cat)).join(', ')
                                    : expense.category
                                      ? getCategoryLabel(expense.category)
                                      : "All Categories"}
                                </Typography>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Typography variant="subtitle1" color="error">
                              ₹{parseFloat(expense.amount).toLocaleString()}
                            </Typography>
                          </ListItemSecondaryAction>
                        </TransactionItem>
                      ))}
                  </List>
                </>
              ) : (
                <Alert severity="info">
                  No transactions found for {selectedCategory === 'all'
                    ? 'any category'
                    : getCategoryLabel(selectedCategory)}
                </Alert>
              )}
            </CategoryCard>
          </>
        )}

        {/* Modals */}
        <AddCategoryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
        <DeleteCategoryModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedCategoryForDelete(null);
          }}
          category={selectedCategoryForDelete}
        />
      </ContentWrapper>
    </Box>
  );
}

export default ExpensesCategory;