import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  styled,
  FormControl,
  OutlinedInput,
  InputLabel,
  MenuItem,
  Select,
  Chip,
  ListItemText,
  Checkbox
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useGlobalContext } from '../../context/globalContext';
import dayjs from 'dayjs';
import { updateCategories, getAllCategories, getCategoryLabel } from '../../config/categories';

// Styled components
const StyledForm = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '10px',
    '& fieldset': {
      borderWidth: '2px',
      borderColor: theme.palette.grey[200],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '10px 14px',
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    transform: 'translate(14px, 11px) scale(1)',
    '&.Mui-focused, &.MuiFormLabel-filled': {
      transform: 'translate(14px, -9px) scale(0.75)',
    },
  },
}));

const StyledSelect = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '10px',
    '& fieldset': {
      borderWidth: '2px',
      borderColor: theme.palette.grey[200],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

function ExpenseForm() {
  const {
    addExpense,
    error,
    setError,
    user,
    getCategories,
    customCategories
  } = useGlobalContext();

  const [loading, setLoading] = useState(false);
  const [inputState, setInputState] = useState({
    title: '',
    amount: '',
    date: null,
    description: '',
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (user) {
      getCategories();
    }
  }, [user]);

  useEffect(() => {
    const updatedCategories = updateCategories(customCategories);
    setCategories(getAllCategories());
  }, [customCategories]);

  const handleInput = (name) => (event) => {
    let value = event.target.value;
    if (name === 'amount') {
      value = value.replace(/[^0-9.]/g, '');
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }
    }
    setInputState({ ...inputState, [name]: value });
    setError('');
  };

  const handleDateChange = (newDate) => {
    setInputState({ ...inputState, date: newDate });
    setError('');
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategories(value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('Please log in to add expenses');
      return;
    }

    if (!inputState.title || selectedCategories.length === 0 || !inputState.description || !inputState.date) {
      setError('All fields are required! Please select at least one category.');
      return;
    }

    const numericAmount = parseFloat(inputState.amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }

    try {
      setLoading(true);
      const formData = {
        ...inputState,
        amount: numericAmount,
        categories: selectedCategories,
        type: 'expense',
        user: user._id
      };

      const response = await addExpense(formData);

      if (response.success) {
        setInputState({
          title: '',
          amount: '',
          date: null,
          description: '',
        });
        setSelectedCategories([]);
      } else {
        setError(response.error || 'Failed to add expense');
      }
    } catch (err) {
      setError('Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledForm component="form" onSubmit={handleSubmit}>
        {error && (
          <Alert 
            severity="error" 
            onClose={() => setError('')}
            sx={{ py: 0, borderRadius: '10px' }}
          >
            {error}
          </Alert>
        )}

        <StyledTextField
          fullWidth
          label="Expense Title"
          value={inputState.title}
          onChange={handleInput('title')}
          placeholder="e.g., Groceries"
          required
          size="small"
        />

        <StyledTextField
          fullWidth
          label="Amount"
          type="number"
          value={inputState.amount}
          onChange={handleInput('amount')}
          required
          size="small"
        />

        <DatePicker
          label="Select Date"
          value={inputState.date}
          onChange={handleDateChange}
          renderInput={(params) => (
            <StyledTextField
              {...params}
              fullWidth
              required
              size="small"
            />
          )}
        />

        <StyledSelect size="small" fullWidth>
          <InputLabel id="category-select-label">Categories</InputLabel>
          <Select
            labelId="category-select-label"
            multiple
            value={selectedCategories}
            onChange={handleCategoryChange}
            input={<OutlinedInput label="Categories" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip 
                    key={value} 
                    label={getCategoryLabel(value)}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(255, 140, 0, 0.1)',
                      '& .MuiChip-label': { color: 'rgb(255, 140, 0)' }
                    }}
                  />
                ))}
              </Box>
            )}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 224,
                  marginTop: 8,
                },
              },
            }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                <Checkbox checked={selectedCategories.indexOf(category) > -1} />
                <ListItemText primary={getCategoryLabel(category)} />
              </MenuItem>
            ))}
          </Select>
        </StyledSelect>

        <StyledTextField
          fullWidth
          label="Description"
          value={inputState.description}
          onChange={handleInput('description')}
          placeholder="Add a reference note"
          multiline
          rows={3}
          size="small"
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            borderRadius: '20px',
            padding: '8px 16px',
            backgroundColor: (theme) => theme.palette.error.main,
            '&:hover': {
              backgroundColor: (theme) => theme.palette.error.dark,
            },
            textTransform: 'none',
            alignSelf: 'flex-start',
            mt: 1
          }}
        >
          {loading ? 'Adding...' : 'Add Expense'}
        </Button>
      </StyledForm>
    </LocalizationProvider>
  );
}

export default ExpenseForm;